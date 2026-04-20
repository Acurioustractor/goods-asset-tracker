/**
 * Convert [[slug]] and [[slug|Display]] into markdown links to /insiders/<resolved>.
 * Runs as a pre-processor before markdown → HTML so we don't need a full remark plugin.
 * Unresolved links become plain text wrapped in a span with a "dead link" marker.
 */
import type { WikiArticle } from './types'
import { resolveWikiLink } from './loader'
import { insidersHref } from './href'

const WIKILINK_RE = /\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g

export function preprocessWikilinks(
  body: string,
  fromSlug: string[],
  bySlugPath: Map<string, WikiArticle>
): string {
  return body.replace(WIKILINK_RE, (_match, target, display) => {
    const label = (display || target).trim()
    const resolved = resolveWikiLink(target, fromSlug, bySlugPath)
    if (!resolved) {
      return `<span class="wiki-deadlink" title="Unresolved: ${target}">${label}</span>`
    }
    return `[${label}](${insidersHref(resolved)})`
  })
}
