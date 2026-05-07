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
  /**
   * Optional whitelist: if the surrounding window (±40 chars from the match)
   * matches any of these, skip the violation. Used to recognise legitimate
   * compound terms (e.g. "DGR donations", "tax-deductible donation",
   * "donor-funded", "charitable status") that are industry-standard legal
   * or financial terminology.
   */
  allowIfNear?: RegExp[];
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
    allowIfNear: [
      /\bDGR\s+/i, // DGR donations / DGR pathway
      /donor-/i, // donor-funded, donor-advised
      /\btax-deductible\s+/i, // tax-deductible donation
      /charity-framed/i, // explicit rejection of charity framing
      /charitable[,\s]+(DGR|status|structure|purpose|trading|loan|tax|funded|relationships)/i,
      /\b(trading\s+vs\.?\s+charitable|vs\s+charitable)/i,
      /\(charitable\)/i, // (charitable) legal designation
      /\(CLG[,\s]/i, // (CLG, charitable, DGR)
      /\bcharitable\s+(loan|status|structure|trust|entity)/i,
      /\bphilanthropic\s+grants?,?\s*DGR\b/i,
      /\bDGR-/i, // DGR-eligible, DGR-pathway
    ],
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
    allowIfNear: [
      // Industry-standard "unlock conditions" / "match conditions" capital-finance language.
      // The fix list above covers the common cases; any remaining "unlock matched grant /
      // unlock catalytic / unlock conditional" we leave to author judgement, since
      // industry counterparts use it freely.
      /\bunlock\s+(conditions?|trigger)\b/i,
      /\b(certificate|key)\s+unlock/i, // technical, e.g. cryptographic
    ],
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
    // Match "on country" or "on-country" in prose, but NOT inside slugs/identifiers.
    // Negative-lookbehind: not preceded by "/" or "-" (avoids "/goods-on-country" and "stretch-on-country").
    // Negative-lookahead-after-match: not followed by "/" or directly into another slug segment.
    pattern: /(?<![\/\-])\bon[- ]country\b(?![-\/])/g,
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
 * Build a set of (start, end) ranges where lint should be suppressed.
 * Drivers:
 *  - Inline code (single-backtick): legitimate identifiers like `goods-on-country`
 *  - Code fences (triple-backtick blocks): code samples
 *  - Inline ignore comment: `<!-- brand-lint-ignore-line -->` suppresses the same line
 *  - Block ignore: `<!-- brand-lint-disable -->` ... `<!-- brand-lint-enable -->`
 *  - Per-rule line ignore: `<!-- brand-lint-ignore-line: rule-id -->`
 */
function computeIgnoreMask(input: string): Array<{ start: number; end: number; rules?: Set<string> }> {
  const ignores: Array<{ start: number; end: number; rules?: Set<string> }> = [];

  // Inline code spans
  const inlineCode = /`[^`\n]+`/g;
  let m: RegExpExecArray | null;
  while ((m = inlineCode.exec(input)) !== null) {
    ignores.push({ start: m.index, end: m.index + m[0].length });
  }

  // Fenced code blocks
  const fences = /```[\s\S]*?```/g;
  while ((m = fences.exec(input)) !== null) {
    ignores.push({ start: m.index, end: m.index + m[0].length });
  }

  // Block disable / enable
  const blockDisable = /<!--\s*brand-lint-disable\s*-->/g;
  const blockEnable = /<!--\s*brand-lint-enable\s*-->/g;
  let disableMatch: RegExpExecArray | null;
  while ((disableMatch = blockDisable.exec(input)) !== null) {
    blockEnable.lastIndex = disableMatch.index + disableMatch[0].length;
    const enableMatch = blockEnable.exec(input);
    const start = disableMatch.index;
    const end = enableMatch ? enableMatch.index + enableMatch[0].length : input.length;
    ignores.push({ start, end });
  }

  // Per-line ignore (whole line containing the comment)
  const lineIgnore = /<!--\s*brand-lint-ignore-line(?::\s*([\w,-]+))?\s*-->/g;
  while ((m = lineIgnore.exec(input)) !== null) {
    const lineStart = input.lastIndexOf('\n', m.index) + 1;
    const lineEnd = input.indexOf('\n', m.index);
    const rules = m[1] ? new Set(m[1].split(',').map((s) => s.trim())) : undefined;
    ignores.push({ start: lineStart, end: lineEnd === -1 ? input.length : lineEnd, rules });
  }

  return ignores;
}

function isIgnored(
  ranges: Array<{ start: number; end: number; rules?: Set<string> }>,
  pos: number,
  ruleId: string
): boolean {
  for (const r of ranges) {
    if (pos < r.start || pos >= r.end) continue;
    if (!r.rules || r.rules.has(ruleId)) return true;
  }
  return false;
}

/**
 * Lint draft text against Goods brand voice rules.
 * Returns all violations (errors + warnings), sorted by start offset.
 *
 * Suppression rules (so legitimate identifiers and quoted-banned-words don't flag):
 *  - Inline code spans (single backticks)
 *  - Fenced code blocks (triple backticks)
 *  - `<!-- brand-lint-disable -->` ... `<!-- brand-lint-enable -->` blocks
 *  - `<!-- brand-lint-ignore-line -->` (whole line)
 *  - `<!-- brand-lint-ignore-line: ruleA,ruleB -->` (only those rules)
 */
export function lintBrandText(input: string): BrandLintResult {
  const violations: BrandViolation[] = [];
  const ignores = computeIgnoreMask(input);

  for (const rule of RULES) {
    rule.pattern.lastIndex = 0; // reset before each input
    let match: RegExpExecArray | null;
    while ((match = rule.pattern.exec(input)) !== null) {
      if (!isIgnored(ignores, match.index, rule.id)) {
        // Allowlist: skip if surrounding window matches a legitimate compound
        let allowed = false;
        if (rule.allowIfNear && rule.allowIfNear.length > 0) {
          const winStart = Math.max(0, match.index - 40);
          const winEnd = Math.min(input.length, match.index + match[0].length + 40);
          const window = input.slice(winStart, winEnd);
          for (const allowPattern of rule.allowIfNear) {
            if (allowPattern.test(window)) {
              allowed = true;
              break;
            }
          }
        }
        if (!allowed) {
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
        }
      }
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
