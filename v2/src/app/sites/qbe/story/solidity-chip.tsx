/** The label every figure carries: verified, workpaper, modelled, target. Fill follows the deck's chips. */
export function SolidityChip({ label, dark = false }: { label: string; dark?: boolean }) {
  const s = label.toLowerCase();
  const fill =
    s === 'verified' || s === 'paid' || s === 'signed'
      ? 'bg-[#DDE2D2] text-goods-ink'
      : s === 'workpaper' || s === 'invited'
        ? 'bg-[#EDE5D8] text-goods-ink'
        : dark
          ? 'border border-white/25 text-white/80'
          : 'border border-goods-grid text-goods-ink';
  return <span className={`inline-block rounded-full px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] ${fill}`}>{label}</span>;
}
