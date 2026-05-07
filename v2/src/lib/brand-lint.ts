// Brand voice linter: scan a draft against the rules in
// wiki/articles/brand-comms/01-voice-and-tone.md and report violations.
// Same logic powers /api/brand-lint and /tools/brand-lint UI.

export type Severity = 'error' | 'warning';

export interface BrandViolation {
  /** Stable rule ID for filtering or suppression */
  ruleId: string;
  severity: Severity;
  /** Char offset of the start of the violation in the input text */
  start: number;
  /** Char offset of the end (exclusive) */
  end: number;
  /** The exact substring that triggered the rule */
  match: string;
  /** Short human-facing message */
  message: string;
  /** Recommended replacement, if applicable */
  suggestion?: string;
}

interface RuleSpec {
  id: string;
  severity: Severity;
  /** A regex that flags occurrences. Must use `g` flag. */
  pattern: RegExp;
  /** Function to build the message and suggestion for a match */
  describe: (match: string) => { message: string; suggestion?: string };
}

const RULES: RuleSpec[] = [
  {
    id: 'em-dash',
    severity: 'error',
    pattern: /—|&mdash;/g,
    describe: () => ({
      message: 'Em dash banned. Use a colon, period, or recast the sentence.',
      suggestion: '. ',
    }),
  },
  {
    id: 'banned-donate',
    severity: 'error',
    pattern: /\b(donate|donation|donations|donating|charity|charitable)\b/gi,
    describe: (m) => ({
      message: `"${m}" frames the work as charity. Use sponsorship, purchase, or "support".`,
      suggestion: 'sponsorship',
    }),
  },
  {
    id: 'banned-beneficiary',
    severity: 'error',
    pattern: /\b(beneficiar(y|ies))\b/gi,
    describe: (m) => ({
      message: `"${m}" is paternalistic. Community members are co-designers, customers, or partners.`,
      suggestion: 'community members',
    }),
  },
  {
    id: 'banned-empower',
    severity: 'error',
    pattern: /\b(empower(ed|ing|ment|s)?)\b/gi,
    describe: (m) => ({
      message: `"${m}" implies power was not already there. Use "support", "back", or specific action.`,
    }),
  },
  {
    id: 'banned-unlock',
    severity: 'error',
    pattern: /\b(unlock(s|ed|ing)?)\b/gi,
    describe: (m) => ({
      message: `"${m}" is buzzword. Use "activate", "trigger", "enable", or be specific.`,
      suggestion: 'activates',
    }),
  },
  {
    id: 'banned-leverage',
    severity: 'error',
    pattern: /\b(leverag(e|es|ed|ing))\b/gi,
    describe: (m) => ({
      message: `"${m}" is corporate jargon. Use "use", "draw on", or be specific.`,
      suggestion: 'use',
    }),
  },
  {
    id: 'banned-synergy',
    severity: 'error',
    pattern: /\b(synerg(y|ies|istic))\b/gi,
    describe: (m) => ({
      message: `"${m}" is buzzword. Be specific about the actual interaction.`,
    }),
  },
  {
    id: 'banned-ecosystem',
    severity: 'warning',
    pattern: /\becosystem\b/gi,
    describe: () => ({
      message: '"ecosystem" is overused jargon. Often "network" or specific named partners works better.',
    }),
  },
  {
    id: 'banned-gtm',
    severity: 'error',
    pattern: /\b(GTM|go-to-market)\b/gi,
    describe: (m) => ({
      message: `"${m}" is sales jargon. Goods does not use it.`,
    }),
  },
  {
    id: 'banned-disrupting',
    severity: 'error',
    pattern: /\b(disrupt(ive|ing|or)?)\b/gi,
    describe: (m) => ({
      message: `"${m}" is hype language. Let the work speak. Note: "disrupting" in the sense of "interfering with" is allowed; rewrite if buzzword usage.`,
    }),
  },
  {
    id: 'banned-innovative',
    severity: 'warning',
    pattern: /\binnovati(ve|on|ng)\b/gi,
    describe: (m) => ({
      message: `"${m}" is hype language. Describe the specific thing instead.`,
    }),
  },
  {
    id: 'banned-revolutionary',
    severity: 'error',
    pattern: /\brevolutionar(y|ies)\b/gi,
    describe: () => ({
      message: '"revolutionary" is hype. Let the work speak.',
    }),
  },
  {
    id: 'banned-game-changer',
    severity: 'error',
    pattern: /\bgame.?changer\b/gi,
    describe: () => ({
      message: '"game-changer" is hype. Replace with the specific change being made.',
    }),
  },
  {
    id: 'banned-best-in-class',
    severity: 'warning',
    pattern: /\bbest.?in.?class\b/gi,
    describe: () => ({
      message: '"best-in-class" is hype. Cite a specific comparison instead.',
    }),
  },
  {
    id: 'helping-them',
    severity: 'error',
    pattern: /\b(helping|help) them\b/gi,
    describe: (m) => ({
      message: `"${m}" is paternalistic. We work with, not for. Try "working with" or be specific.`,
      suggestion: 'working with',
    }),
  },
  {
    id: 'capitalisation-on-country',
    severity: 'error',
    pattern: /\bon[- ]country\b/g,
    describe: (m) => ({
      message: `Country is a proper noun. Capitalise: "${m.replace(/on([- ])country/, 'On$1Country')}".`,
      suggestion: m.replace(/on([- ])country/, 'On$1Country'),
    }),
  },
  {
    id: 'capitalisation-first-nations',
    severity: 'error',
    pattern: /\bfirst nations\b/g,
    describe: () => ({
      message: 'First Nations is always capitalised.',
      suggestion: 'First Nations',
    }),
  },
  {
    id: 'indigenous-people-block',
    severity: 'warning',
    pattern: /\b(Indigenous|indigenous) people\b(?! of)/g,
    describe: () => ({
      message:
        '"Indigenous people" treats a diverse population as a singular block. Specify community, language group, or use "First Nations".',
    }),
  },
  {
    id: 'outback-bush',
    severity: 'warning',
    pattern: /\b(the outback|the bush)\b/gi,
    describe: (m) => ({
      message: `"${m}" generic identifier. Use the specific community name where possible.`,
    }),
  },
  {
    id: 'remote-australia',
    severity: 'warning',
    pattern: /\bremote Australia\b/g,
    describe: () => ({
      message:
        '"remote Australia" is generic. Where possible, name the community (Tennant Creek, Palm Island, Maningrida, etc.).',
    }),
  },
];

export interface BrandLintResult {
  clean: boolean;
  errorCount: number;
  warningCount: number;
  violations: BrandViolation[];
  rulesApplied: number;
}

/**
 * Lint draft text against Goods brand voice rules.
 * Returns all violations (errors + warnings), sorted by start offset.
 */
export function lintBrandText(input: string): BrandLintResult {
  const violations: BrandViolation[] = [];

  for (const rule of RULES) {
    rule.pattern.lastIndex = 0; // reset before each input
    let match: RegExpExecArray | null;
    while ((match = rule.pattern.exec(input)) !== null) {
      const { message, suggestion } = rule.describe(match[0]);
      violations.push({
        ruleId: rule.id,
        severity: rule.severity,
        start: match.index,
        end: match.index + match[0].length,
        match: match[0],
        message,
        suggestion,
      });
      // Prevent infinite loop on zero-width matches
      if (match[0].length === 0) rule.pattern.lastIndex++;
    }
  }

  violations.sort((a, b) => a.start - b.start || a.ruleId.localeCompare(b.ruleId));

  const errorCount = violations.filter((v) => v.severity === 'error').length;
  const warningCount = violations.filter((v) => v.severity === 'warning').length;

  return {
    clean: violations.length === 0,
    errorCount,
    warningCount,
    violations,
    rulesApplied: RULES.length,
  };
}

/**
 * Format a lint result as a human-readable plain-text report.
 * Used by the API and (optionally) a CLI.
 */
export function formatLintReport(input: string, result: BrandLintResult): string {
  if (result.clean) return 'Clean. No brand voice violations found.';
  const lines: string[] = [];
  lines.push(
    `${result.errorCount} error${result.errorCount === 1 ? '' : 's'}, ${result.warningCount} warning${result.warningCount === 1 ? '' : 's'}:`
  );
  lines.push('');
  for (const v of result.violations) {
    const lineNum = input.substring(0, v.start).split('\n').length;
    lines.push(`[${v.severity.toUpperCase()}] line ${lineNum}, "${v.match}" — ${v.message}`);
    if (v.suggestion) lines.push(`  → suggestion: ${v.suggestion}`);
  }
  return lines.join('\n');
}
