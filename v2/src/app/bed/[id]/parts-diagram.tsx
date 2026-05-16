import { StretchBedSvg } from './stretch-bed-svg';

type Props = {
  isMachine: boolean;
};

type Part = {
  label: string;
  desc: string;
};

const BED_PARTS: Part[] = [
  { label: 'Canvas', desc: 'Heavy-duty Australian canvas with sewn pole sleeves. Washable.' },
  { label: 'Pole × 2', desc: 'Galvanised steel, 26.9mm OD × 2.6mm wall. Slides through the canvas sleeves.' },
  { label: 'Leg × 4', desc: 'Recycled HDPE plastic. Each leg clicks onto a pole end. Push from the end, not the side.' },
  { label: 'End cap × 4', desc: 'Sits inside each leg. Stops dirt and moisture entering the pole.' },
];

const MACHINE_PARTS: Part[] = [
  { label: 'Wash drum', desc: 'Commercial-grade Speed Queen drum. Built for remote duty.' },
  { label: 'Housing', desc: 'Recycled HDPE plastic skin. The grey panels you can see.' },
  { label: 'Inlet hose', desc: 'Connects to the tap. Keep it kink-free.' },
  { label: 'Outlet hose', desc: 'Drains the wash water. Make sure it points down and clear of the load.' },
];

export function PartsDiagram({ isMachine }: Props) {
  const parts = isMachine ? MACHINE_PARTS : BED_PARTS;

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b">
        <p className="font-display text-lg font-bold">Know the parts</p>
        <p className="text-xs text-muted-foreground">
          If something needs replacing, this is what to ask for.
        </p>
      </div>
      {!isMachine && (
        <div className="border-b bg-muted/20 px-3 py-3">
          <StretchBedSvg />
        </div>
      )}
      <ul className="divide-y">
        {parts.map((part, idx) => (
          <li key={part.label} className="flex items-start gap-4 p-4">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-amber-100 text-amber-900 text-xs font-bold flex items-center justify-center">
              {idx + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-semibold">{part.label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{part.desc}</p>
            </div>
          </li>
        ))}
      </ul>
      {isMachine && (
        <p className="text-[11px] text-muted-foreground px-5 py-2 border-t bg-muted/30 italic">
          Annotated diagram for the washing machine is on its way.
        </p>
      )}
    </div>
  );
}
