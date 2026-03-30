'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, useCallback } from 'react';

/* ─── Section data ─── */
const SECTIONS = [
  { id: 'purpose', label: 'Purpose', icon: '🏭' },
  { id: 'product-overview', label: 'The Stretch Bed', icon: '🛏️' },
  { id: 'container-setup', label: 'Container Setup', icon: '📦' },
  { id: 'safety', label: 'Safety', icon: '⚠️' },
  { id: 'workflow', label: 'Production Workflow', icon: '⚙️', children: [
    { id: 'workflow-shredder', label: '1. Shredding' },
    { id: 'workflow-sheet-prep', label: '2. Sheet Prep' },
    { id: 'workflow-heat-press', label: '3. Heat Press' },
    { id: 'workflow-cooling', label: '4. Cooling' },
    { id: 'workflow-cnc', label: '5. CNC Cutting' },
    { id: 'workflow-finishing', label: '6. Edge Finishing' },
    { id: 'workflow-predrilling', label: '7. Pre-Drilling' },
    { id: 'workflow-assembly', label: '8. Assembly' },
  ]},
  { id: 'metrics', label: 'Metrics & Capacity', icon: '📊' },
  { id: 'counting', label: 'Counting & Inventory', icon: '📋' },
  { id: 'quality', label: 'Quality Control', icon: '✅' },
  { id: 'tips', label: 'Operator Tips', icon: '💡' },
  { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
  { id: 'training', label: 'Training', icon: '🎓' },
  { id: 'efficiency', label: 'Efficiency Tests', icon: '🧪' },
  { id: 'mobility', label: 'Mobility & Handover', icon: '🚛' },
  { id: 'principles', label: 'Guiding Principles', icon: '🌿' },
  { id: 'appendix', label: 'Appendix', icon: '📎' },
] as const;

/* ─── Reusable components ─── */
function PhotoGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">{children}</div>;
}

function Photo({ src, alt, caption, wide }: { src: string; alt: string; caption: string; wide?: boolean }) {
  return (
    <figure className={wide ? 'my-6' : ''}>
      <div className="relative overflow-hidden rounded-xl bg-stone-100">
        <Image src={src} alt={alt} width={wide ? 2975 : 800} height={wide ? 1343 : 533}
          className="w-full h-auto object-cover" sizes={wide ? '100vw' : '(max-width: 640px) 100vw, 50vw'} />
      </div>
      <figcaption className="text-sm text-stone-500 mt-2 italic">{caption}</figcaption>
    </figure>
  );
}

function Callout({ type, title, children }: { type: 'warning' | 'info' | 'success'; title?: string; children: React.ReactNode }) {
  const styles = {
    warning: 'border-amber-500 bg-amber-50 text-amber-900',
    info: 'border-blue-500 bg-blue-50 text-blue-900',
    success: 'border-green-600 bg-green-50 text-green-900',
  };
  const icons = { warning: '⚠️', info: 'ℹ️', success: '✅' };
  return (
    <div className={`border-l-4 rounded-r-lg p-4 my-4 ${styles[type]}`}>
      {title && <p className="font-bold mb-1">{icons[type]} {title}</p>}
      <div className="text-[0.95rem] leading-relaxed">{children}</div>
    </div>
  );
}

function Tip({ children }: { children: React.ReactNode }) {
  return (
    <div className="border-l-4 border-purple-400 bg-purple-50 rounded-r-lg p-4 my-4">
      <p className="font-bold text-purple-800 mb-1">💡 Joey&apos;s Tip</p>
      <div className="text-[0.95rem] text-purple-900 leading-relaxed">{children}</div>
    </div>
  );
}

function StepCard({ id, number, title, children }: { id: string; number: number; title: string; children: React.ReactNode }) {
  return (
    <article id={id} className="my-8 scroll-mt-24">
      <div className="flex items-center gap-3 mb-4">
        <span className="flex-shrink-0 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg">{number}</span>
        <h3 className="text-xl font-bold text-stone-800" style={{ fontFamily: 'Georgia, serif' }}>{title}</h3>
      </div>
      <div className="pl-0 sm:pl-13">{children}</div>
    </article>
  );
}

function VideoPlaceholder({ src, alt, caption }: { src: string; alt: string; caption: string }) {
  return (
    <figure className="my-6">
      <div className="relative overflow-hidden rounded-xl bg-stone-100 group cursor-pointer">
        <Image src={src} alt={alt} width={900} height={500} className="w-full h-auto object-cover group-hover:brightness-90 transition-all" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-black/60 flex items-center justify-center group-hover:bg-black/80 transition-all">
            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
          </div>
        </div>
      </div>
      <figcaption className="text-sm text-stone-500 mt-2 italic">{caption}</figcaption>
    </figure>
  );
}

/* ─── Main Page ─── */
export default function FacilityManualPage() {
  const [activeSection, setActiveSection] = useState('purpose');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [visited, setVisited] = useState<Set<string>>(new Set(['purpose']));
  const mainRef = useRef<HTMLDivElement>(null);

  // Scrollspy
  useEffect(() => {
    const allIds = SECTIONS.flatMap(s => 'children' in s && s.children ? [s.id, ...s.children.map(c => c.id)] : [s.id]);
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
          setVisited(prev => new Set([...prev, entry.target.id]));
        }
      }
    }, { rootMargin: '-80px 0px -60% 0px', threshold: 0.1 });

    for (const id of allIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setSidebarOpen(false);
  }, []);

  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center border border-stone-200"
        aria-label="Toggle navigation"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {sidebarOpen
            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
        </svg>
      </button>

      {/* Sidebar overlay on mobile */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/40 z-40" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-stone-200 z-40 overflow-y-auto
        transition-transform duration-300 pt-4 pb-8
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:flex-shrink-0
      `}>
        <div className="px-4 pb-4 border-b border-stone-100">
          <Link href="/wiki" className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1">
            ← Back to Wiki
          </Link>
          <h2 className="text-lg font-bold mt-3 text-stone-800" style={{ fontFamily: 'Georgia, serif' }}>Facility Manual</h2>
          <p className="text-xs text-stone-400 mt-1">v2.0 · March 2026</p>
        </div>
        <nav className="p-3" aria-label="Manual sections">
          <ul className="space-y-0.5">
            {SECTIONS.map((section) => {
              const isActive = activeSection === section.id || ('children' in section && section.children?.some(c => c.id === activeSection));
              const isVisited = visited.has(section.id);
              return (
                <li key={section.id}>
                  <button
                    onClick={() => scrollTo(section.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm flex items-center gap-2 transition-all ${
                      isActive
                        ? 'bg-green-50 text-green-800 font-semibold'
                        : isVisited
                          ? 'text-stone-600 hover:bg-stone-50'
                          : 'text-stone-400 hover:bg-stone-50 hover:text-stone-600'
                    }`}
                  >
                    <span className="text-base flex-shrink-0">{section.icon}</span>
                    <span className="flex-1">{section.label}</span>
                    {isVisited && <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />}
                  </button>
                  {'children' in section && section.children && isActive && (
                    <ul className="ml-8 mt-1 space-y-0.5 border-l-2 border-green-200 pl-3">
                      {section.children.map((child) => (
                        <li key={child.id}>
                          <button
                            onClick={() => scrollTo(child.id)}
                            className={`w-full text-left px-2 py-1.5 rounded text-xs transition-all ${
                              activeSection === child.id
                                ? 'text-green-700 font-semibold bg-green-50'
                                : visited.has(child.id)
                                  ? 'text-stone-500 hover:text-stone-700'
                                  : 'text-stone-400 hover:text-stone-500'
                            }`}
                          >
                            {child.label}
                            {visited.has(child.id) && <span className="ml-1 text-green-500">✓</span>}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main ref={mainRef} className="flex-1 min-w-0 max-w-4xl mx-auto px-4 sm:px-8 py-8 lg:py-12">
        {/* Header */}
        <header id="purpose" className="mb-12 scroll-mt-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-stone-800 leading-tight" style={{ fontFamily: 'Georgia, serif' }}>
            Travelling On-Country Plastic Re-Production Facility
          </h1>
          <p className="text-lg text-stone-500 mt-2">Operations, Safety &amp; Training Manual</p>
          <div className="flex flex-wrap gap-4 mt-4 text-sm text-stone-500">
            <span className="bg-stone-100 px-3 py-1 rounded-full">v2.0</span>
            <span className="bg-stone-100 px-3 py-1 rounded-full">Updated: 30 March 2026</span>
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">Operator: Joey (weeks 5–7)</span>
            <span className="bg-stone-100 px-3 py-1 rounded-full">QLD production site</span>
          </div>

          <Photo src="/images/process/factory-panorama.jpg" alt="Panoramic view of the mobile production facility" caption="The mobile production facility. Shipping containers configured as a complete manufacturing line." wide />

          <div className="prose prose-stone max-w-none mt-6">
            <p className="text-lg leading-relaxed">
              This travelling production facility converts recycled plastic into modular Stretch Beds designed for use in remote and
              Indigenous communities across Australia.
            </p>
            <ul className="space-y-2 mt-4">
              <li>Reduce plastic waste locally. Each bed diverts <strong>20kg of HDPE</strong> from landfill</li>
              <li>Enable community-owned production and income</li>
              <li>Create a repeatable, teachable system that can move between locations</li>
              <li>Zero-waste approach: all offcuts go back through the shredder</li>
            </ul>
            <p>
              The facility is designed to be <strong>mobile</strong>, <strong>repairable</strong>, and <strong>bolt-together</strong>
              (no glue, no welding in the final product).
            </p>
          </div>
        </header>

        {/* 2. Product Overview */}
        <section id="product-overview" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>The Stretch Bed</h2>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8">
            <p className="text-lg text-stone-600 leading-relaxed">
              A flat-packable, washable bed made from recycled HDPE plastic (legs), galvanised steel poles (26.9mm OD × 2.6mm wall),
              and heavy-duty Australian canvas (sleeping surface). Assembles in ~5 minutes, no tools required.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 my-6 text-center">
              <div className="bg-stone-50 rounded-xl p-4"><p className="text-2xl font-bold text-green-700">26kg</p><p className="text-xs text-stone-500 mt-1">Total weight</p></div>
              <div className="bg-stone-50 rounded-xl p-4"><p className="text-2xl font-bold text-green-700">200kg</p><p className="text-xs text-stone-500 mt-1">Load capacity</p></div>
              <div className="bg-stone-50 rounded-xl p-4"><p className="text-2xl font-bold text-green-700">20kg</p><p className="text-xs text-stone-500 mt-1">HDPE diverted</p></div>
              <div className="bg-stone-50 rounded-xl p-4"><p className="text-2xl font-bold text-green-700">10yr</p><p className="text-xs text-stone-500 mt-1">Design lifespan</p></div>
            </div>

            <PhotoGrid>
              <Photo src="/images/pitch/bed-frame-legs.jpg" alt="X-frame leg assembly" caption="X-frame leg assembly. Two crossed legs form each side." />
              <Photo src="/images/pitch/bed-assembled.jpg" alt="Assembled Stretch Bed" caption="Fully assembled Stretch Bed ready for use." />
            </PhotoGrid>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 sm:p-8 mt-6">
            <h3 className="text-lg font-bold text-stone-800 mb-4">Bed Recipe (Fixed Standard)</h3>
            <Callout type="info" title="Parts per bed (this ratio does not change)">
              <ul className="space-y-1 mt-2">
                <li><strong>8</strong> long leg pieces (4 per side, forming 2 X-frames per side)</li>
                <li><strong>8</strong> rectangular tab pieces (4 per side, connecting and bracing the X-frames)</li>
                <li><strong>2</strong> galvanised steel poles</li>
                <li><strong>1</strong> canvas sleeping surface</li>
                <li>Button head screws for folding mechanism</li>
              </ul>
              <p className="mt-3 text-sm"><strong>1 side = 4 long leg pieces + 4 rectangular tab pieces</strong> · <strong>1 bed = 2 sides + 2 poles + 1 canvas</strong></p>
              <p className="text-sm">Each side weighs ~10kg of recycled plastic (20kg total per bed).</p>
            </Callout>

            <PhotoGrid>
              <Photo src="/images/pitch/bed-seq-1-leg-pole.jpg" alt="One side assembly with pole" caption="One side assembly with steel pole." />
              <Photo src="/images/pitch/bed-seq-3-all-parts.jpg" alt="All bed parts" caption="All parts for one complete bed." />
              <Photo src="/images/product/stretch-bed-legs.jpg" alt="Colourful HDPE legs" caption="Colourful HDPE legs. Each batch is unique." />
              <Photo src="/images/pitch/bed-canvas.jpg" alt="Canvas sleeping surface" caption="Heavy-duty Australian canvas with Goods. branding." />
            </PhotoGrid>

            <Callout type="success" title="Key Design Insight">
              <p>
                The canvas is the structural bracing. The frame will <strong>not</strong> stand upright without the canvas installed.
                this is by design. The canvas under tension between the two steel poles locks the leg assemblies in place and creates rigidity.
                Tell new operators this upfront so they don&apos;t worry when the bare frame splays.
              </p>
            </Callout>
          </div>
        </section>

        {/* 3. Container Setup */}
        <section id="container-setup" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>Mobile Container Setup &amp; Machine Flow</h2>

          <PhotoGrid>
            <Photo src="/images/process/containers-angle.jpg" alt="Containers from angle" caption="CNC, heat press, and storage zones visible." />
            <Photo src="/images/process/facility-full-site.jpg" alt="Full site view" caption="Full site including the green shredder container (far left)." />
            <Photo src="/images/process/workstation-container.jpg" alt="Workstation container" caption="Workstation: bull nose router, tools, and dust extractor." />
            <Photo src="/images/process/heat-press-container.jpg" alt="Heat press container" caption="Heat press container with parts storage underneath." />
          </PhotoGrid>

          <p className="text-stone-600 leading-relaxed my-4">
            The container is a mobile, enclosed workshop that houses fixed machinery for processing plastic, forming sheets, and cutting parts.
            Bed assembly happens outside (in a shed area) to keep the interior clear and safe.
          </p>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mt-6">
            <h3 className="text-lg font-bold text-stone-800 mb-4">Machine Zones</h3>
            <div className="space-y-3">
              {[
                ['A', 'Plastic Intake & Shredding', 'waste plastic → shredded feedstock'],
                ['B', 'Sheet Forming (Heat Press)', 'shredded plastic → solid sheets (~90 min/sheet)'],
                ['C', 'Cooling & Stabilisation', 'sheets rest overnight to avoid warp'],
                ['D', 'CNC Cutting', 'sheets → leg pieces + rectangular tab pieces'],
                ['E', 'Edge Finishing', 'bull nose router for smooth, safe edges'],
                ['F', 'Parts Storage & Buffer', 'racks for legs, blocks, and offcuts'],
              ].map(([zone, name, desc]) => (
                <div key={zone as string} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold text-sm">{zone}</span>
                  <div><p className="font-semibold text-stone-700">{name}</p><p className="text-sm text-stone-500">{desc}</p></div>
                </div>
              ))}
            </div>
          </div>

          <Callout type="info" title="Material Flow: No Backtracking">
            <p className="mb-2"><strong>Plastic moves in one direction only:</strong></p>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Waste plastic → shredder</li>
              <li>Shred → steel frames</li>
              <li>Frames → heat press (90 min cycle)</li>
              <li>Press → cooling press (overnight)</li>
              <li>Sheet → CNC router (3 cut profiles)</li>
              <li>Parts → edge finishing (bull nose router)</li>
              <li>Parts → pre-drilling &amp; countersinking</li>
              <li>Parts → assembly (in shed)</li>
              <li>Bed → packing / shipping</li>
            </ol>
            <p className="mt-2 font-bold">All offcuts go back to step 1. Zero waste.</p>
          </Callout>
        </section>

        {/* 4. Safety */}
        <section id="safety" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>⚠️ Safety Requirements (Non-Negotiable)</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h3 className="font-bold text-stone-800 mb-3">Required PPE</h3>
              <ul className="space-y-2 text-stone-600">
                <li>🥽 Safety glasses</li>
                <li>🧤 Heat-resistant gloves (thick, extended grip)</li>
                <li>👢 Closed-toe boots</li>
                <li>👕 Long sleeves and pants</li>
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6">
              <h3 className="font-bold text-stone-800 mb-3">General Rules</h3>
              <ul className="space-y-2 text-stone-600">
                <li>No loose clothing near machinery</li>
                <li>No hands near moving parts</li>
                <li>Machines off before clearing jams</li>
                <li>Hot plastic/metal: assume hot at all times</li>
                <li>Team lifts for heavy sheets</li>
                <li>Report damage immediately</li>
              </ul>
            </div>
          </div>

          <Callout type="warning" title="Hot Sheet Handling">
            <p>
              Moving hot sheets from the heat press to the cooling press.
              Joey&apos;s learned technique: use the &ldquo;pizza paddle&rdquo; tool to slide sheets, don&apos;t grip directly.
              You don&apos;t have to be strong. Flip and slide techniques work well.
            </p>
          </Callout>

          <Photo src="/images/process/dust-extractor.jpg" alt="Carbatec dust extractor" caption="Carbatec dust extractor connected to the CNC router to capture plastic particles." />

          <Callout type="warning" title="Start-of-Day Safety Brief">
            <p>Required at every new site setup and before any youth-led shift begins.</p>
          </Callout>
        </section>

        {/* 5. Production Workflow */}
        <section id="workflow" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-stone-800 mb-2" style={{ fontFamily: 'Georgia, serif' }}>Production Workflow</h2>
          <p className="text-stone-500 mb-8">End-to-end process from waste plastic to finished bed.</p>

          <StepCard id="workflow-shredder" number={1} title="Plastic Shredding">
            <VideoPlaceholder src="/images/process/shredder-granulator.jpg" alt="GSL Granulator shredder" caption="GSL-300/400 Granulator (video walkthrough coming soon)" />
            <p className="text-stone-600 leading-relaxed"><strong>Purpose:</strong> Reduce plastic into pressable chips.</p>
            <ul className="mt-3 space-y-1 text-stone-600">
              <li>Inspect shredder before use</li>
              <li>Feed plastic gradually, don&apos;t force it</li>
              <li>Stop immediately if jam occurs (power off before clearing)</li>
              <li>Basic power tools needed: jigsaw, multi-tool, drill for pre-cutting larger pieces</li>
            </ul>
            <PhotoGrid>
              <Photo src="/images/process/shredder-detail.jpg" alt="Granulator detail" caption="Granulator feed mechanism detail." />
              <Photo src="/images/process/shredder-output-tub.jpg" alt="Shredder output" caption="Waste plastic collected at shredder output." />
              <Photo src="/images/process/shredded-chips-weighed.jpg" alt="Weighed chips" caption="Shredded chips weighed on scales." />
              <Photo src="/images/process/shredded-plastic-tubs.jpg" alt="Sorted feedstock" caption="Sorted feedstock tubs ready for pressing." />
            </PhotoGrid>
            <Photo src="/images/process/cnc-offcuts-jigsaw.jpg" alt="Offcuts with jigsaw" caption="Offcut strips with jigsaw. Pre-cutting before feeding the shredder." />
            <Tip>
              <p>Jams happen. Expect to spend ~40 min unjamming occasionally.
              Just have patience, power off, clear it, and restart. If you have the bandsaw available, pre-cut pieces smaller before feeding.</p>
            </Tip>
          </StepCard>

          <StepCard id="workflow-sheet-prep" number={2} title="Sheet Preparation (Steel Frames)">
            <PhotoGrid>
              <Photo src="/images/process/steel-frame-filled.jpg" alt="Steel frame filled" caption="Steel frame filled with shredded plastic." />
              <Photo src="/images/process/offcuts-weighed.jpg" alt="Offcuts weighed" caption="Weighing offcuts for consistent sheet density." />
            </PhotoGrid>
            <p className="text-stone-600 leading-relaxed"><strong>Purpose:</strong> Fill steel frames with chipped plastic for pressing.</p>
            <ul className="mt-3 space-y-1 text-stone-600">
              <li>Spread shredded plastic evenly in the steel frame (no peaks, no gaps)</li>
              <li>Place aluminium sheet on top</li>
              <li>Lock frame securely</li>
            </ul>
          </StepCard>

          <StepCard id="workflow-heat-press" number={3} title="Heat Pressing">
            <PhotoGrid>
              <Photo src="/images/process/heat-press-full.jpg" alt="Heat press" caption="Heat press with hydraulic jack. 'Like a big toasted sandwich machine'." />
              <Photo src="/images/process/heat-press-detail.jpg" alt="Press detail" caption="Press platens close-up showing melted plastic residue at the edges." />
            </PhotoGrid>
            <p className="text-stone-600 leading-relaxed"><strong>Purpose:</strong> Melt plastic chips into solid sheets.</p>
            <Callout type="info" title="Key Metrics">
              <p><strong>Cycle time:</strong> ~90 minutes per sheet</p>
              <p><strong>Max capacity:</strong> 6 sheets per day</p>
              <p><strong>Diesel consumption:</strong> ~25 litres per day during full production</p>
            </Callout>
            <ul className="mt-3 space-y-1 text-stone-600">
              <li>Insert frame at correct angle</li>
              <li>Apply initial force with safe body position</li>
              <li>Re-jack to maintain pressure as required</li>
              <li>Do not rush the cycle. Work other stations while it runs</li>
            </ul>
          </StepCard>

          <StepCard id="workflow-cooling" number={4} title="Cooling &amp; Stabilisation">
            <PhotoGrid>
              <Photo src="/images/process/pressed-sheets-stacked.jpg" alt="Pressed sheets" caption="Pressed sheets stacked flat. Unique colours every batch." />
              <Photo src="/images/process/sheets-edge-view.jpg" alt="Sheets edge view" caption="Edge view showing colourful recycled plastic layers." />
            </PhotoGrid>
            <p className="text-stone-600 leading-relaxed"><strong>Purpose:</strong> Stabilise sheet structure and prevent warping.</p>
            <ul className="mt-3 space-y-1 text-stone-600">
              <li>Transfer to cooling press (no heat, just pressure to keep flat)</li>
              <li>Sheets should sit <strong>overnight minimum</strong></li>
              <li>No stacking or bending sheets early</li>
            </ul>
            <Callout type="warning" title="Critical">
              <p>If the CNC doesn&apos;t finish cutting a sheet, store it FLAT overnight.
              Uncut sheets that aren&apos;t stored flat will bow, and the individual leg pieces will be out of spec when cut.</p>
            </Callout>
            <Tip>
              <p>Getting sheets out of the steel frames can be stubborn. Melted plastic seeps into the gaps.
              Cut along the frame edge enough times and it should pop out. Don&apos;t get frustrated, just work at it.</p>
            </Tip>
          </StepCard>

          <StepCard id="workflow-cnc" number={5} title="CNC Cutting">
            <VideoPlaceholder src="/images/process/cnc-router-full.jpg" alt="CNC router" caption="CNC router with dust extraction (video walkthrough coming soon)" />
            <p className="text-stone-600 leading-relaxed"><strong>Purpose:</strong> Cut sheets into three component shapes.</p>
            <ul className="mt-3 space-y-1 text-stone-600">
              <li>Confirm correct templates loaded (3 profiles: long leg pieces, rectangular tab pieces, and connector shapes)</li>
              <li>Secure sheet before cutting (clamps / hold-down)</li>
              <li>Stay clear during operation</li>
              <li>The CNC can run unattended once started. Use this time for other stations</li>
            </ul>
            <PhotoGrid>
              <Photo src="/images/process/cnc-software.jpg" alt="CNC software" caption="CNC software with cutting templates loaded." />
              <Photo src="/images/process/cnc-sheet-loaded.jpg" alt="Sheet on CNC bed" caption="Sheet loaded on the CNC vacuum bed." />
              <Photo src="/images/process/cnc-router-head.jpg" alt="Router head" caption="Router head with dust brush." />
              <Photo src="/images/process/cnc-cutting-closeup.jpg" alt="Cutting close-up" caption="Router bit cutting through plastic." />
            </PhotoGrid>
            <PhotoGrid>
              <Photo src="/images/process/cnc-emergency-stop.jpg" alt="Emergency stop" caption="Control switches and emergency stop. Know where these are." />
              <Photo src="/images/process/cnc-tools-drill.jpg" alt="Tools under CNC" caption="Tools stored under the CNC table." />
            </PhotoGrid>
            <Tip>
              <p>The CNC was temperamental early on but is reliable now with the wifi fixed.
              It&apos;s basically just a sequence to remember. For community handoff, it should be simplified to button-pressing
              with clear error codes documented.</p>
            </Tip>
          </StepCard>

          <StepCard id="workflow-finishing" number={6} title="Edge Finishing">
            <Photo src="/images/process/bull-nose-router.jpg" alt="Bull nose router" caption="Carbatec bull nose router table. All edges run through here." />
            <p className="text-stone-600 leading-relaxed"><strong>Purpose:</strong> Safety and clean finish.</p>
            <ul className="mt-3 space-y-1 text-stone-600">
              <li>Run all edges through the bull nose router</li>
              <li>Remove sharp corners</li>
              <li>Inspect holes and joins</li>
            </ul>
            <p className="mt-3 font-bold text-stone-700">Rule: No unfinished parts move to assembly.</p>
          </StepCard>

          <StepCard id="workflow-predrilling" number={7} title="Pre-Drilling &amp; Countersinking">
            <p className="text-stone-600 leading-relaxed"><strong>Purpose:</strong> Prepare holes for assembly screws (CNC can&apos;t do this step).</p>
            <ul className="mt-3 space-y-1 text-stone-600">
              <li>Use the drilling jig to ensure consistent hole placement</li>
              <li>Countersink holes so screw heads sit flush</li>
              <li>Practice improves speed. This is a &ldquo;practice makes perfect&rdquo; station</li>
            </ul>
            <Callout type="warning" title="Jig Maintenance">
              <p>Replace or rotate the pre-drilling jig regularly. The more you drill through the same hole,
              the wider it bores out, causing alignment drift that eventually compromises bed integrity during assembly.</p>
            </Callout>
          </StepCard>

          <StepCard id="workflow-assembly" number={8} title="Bed Assembly">
            <PhotoGrid>
              <Photo src="/images/product/stretch-bed-assembly.jpg" alt="Assembly in action" caption="Threading canvas over the frame." />
              <Photo src="/images/product/stretch-bed-assembled.jpg" alt="Completed bed" caption="Completed bed being inspected." />
            </PhotoGrid>

            <details className="mt-4 bg-white rounded-xl border border-stone-200 overflow-hidden">
              <summary className="cursor-pointer p-4 font-semibold text-stone-700 hover:bg-stone-50">Side Assembly (repeat ×2)</summary>
              <div className="p-4 pt-0">
                <ul className="space-y-1 text-stone-600">
                  <li><strong>1 side = 4 long leg pieces (forming 2 X-frames) + 4 rectangular tab pieces</strong></li>
                  <li>Use impact driver with button head screws</li>
                  <li>Use a jig for alignment (basic jig works, being refined)</li>
                  <li>Check alignment. Clamps help bring slightly off pieces together</li>
                </ul>
              </div>
            </details>

            <details className="mt-2 bg-white rounded-xl border border-stone-200 overflow-hidden">
              <summary className="cursor-pointer p-4 font-semibold text-stone-700 hover:bg-stone-50">Final Bed Assembly</summary>
              <div className="p-4 pt-0">
                <ul className="space-y-1 text-stone-600">
                  <li><strong>1 bed = 2 sides + 2 galvanised steel poles + 1 canvas</strong></li>
                  <li>Thread poles through the canvas sleeves</li>
                  <li>Click legs onto poles</li>
                  <li>Canvas creates the structural tension that keeps the bed rigid</li>
                  <li>Inspect for wobble or slack</li>
                </ul>
              </div>
            </details>

            <Tip>
              <p>Pieces can be slippery when moving in quantity. Some pieces won&apos;t be millimeter-perfect,
              but they still work. A pole goes through, canvas creates tension, bed serves its purpose. Use clamps during assembly
              if holes are slightly off.</p>
            </Tip>
          </StepCard>
        </section>

        {/* 6. Metrics */}
        <section id="metrics" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>Production Metrics &amp; Capacity</h2>
          <p className="text-stone-500 mb-4">Current operational metrics based on weeks 5–7 of production (Joey, March 2026).</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              ['~90 min', 'Press cycle time', 'Per sheet'],
              ['6/day', 'Max sheets', 'Limited by press'],
              ['~25 L/day', 'Diesel', 'Very consistent'],
              ['5–6/day', 'Target beds', 'End-to-end'],
              ['20kg', 'Plastic per bed', '10kg per side'],
              ['26kg', 'Bed weight', 'Inc. poles & canvas'],
            ].map(([value, label, note]) => (
              <div key={label as string} className="bg-white rounded-xl border border-stone-200 p-4 text-center">
                <p className="text-xl font-bold text-green-700">{value}</p>
                <p className="text-sm font-semibold text-stone-700 mt-1">{label}</p>
                <p className="text-xs text-stone-400">{note}</p>
              </div>
            ))}
          </div>

          <Callout type="success" title="Multitasking Opportunity">
            <p>The heat press and CNC can both run unattended.
            Use those 90-minute press cycles and CNC cuts to do assembly, edge finishing, pre-drilling, or shredding at other stations.</p>
          </Callout>
        </section>

        {/* 7. Counting */}
        <section id="counting" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>Counting &amp; Inventory Control</h2>

          <div className="bg-green-700 text-white rounded-2xl p-6 sm:p-8 text-center mb-6">
            <p className="text-sm uppercase tracking-wider mb-2 text-green-200">Put This on the Wall</p>
            <p className="text-lg sm:text-xl font-bold font-mono">Beds possible = MIN(leg pieces ÷ 8, tab pieces ÷ 8, poles ÷ 2, canvas ÷ 1)</p>
          </div>

          <PhotoGrid>
            <Photo src="/images/process/parts-rack-sorted.jpg" alt="Parts rack sorted" caption="Parts rack with finished pieces sorted by colour." />
            <Photo src="/images/process/cut-legs-stored.jpg" alt="Cut legs stored" caption="Cut pieces stored vertically. Accessible and flat." />
          </PhotoGrid>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mt-6">
            <h3 className="font-bold text-stone-800 mb-4">End-of-Shift Log (Required)</h3>
            <p className="text-sm text-stone-500 mb-3">Use the <a href="/production" className="text-green-600 hover:text-green-700 underline">digital shift log</a> or this paper template:</p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead><tr className="bg-stone-50"><th className="border border-stone-200 p-3 text-left">Item</th><th className="border border-stone-200 p-3 text-left w-24">Count</th></tr></thead>
                <tbody>
                  {['Sheets pressed today', 'Sheets cooling', 'Plastic shredded (kg)', 'Leg pieces available', 'Tab pieces available', 'Poles available', 'Canvas available', 'Beds assembled today', 'Beds possible (from stock)', 'Diesel level (L/M/F)'].map(item => (
                    <tr key={item}><td className="border border-stone-200 p-3">{item}</td><td className="border border-stone-200 p-3 text-stone-300">___</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* 8. Quality */}
        <section id="quality" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>Quality Control &amp; Tolerances</h2>

          <Callout type="info" title="Acceptable Tolerances (Working Definition)">
            <ul className="space-y-1 mt-2">
              <li>Slight bows in leg pieces are normal from the press/cooling process</li>
              <li>If a pole can thread through and the canvas creates tension, the bed works</li>
              <li>Not every piece needs to be millimeter-perfect. Clamps during assembly compensate</li>
              <li>Suggested tolerance: max 5mm bow before re-pressing</li>
            </ul>
          </Callout>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mt-6">
            <h3 className="font-bold text-red-700 mb-3">What Makes a Bad Bed</h3>
            <ul className="space-y-2 text-stone-600">
              <li>❌ Structural failure under 200kg load test</li>
              <li>❌ Pieces too warped to assemble (pole won&apos;t thread)</li>
              <li>❌ Sharp edges that weren&apos;t caught in finishing</li>
              <li>❌ Screw holes that don&apos;t align (jig has worn out)</li>
            </ul>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mt-4">
            <h3 className="font-bold text-stone-800 mb-3">Testing</h3>
            <ul className="space-y-1 text-stone-600">
              <li>Every batch should be test-assembled with canvas + 200kg load before shipping</li>
              <li>Skinnier/thinner leg pieces need extra load testing</li>
            </ul>
          </div>

          <Tip>
            <p>&ldquo;I can be a bit of a perfectionist... I&apos;ve had to go, actually, hang on, that&apos;ll be fine.&rdquo;
            Finding that window of tolerance, what&apos;s genuinely bad vs what works fine, is important.
            Beds that aren&apos;t perfect can still serve their purpose.</p>
          </Tip>
        </section>

        {/* 9. Tips */}
        <section id="tips" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>Operator Tips &amp; Learned Techniques</h2>
          <p className="text-stone-500 mb-6">Real-world learnings from Joey after 5–7 weeks of daily operation.</p>

          {[
            { title: 'Hot Sheet Handling', items: ['Use the pizza paddle tool to slide sheets, don\'t grip directly', 'You don\'t have to be strong. Flip and slide techniques work', 'Wear full PPE (heat-resistant gloves are essential)', 'Everything is close to where you\'re working, so no long carries needed'] },
            { title: 'Station Balancing', items: ['Keep no station too backed up. Backlogs create storage problems', 'Use press/CNC idle time to work other stations', 'Have a primary focus for each day, but flex to wherever needs attention', 'Put offcuts back into the production line immediately'] },
            { title: 'Storage', items: ['Unfinished CNC sheets MUST be stored flat overnight (prevents bowing)', 'Keep a rack for unassembled leg pieces. They\'re slippery in quantity', 'Space is limited, avoid backlog at any station'] },
            { title: 'Frame Removal', items: ['Melted plastic seeps into frame gaps during pressing', 'Cut along the frame edge repeatedly. The sheet will eventually pop out', 'Don\'t force it or get frustrated. Patience is the technique'] },
          ].map(({ title, items }) => (
            <details key={title} className="mb-3 bg-white rounded-xl border border-stone-200 overflow-hidden">
              <summary className="cursor-pointer p-4 font-semibold text-stone-700 hover:bg-stone-50">{title}</summary>
              <div className="p-4 pt-0">
                <ul className="space-y-1 text-stone-600">{items.map(item => <li key={item}>{item}</li>)}</ul>
              </div>
            </details>
          ))}
        </section>

        {/* 10. Maintenance */}
        <section id="maintenance" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>Maintenance &amp; Issue Reporting</h2>
          <p className="text-stone-600 mb-4">Each shift must record:</p>
          <ul className="space-y-1 text-stone-600 mb-6">
            <li>Machine faults</li>
            <li>Broken tools</li>
            <li>Damaged sheets</li>
            <li>Parts failures</li>
            <li>Suggested improvements</li>
          </ul>
          <Photo src="/images/process/cnc-bluecarve-controller.jpg" alt="BlueCarve CNC controller" caption="BlueCarve CNC controller. Document any wiring issues or error codes here." />
          <p className="text-stone-600">
            Use the <a href="/production/journal" className="text-green-600 hover:text-green-700 underline">Process Journal</a> to log issues.
            Use the <a href="/production" className="text-green-600 hover:text-green-700 underline">Shift Log</a> for daily metrics.
          </p>
          <p className="font-bold text-stone-700 mt-2">This log travels with the facility.</p>
        </section>

        {/* 11. Training */}
        <section id="training" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>Training &amp; Community Transfer</h2>
          <p className="text-stone-600 mb-6">This facility is designed so that unskilled operators can learn with proper support.</p>

          <Photo src="/images/process/joey-portrait.jpg" alt="Joey at the facility" caption="Joey, current operator (weeks 5–7). Proving the system is teachable." />

          <div className="overflow-x-auto mt-6">
            <table className="w-full text-sm border-collapse bg-white rounded-xl overflow-hidden">
              <thead><tr className="bg-stone-50"><th className="border border-stone-200 p-3 text-left">Station</th><th className="border border-stone-200 p-3 text-left">Skill Level</th><th className="border border-stone-200 p-3 text-left">Key Training Need</th></tr></thead>
              <tbody>
                {[
                  ['Shredding', 'Basic power tools', 'Jigsaw, multi-tool, drill. Spotting jams'],
                  ['Sheet Prep', 'Low', 'Even spreading, frame locking'],
                  ['Heat Press', 'Medium', 'Safety with hot materials, timing'],
                  ['Hot Sheet Handling', 'Medium (most daunting)', 'PPE, pizza paddle technique'],
                  ['CNC', 'Low (when simplified)', 'Button-pressing, error codes'],
                  ['Edge Finishing', 'Low', 'Router safety, consistent technique'],
                  ['Pre-drilling', 'Medium', 'Jig use, straight drilling'],
                  ['Assembly', 'Low–Medium', 'Impact driver, alignment, clamps'],
                ].map(([station, level, need]) => (
                  <tr key={station as string}><td className="border border-stone-200 p-3 font-medium">{station}</td><td className="border border-stone-200 p-3">{level}</td><td className="border border-stone-200 p-3">{need}</td></tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-6 mt-6">
            <h3 className="font-bold text-stone-800 mb-3">Training Progression</h3>
            <div className="flex flex-col sm:flex-row gap-3">
              {['Observe full workflow', 'Assist at one station', 'Run one station independently', 'Lead one full cycle end-to-end'].map((step, i) => (
                <div key={step} className="flex-1 bg-green-50 rounded-xl p-4 text-center">
                  <span className="text-2xl font-bold text-green-700">{i + 1}</span>
                  <p className="text-sm text-green-800 mt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <Callout type="warning" title="No step is skipped">
            <p>Safety and quality checks are mandatory at every stage.</p>
          </Callout>
        </section>

        {/* 12. Efficiency */}
        <section id="efficiency" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>Efficiency Tests &amp; Improvements</h2>
          <p className="text-stone-600 mb-4">
            We track improvement ideas as &ldquo;efficiency tests&rdquo;. Small changes we try, measure, and keep if they work.
            Log new ideas in the <a href="/production/journal" className="text-green-600 hover:text-green-700 underline">Process Journal</a>.
          </p>

          <div className="space-y-3">
            {[
              ['Move heat press & cooling press closer', 'Reduces hot sheet carry distance and risk', 'Planned'],
              ['Rotate pre-drilling jig every 50 uses', 'Prevents hole boring causing alignment issues', 'Planned'],
              ['Move shredding to bandsaw area', 'Frees container for storage, safer cutting', 'Planned'],
              ['Blue tub for plastic dust containment', 'Cleaner workspace, less cleanup time', 'Planned'],
              ['Improved assembly jig (v2)', 'Faster, more consistent bed assembly', 'Testing'],
              ['Define quality tolerance window', 'Removes perfectionism bottleneck', 'Testing'],
            ].map(([test, why, status]) => (
              <div key={test as string} className="bg-white rounded-xl border border-stone-200 p-4 flex items-start gap-4">
                <span className={`flex-shrink-0 px-2 py-1 rounded-full text-xs font-semibold ${status === 'Testing' ? 'bg-amber-100 text-amber-700' : 'bg-stone-100 text-stone-500'}`}>{status}</span>
                <div><p className="font-semibold text-stone-700">{test}</p><p className="text-sm text-stone-500">{why}</p></div>
              </div>
            ))}
          </div>

          <Callout type="success" title="How to propose a new test">
            <ol className="list-decimal pl-5 space-y-1">
              <li>Log it in the Process Journal as a &ldquo;Cost Idea&rdquo;</li>
              <li>Discuss with Ben/Nick on viability</li>
              <li>Try it for a week and track results in shift logs</li>
              <li>If it works, update this manual</li>
            </ol>
          </Callout>
        </section>

        {/* 13. Mobility */}
        <section id="mobility" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>Mobility &amp; Handover Protocol</h2>
          <Photo src="/images/process/containers-wide-angle.jpg" alt="Facility wide angle" caption="The facility from the approach. Designed to pack up and relocate." />
          <ul className="space-y-2 text-stone-600 mt-6">
            <li>Complete final inventory count</li>
            <li>Pack machines in order of setup</li>
            <li>Secure all tools and templates</li>
            <li>Transfer logs to next site (digital logs sync automatically)</li>
            <li>Brief incoming operators using this manual</li>
          </ul>
          <p className="font-bold text-stone-700 mt-4">The system must arrive <strong>ready to run</strong>, not re-invented.</p>
        </section>

        {/* 14. Principles */}
        <section id="principles" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>Guiding Principles</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              ['🏗️', 'Build locally'],
              ['📖', 'Teach openly'],
              ['🔧', 'Repair instead of replace'],
              ['♻️', 'Design for reuse'],
              ['📋', 'Keep it simple & accountable'],
              ['❤️', 'Remember the purpose'],
            ].map(([icon, text]) => (
              <div key={text as string} className="bg-white rounded-xl border border-stone-200 p-4 text-center">
                <span className="text-2xl">{icon}</span>
                <p className="text-sm font-medium text-stone-700 mt-2">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Appendix */}
        <section id="appendix" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-stone-800 mb-6" style={{ fontFamily: 'Georgia, serif' }}>Appendix: Templates &amp; Checklists</h2>

          <details className="mb-4 bg-white rounded-xl border border-stone-200 overflow-hidden">
            <summary className="cursor-pointer p-4 font-semibold text-stone-700 hover:bg-stone-50">A. Daily Start Checklist</summary>
            <div className="p-4 pt-0">
              <ul className="space-y-2">
                {['PPE available and worn', 'Safety brief completed', 'Tools present (knives, spanners, bits, impact driver)', 'Emergency stop tested (CNC + press)', 'Shredder inspected (clear + ready)', 'Press area clear (no obstructions)', 'Cooling area ready (flat surface)', 'Diesel level checked'].map(item => (
                  <li key={item}><label className="flex items-center gap-2 text-stone-600"><input type="checkbox" className="rounded" /> {item}</label></li>
                ))}
              </ul>
            </div>
          </details>

          <details className="mb-4 bg-white rounded-xl border border-stone-200 overflow-hidden">
            <summary className="cursor-pointer p-4 font-semibold text-stone-700 hover:bg-stone-50">B. End-of-Shift Checklist</summary>
            <div className="p-4 pt-0">
              <ul className="space-y-2">
                {['Machines powered down safely', 'Offcuts returned to shred bin', 'Inventory counts recorded (use digital log)', 'Issues logged (faults, repairs, ideas)', 'Workspace cleaned and cleared', 'Unfinished CNC sheets stored flat', 'No station too backed up for tomorrow'].map(item => (
                  <li key={item}><label className="flex items-center gap-2 text-stone-600"><input type="checkbox" className="rounded" /> {item}</label></li>
                ))}
              </ul>
            </div>
          </details>

          <details className="mb-4 bg-white rounded-xl border border-stone-200 overflow-hidden" open>
            <summary className="cursor-pointer p-4 font-semibold text-stone-700 hover:bg-stone-50">C. Photo Gallery: Production Process</summary>
            <div className="p-4 pt-0">
              <PhotoGrid>
                <Photo src="/images/process/shredder-granulator.jpg" alt="Shredder" caption="Step 1: Shredding waste plastic." />
                <Photo src="/images/process/shredded-chips-weighed.jpg" alt="Weighed chips" caption="Shredded feedstock weighed and ready." />
                <Photo src="/images/process/steel-frame-filled.jpg" alt="Frame filled" caption="Step 2: Steel frame filled with plastic." />
                <Photo src="/images/process/heat-press-full.jpg" alt="Heat press" caption="Step 3: Heat press, 90 min per sheet." />
                <Photo src="/images/process/pressed-sheets-stacked.jpg" alt="Pressed sheets" caption="Step 4: Cooling. Unique colours every batch." />
                <Photo src="/images/process/cnc-router-full.jpg" alt="CNC router" caption="Step 5: CNC router cuts three profiles." />
                <Photo src="/images/process/bull-nose-router.jpg" alt="Router table" caption="Step 6: Bull nose router for safe edges." />
                <Photo src="/images/process/parts-rack-sorted.jpg" alt="Parts rack" caption="Finished parts sorted for assembly." />
                <Photo src="/images/process/05-weave.jpg" alt="Community assembly" caption="Step 8: Community members assembling." />
                <Photo src="/images/process/06-deliver.jpg" alt="Delivery" caption="Loading beds for community delivery." />
              </PhotoGrid>
            </div>
          </details>
        </section>

        {/* Footer */}
        <footer className="border-t border-stone-200 pt-6 pb-12 text-stone-500 text-sm">
          <p>
            <strong>Document control:</strong> Version 2.0. Updated with Joey&apos;s operational learnings from weeks 5–7 of production (March 2026).
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <a href="/production" className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">Shift Log</a>
            <a href="/production/inventory" className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">Inventory</a>
            <a href="/production/journal" className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">Process Journal</a>
            <a href="/production/progress" className="bg-green-50 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors">My Progress</a>
          </div>
          <div className="mt-6">
            <Link href="/wiki" className="text-green-600 hover:text-green-700">← Back to Wiki Homepage</Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
