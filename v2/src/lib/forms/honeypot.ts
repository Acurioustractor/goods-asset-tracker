/**
 * Read the honeypot field out of a submitted form.
 *
 * Every public form renders a hidden `_companyWebsite` input. A person never
 * sees it (sr-only, aria-hidden, tabIndex -1) and never fills it. A bot fills
 * every field it finds, so a value here is the tell.
 *
 * The server side is `lib/contact-delivery/anti-abuse`, which answers a
 * honeypot hit with the same success a person would have seen and writes
 * nothing. This file stays free of server imports so client components can use
 * it.
 */
export function honeypotValue(event: { currentTarget: unknown }): string | undefined {
  const form = event.currentTarget as HTMLFormElement | null;
  if (!form || !('elements' in form)) return undefined;
  const field = form.elements.namedItem('_companyWebsite') as HTMLInputElement | null;
  return field?.value?.trim() || undefined;
}
