'use client';

// The outcomes snapshot is a Server Component (it does the Supabase rollup
// fetch). The print action needs window.print(), so it lives in this tiny
// client island rather than forcing the whole page client-side.
export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="rounded-md border border-[#282828]/30 px-3 py-1.5 font-semibold hover:bg-[#282828] hover:text-[#fbf7f1] transition print:hidden"
      suppressHydrationWarning
    >
      Print or save as PDF
    </button>
  );
}
