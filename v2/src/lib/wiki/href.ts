/** Single helper: slugPath → /insiders URL with README → folder root normalisation. */
export function insidersHref(slugPath: string): string {
  if (slugPath === 'INDEX') return '/insiders'
  if (slugPath.endsWith('/README')) {
    return `/insiders/${slugPath.replace(/\/README$/, '')}`
  }
  if (slugPath === 'README') return '/insiders'
  return `/insiders/${slugPath}`
}
