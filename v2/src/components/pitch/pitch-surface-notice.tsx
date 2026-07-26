/**
 * Signposting for the pitch surfaces.
 *
 * The problem this solves (2026-07-25): there are eleven /pitch/* routes plus /deck, and none of
 * them said which one to send to a funder. Every route reads from canon.ts so none of them are
 * WRONG, which is exactly why the sprawl was hard to notice. The fix is a pointer, not a warning.
 *
 * THE canonical funder surface is /pitch/funder-pathways.
 * THE canonical deck is /pitch/road (ruling R, 2026-07-26), built on the road spine from canon.
 * /pitch/simple remains the PDF export pipeline and the funder attachment, which is a different job.
 */

const CANONICAL_HREF = '/pitch/funder-pathways';

export function CanonicalPitchNotice() {
  return (
    <div className="border-b border-[#c9b89a] bg-[#f0e5cf] px-5 py-2.5 text-center">
      <p className="text-xs tracking-[0.12em] text-[#6b5836] uppercase">
        Canonical funder surface · deck at{' '}
        <a href="/pitch/road" className="underline decoration-[#b9852f] underline-offset-2">
          /pitch/road
        </a>
      </p>
    </div>
  );
}

export function OtherPitchSurfaceNotice({ note }: { note?: string }) {
  return (
    <div className="border-b border-[#d8cdbd] bg-[#efe8dc] px-5 py-2.5 text-center">
      <p className="text-xs leading-5 text-[#6b5f4c]">
        {note ? `${note} ` : 'This is a supporting pitch surface. '}
        The one to send a funder is{' '}
        <a
          href={CANONICAL_HREF}
          className="font-semibold underline decoration-[#b65738] underline-offset-2"
        >
          /pitch/funder-pathways
        </a>
        .
      </p>
    </div>
  );
}
