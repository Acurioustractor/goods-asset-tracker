import Image from 'next/image';

interface TheoryOfChangeProps {
  /** Extra classes for the outer figure element. */
  className?: string;
  /** Render the model statement as a visible caption beneath the diagram. Default false. */
  caption?: boolean;
}

const ALT =
  'Goods on Country theory of change, shown as a results chain. From a problem (remote homes ' +
  'face costly, short-lived goods; floor sleeping and dirty bedding feed the scabies to rheumatic ' +
  'heart disease pathway), through inputs and the community-led operating cycle (listen, design, ' +
  'make, deliver and track, learn, improve), to outputs (beds delivered, plastic diverted, wash ' +
  'cycles, employment hours, consent-led stories, a QR-tracked register), to outcomes grouped by ' +
  "QBE's two priorities: Inclusion (health, economic inclusion, community ownership) and Climate " +
  'Resilience (environmental), each over short, medium and long horizons, leading to the impact of ' +
  'healthier, self-determining communities with locally-owned manufacturing and a circular economy.';

/**
 * The Goods theory of change diagram (results-chain logic model).
 *
 * Source of truth is scripts/generate_theory_of_change.py, which renders
 * /public/theory-of-change.svg; the .png (web) and .pdf (print) are produced from
 * it with rsvg-convert. Regenerate after editing the script. Companion document:
 * wiki/outputs/2026-05-29-goods-theory-of-change-and-mel.md.
 */
export function TheoryOfChange({ className = '', caption = false }: TheoryOfChangeProps) {
  return (
    <figure className={className}>
      <div className="relative aspect-[14/9] w-full">
        <Image
          src="/theory-of-change.png"
          alt={ALT}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
          className="object-contain"
        />
      </div>
      {caption && (
        <figcaption className="mt-4 text-center text-sm text-muted-foreground">
          The model: community leads the design. Goods supports the building. Production
          transfers to community ownership.
        </figcaption>
      )}
    </figure>
  );
}
