import { STRETCH_BED, PRODUCTION_FACILITY, ENTERPRISE } from '@/lib/data/products';
import {
  deployments,
  getDeploymentTotals,
  getFundingSummary,
  communityPartners,
  communityVoices,
} from '@/lib/data/compendium';
import { PrintButton } from './print-button';

export const metadata = {
  title: 'Capability Statement | Goods on Country',
};

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const totals = getDeploymentTotals();
const fundingSummary = getFundingSummary();

const healthPartners = communityPartners.filter(
  (p) => p.category === 'health'
);

const dianne = communityVoices.find((v) => v.id === 'dianne');
const alfred = communityVoices.find((v) => v.id === 'alfred');

const keyPartnerNames = [
  'Snow Foundation',
  'VFFF',
  'FRRR',
  'AMP Spark',
  'TFN',
  'Anyinginyi Health',
  'Miwatj Health',
  'Purple House',
  'PICC',
  'Wilya Janta',
  'Oonchiumpa',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function currency(n: number): string {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(n);
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CapabilityStatementPage() {
  return (
    <div className="min-h-screen bg-stone-50 print:bg-white print:min-h-0">
      <PrintButton />

      {/* Print wrapper — constrain to single A4 page */}
      <div className="max-w-4xl mx-auto px-6 py-8 print:px-8 print:py-4 print:text-[11px] print:leading-tight">
        {/* -------------------------------------------------------------- */}
        {/* HEADER */}
        {/* -------------------------------------------------------------- */}
        <header className="flex items-start justify-between border-b-2 border-amber-600 pb-4 mb-5 print:pb-3 print:mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-amber-500 flex items-center justify-center text-stone-900 font-bold text-xl print:w-9 print:h-9 print:text-base">
              G
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-stone-800 tracking-tight print:text-lg">
                Goods on Country
              </h1>
              <p className="text-sm text-stone-500 print:text-[10px]">
                Capability Statement
              </p>
            </div>
          </div>
          <div className="text-right text-xs text-stone-400 print:text-[9px]">
            <p>March 2026</p>
            <p>ABN: [pending]</p>
          </div>
        </header>

        {/* Tagline */}
        <p className="font-serif text-lg text-amber-700 font-medium mb-5 print:text-sm print:mb-3">
          Delivering quality furniture to remote Indigenous communities
        </p>

        {/* -------------------------------------------------------------- */}
        {/* ABOUT */}
        {/* -------------------------------------------------------------- */}
        <section className="mb-5 print:mb-3 print:break-inside-avoid">
          <h2 className="font-serif text-base font-bold text-stone-800 mb-1.5 uppercase tracking-wide border-b border-stone-200 pb-1 print:text-xs">
            About Us
          </h2>
          <p className="text-stone-700 text-sm leading-relaxed print:text-[11px]">
            Goods on Country is a social enterprise building essential household
            goods for remote Indigenous communities across Australia. Our
            flagship product, the Stretch Bed, is a flat-packable, washable bed
            made from recycled HDPE plastic, galvanised steel, and heavy-duty
            canvas. Our containerised mobile production facility enables
            on-country manufacturing, with the long-term goal of full community
            ownership: {ENTERPRISE.philosophy.toLowerCase()}.
          </p>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* STRETCH BED SPECS */}
        {/* -------------------------------------------------------------- */}
        <section className="mb-5 print:mb-3 print:break-inside-avoid">
          <h2 className="font-serif text-base font-bold text-stone-800 mb-2 uppercase tracking-wide border-b border-stone-200 pb-1 print:text-xs">
            The Stretch Bed
          </h2>
          <p className="text-stone-600 text-sm mb-3 print:text-[11px] print:mb-2">
            {STRETCH_BED.shortDescription}
          </p>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 print:grid-cols-6 print:gap-2">
            {[
              { value: STRETCH_BED.specs.weight, label: 'Weight' },
              { value: STRETCH_BED.specs.loadCapacity, label: 'Capacity' },
              { value: 'Flat-packs', label: 'Transport' },
              { value: 'Washable', label: 'Canvas' },
              { value: STRETCH_BED.specs.designLifespan, label: 'Lifespan' },
              { value: STRETCH_BED.specs.plasticDiverted, label: 'Recycled' },
            ].map((spec) => (
              <div
                key={spec.label}
                className="bg-amber-50 rounded-lg px-3 py-2 text-center print:bg-amber-50 print:px-1.5 print:py-1 print:rounded"
              >
                <div className="font-serif text-base font-bold text-amber-700 print:text-[11px]">
                  {spec.value}
                </div>
                <div className="text-[10px] text-stone-500 mt-0.5 uppercase tracking-wider print:text-[8px]">
                  {spec.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* TRACK RECORD — Stats Row */}
        {/* -------------------------------------------------------------- */}
        <section className="mb-5 print:mb-3 print:break-inside-avoid">
          <h2 className="font-serif text-base font-bold text-stone-800 mb-2 uppercase tracking-wide border-b border-stone-200 pb-1 print:text-xs">
            Track Record
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 print:grid-cols-4 print:gap-2">
            {[
              {
                value: `${totals.beds}+`,
                label: 'Beds Deployed',
              },
              {
                value: `${totals.communities}`,
                label: 'Communities',
              },
              {
                value: `${currency(fundingSummary.received)}+`,
                label: 'Funding Secured',
              },
              {
                value: `${healthPartners.length}+`,
                label: 'Health & Community Partners',
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="font-serif text-2xl font-bold text-amber-700 print:text-base">
                  {stat.value}
                </div>
                <div className="text-xs text-stone-500 mt-0.5 print:text-[9px]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* TWO-COLUMN: Partners + Community Voice */}
        {/* -------------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 print:grid-cols-2 print:gap-3 print:mb-3">
          {/* KEY PARTNERS */}
          <section className="print:break-inside-avoid">
            <h2 className="font-serif text-base font-bold text-stone-800 mb-2 uppercase tracking-wide border-b border-stone-200 pb-1 print:text-xs">
              Key Partners
            </h2>
            <div className="flex flex-wrap gap-1.5 print:gap-1">
              {keyPartnerNames.map((name) => (
                <span
                  key={name}
                  className="inline-block bg-stone-100 text-stone-700 text-xs px-2.5 py-1 rounded-full print:text-[9px] print:px-1.5 print:py-0.5"
                >
                  {name}
                </span>
              ))}
            </div>
          </section>

          {/* COMMUNITY VOICE */}
          <section className="print:break-inside-avoid">
            <h2 className="font-serif text-base font-bold text-stone-800 mb-2 uppercase tracking-wide border-b border-stone-200 pb-1 print:text-xs">
              Community Voice
            </h2>
            {dianne && (
              <blockquote className="border-l-3 border-amber-500 pl-3 mb-2 print:pl-2">
                <p className="text-stone-700 text-sm italic leading-relaxed print:text-[11px]">
                  &ldquo;{dianne.quotes[1]}&rdquo;
                </p>
                <cite className="text-xs text-stone-500 not-italic mt-1 block print:text-[9px]">
                  -- {dianne.name},{' '}
                  {dianne.role}
                </cite>
              </blockquote>
            )}
            {alfred && (
              <blockquote className="border-l-3 border-amber-500 pl-3 print:pl-2">
                <p className="text-stone-700 text-sm italic leading-relaxed print:text-[11px]">
                  &ldquo;{alfred.quotes[0]}&rdquo;
                </p>
                <cite className="text-xs text-stone-500 not-italic mt-1 block print:text-[9px]">
                  -- {alfred.name}, {alfred.community}
                </cite>
              </blockquote>
            )}
          </section>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* TWO-COLUMN: Certifications + Production */}
        {/* -------------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5 print:grid-cols-2 print:gap-3 print:mb-3">
          {/* CERTIFICATIONS & COMPLIANCE */}
          <section className="print:break-inside-avoid">
            <h2 className="font-serif text-base font-bold text-stone-800 mb-2 uppercase tracking-wide border-b border-stone-200 pb-1 print:text-xs">
              Certifications & Compliance
            </h2>
            <ul className="space-y-1 text-sm text-stone-700 print:text-[10px] print:space-y-0.5">
              {[
                'Supply Nation certified (in progress)',
                'AusTender registered supplier',
                'Indigenous-led social enterprise',
                'Community ownership transfer model',
                `ABN: [pending]`,
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-amber-600 mt-0.5 flex-shrink-0">
                    *
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          {/* PRODUCTION CAPABILITY */}
          <section className="print:break-inside-avoid">
            <h2 className="font-serif text-base font-bold text-stone-800 mb-2 uppercase tracking-wide border-b border-stone-200 pb-1 print:text-xs">
              Production Capability
            </h2>
            <ul className="space-y-1 text-sm text-stone-700 print:text-[10px] print:space-y-0.5">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5 flex-shrink-0">*</span>
                {PRODUCTION_FACILITY.type}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5 flex-shrink-0">*</span>
                {PRODUCTION_FACILITY.capacity}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5 flex-shrink-0">*</span>
                {PRODUCTION_FACILITY.investment}
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5 flex-shrink-0">*</span>
                {PRODUCTION_FACILITY.future}
              </li>
            </ul>
          </section>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* COMMUNITIES SERVED — compact row */}
        {/* -------------------------------------------------------------- */}
        <section className="mb-5 print:mb-3 print:break-inside-avoid">
          <h2 className="font-serif text-base font-bold text-stone-800 mb-2 uppercase tracking-wide border-b border-stone-200 pb-1 print:text-xs">
            Communities Served
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm print:grid-cols-4 print:text-[10px] print:gap-1">
            {deployments
              .filter((d) => d.status === 'active')
              .map((d) => (
                <div
                  key={d.id}
                  className="flex items-center justify-between bg-stone-50 rounded px-3 py-1.5 print:px-2 print:py-1"
                >
                  <span className="text-stone-700 font-medium">
                    {d.community}
                  </span>
                  <span className="text-amber-700 font-bold ml-2">
                    {d.beds}
                  </span>
                </div>
              ))}
          </div>
        </section>

        {/* -------------------------------------------------------------- */}
        {/* CONTACT FOOTER */}
        {/* -------------------------------------------------------------- */}
        <footer className="border-t-2 border-amber-600 pt-3 print:pt-2 print:break-inside-avoid">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-stone-900 font-bold text-sm print:w-6 print:h-6 print:text-xs">
                G
              </div>
              <div>
                <p className="text-sm font-bold text-stone-800 print:text-[11px]">
                  Nicholas Marchesi OAM
                </p>
                <p className="text-xs text-stone-500 print:text-[9px]">
                  Founder & CEO
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-xs text-stone-600 print:text-[9px] print:gap-3">
              <span>nicholas@act.place</span>
              <span>www.goodsoncountry.com</span>
              <span>A Curious Tractor Pty Ltd</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
