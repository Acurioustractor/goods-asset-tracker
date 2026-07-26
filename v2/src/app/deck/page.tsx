import { redirect } from 'next/navigation';

/**
 * Retired 2026-07-26, ruling R. The canonical deck is /pitch/road, built on the road spine
 * (rulings C and F) with every figure resolved from canon.
 *
 * This deck was built on an earlier spine and stated ownership in ways ruling D and ruling J
 * retired. Rather than keep a third deck in sync by hand, it redirects.
 *
 * TEMPORARY (307), not permanent (308), and that is deliberate. A 308 is cached by browsers
 * indefinitely, so it is the wrong instrument for a decision made today that Ben may revisit
 * after living with /pitch/road. Promote to permanentRedirect once the choice has settled.
 * The original 708-line deck is in git history at src/app/deck/page.tsx, commit 96d1259.
 */
export default function DeckPage() {
  redirect('/pitch/road');
}
