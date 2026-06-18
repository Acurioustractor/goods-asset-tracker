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
  'cycles, employment hours, consent-led stories, a QR-tracked register), to outcomes across the ' +
  'five canonical domains (rest and health; dignity and safety; Indigenous self-determination and ' +
  'community-led design; jobs, On Country work and the path to ownership; circular and local ' +
  'economy), each anchored to a canon number. A stated claim ceiling notes that the scabies to ' +
  'rheumatic heart disease pathway is the why and never a claimed outcome. These roll up to the ' +
  'three shifts (material, economic, story) and to the impact of healthier, self-determining ' +
  'communities with locally-owned production and a circular economy that keeps value on Country.';

/**
 * The Goods theory of change diagram (results-chain logic model).
 *
 * Source of truth is scripts/generate_theory_of_change.py, which renders
 * /public/theory-of-change.svg; the .png (web) and .pdf (print) are produced from
 * it with rsvg-convert. Regenerate after editing the script. Conforms to the
 * canonical impact model: wiki/outputs/2026-06-18-goods-impact-framework.md.
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
