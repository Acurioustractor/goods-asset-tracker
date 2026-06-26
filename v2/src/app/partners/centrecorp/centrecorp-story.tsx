'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

/**
 * Centrecorp Foundation partnership — immersive Utopia story.
 * Dark editorial piece adapted from wiki/outputs/utopia-feature.html, funder-framed
 * for Centrecorp. Photos: 21 and 22 May 2026 Utopia trip, all consent-cleared for
 * funder use (Ben pass, 2026-06-26). Quotes are verbatim, never recombined.
 * Numbers: canon (v2/src/lib/data/canon.ts) + trip report (21-22 May 2026).
 */

const STORY = '/images/partners/centrecorp/story';

const beds = [
  { v: '26kg', l: 'flat-packs, one person can carry it' },
  { v: '200kg', l: 'load capacity, rated' },
  { v: '~5 min', l: 'to assemble, no tools' },
  { v: '20kg', l: 'of recycled plastic per bed' },
  { v: '10+ yrs', l: 'design life, 5-year warranty' },
  { v: '496', l: 'beds in homes across 9 communities since 2023' },
];

const voices = [
  { q: 'Comfortable as. Smooth, tight, hard, fancy. It\'s not trampoline.', who: 'Mykel', where: 'Young builder, Utopia Homelands' },
  { q: 'That is something Central Australia need.', who: 'Fred Campbell', where: 'Youth Case Worker, Oonchiumpa' },
  { q: 'From the waste, plastic. Perfect. That is really a perfect idea.', who: 'Jacqueline', where: 'Central Australia product feedback' },
];

const goodNewsStory = [
  'A Curious Tractor, in partnership with Oonchiumpa Consultancy and Services, is proud to support our remote communities by building and delivering Goods Beds to community members in Alparra and Ampilatwatja who are less fortunate.',
  'We are honoured to share that respected Elders Frank Holmes and Mr Donald Thompson OAM from Antarrengeny have since been in contact and expressed they are very grateful. They told us that since receiving their new beds, they are no longer experiencing back pains. Their words remind us why this work matters.',
  'We look forward to continuing this strong partnership and remain committed to improving comfort, dignity and wellbeing across our remote communities.',
];

const pathways = [
  { who: 'Supporters', h: 'Put a bed in a home', p: 'Fund a Stretch Bed and follow where it goes. The simplest way to be part of the work, one family at a time.' },
  { who: 'Funders', h: 'Move the making to Country', p: 'Back the on-Country plant and the community-ownership transfer. This is where lasting jobs and scale come from.' },
  { who: 'Partners', h: 'Build it with your community', p: 'Bring the making to your homelands. Community leads, Goods supports, and the work becomes yours to own.' },
];

function Immersive({ id, bg, mark, title, stand, center }: { id?: string; bg: string; mark?: string; title: string; stand?: string; center?: boolean }) {
  return (
    <section className={`cc-immersive${center ? ' cc-center' : ''}`} id={id}>
      <div className="cc-bg" style={{ backgroundImage: `url('${bg}')` }} />
      <div className="cc-scrim" />
      <div className="cc-inner">
        {mark ? <div className="cc-actmark cc-reveal">{mark}</div> : null}
        <h2 className="cc-h1 cc-reveal cc-d1">{title}</h2>
        {stand ? <p className="cc-stand cc-reveal cc-d2">{stand}</p> : null}
      </div>
    </section>
  );
}

export default function CentrecorpStory() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const bar = el.querySelector<HTMLElement>('.cc-progress');
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      if (bar) bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + '%';
    };
    document.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('cc-in'); io.unobserve(e.target); } }),
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
    );
    el.querySelectorAll('.cc-reveal').forEach((n) => io.observe(n));
    const bio = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('cc-in'); }),
      { threshold: 0.1 },
    );
    el.querySelectorAll('.cc-immersive, .cc-bleed').forEach((n) => bio.observe(n));

    return () => { document.removeEventListener('scroll', onScroll); io.disconnect(); bio.disconnect(); };
  }, []);

  return (
    <div className="ccstory" ref={root}>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />
      <div className="cc-grain" />
      <div className="cc-progress" />

      {/* MASTHEAD */}
      <section className="cc-immersive" id="top">
        <div className="cc-bg" style={{ backgroundImage: `url('${STORY}/01-hero.jpg')` }} />
        <div className="cc-scrim" />
        <div className="cc-inner">
          <div className="cc-recog cc-reveal">
            <span>Supported by</span>
            <span className="cc-logo">
              <Image src="/images/partners/centrecorp-foundation.jpg" alt="Centrecorp Foundation" width={400} height={250} priority />
            </span>
          </div>
          <div className="cc-kicker cc-reveal cc-d1">Field notes · Alice Springs to Utopia</div>
          <h1 className="cc-mast cc-reveal cc-d1">The young people built the beds. One of them wanted to keep building.</h1>
          <p className="cc-stand cc-reveal cc-d2">
            Two days on Anmatyerr and Alyawarr Country, supported by Oonchiumpa and the Centrecorp Foundation. A delivery, and the start of something longer.
          </p>
          <div className="cc-dateline cc-reveal cc-d3">Utopia Homelands, Northern Territory · 21 and 22 May 2026 · Goods on Country, with Oonchiumpa</div>
          <div className="cc-hint cc-reveal cc-d3"><span>Scroll &#8595;</span></div>
        </div>
      </section>

      {/* LEAD */}
      <section className="cc-read">
        <div className="cc-tag cc-reveal">The trip</div>
        <h2 className="cc-h2 cc-reveal cc-d1">Not a giveaway. A build.</h2>
        <p className="cc-reveal cc-d1">
          <span className="cc-lead">In Alice Springs,</span> young people were supported by the Centrecorp Foundation to build their own beds, and every young person who built one kept one. Oonchiumpa held the whole trip, the cultural connection and the call on where it went. That order matters. The opposite of charity is asking people what they need, then building it with them.
        </p>
        <p className="cc-reveal cc-d2">
          The Stretch Bed is a plain object. Two galvanised steel poles thread through the sleeves of heavy-duty canvas and through the holes in two recycled-plastic X-legs. Tension the frame and it pulls tight, and the canvas is what holds it up. It weighs 26kg, holds 200kg, and goes together in about five minutes with no tools. What it replaces is harder: a thin mattress on a concrete floor, or a door taken off its hinges and laid flat.
        </p>
        <p className="cc-reveal cc-d2">
          Goods on Country has put 496 beds into homes across 9 communities since 2023. This trip added more, and pointed at where the work goes next.
        </p>
      </section>

      {/* MYKEL */}
      <section className="cc-read">
        <div className="cc-tag cc-reveal">Mykel</div>
        <h2 className="cc-h2 cc-reveal cc-d1">{'"Never would\'ve thought it would\'ve come out like that"'}</h2>
        <div className="cc-figrow">
          <figure className="cc-portrait cc-reveal cc-d1">
            <Image src={`${STORY}/mykel.jpg`} alt="Mykel sitting on the Stretch Bed he built, Utopia Homelands" width={900} height={600} className="cc-img" sizes="(max-width: 760px) 100vw, 420px" />
          </figure>
          <div>
            <p className="cc-reveal cc-d1">
              One of the builders was Mykel. He turned the finished bed over in his hands like he wasn&apos;t sure it was real, then explained it was made from bottle lids, the plastic shredded and pressed into something strong enough to stand on. He built the bed he slept on that night, and kept going. Seven in total.
            </p>
            <blockquote className="cc-pull cc-reveal cc-d2">
              {'"Comfortable as. Smooth, tight, hard, fancy. It\'s not trampoline."'}
              <span className="cc-src">Mykel · Utopia Homelands</span>
            </blockquote>
          </div>
        </div>
        <p className="cc-reveal cc-d2">
          An Elder watched him work and called him grandson, called him brother. Then, after a pause, said the thing that turned a good morning into something larger: {'"That could be a good employment for yourself too, grandson. Later on."'} We asked Mykel whether he would come and make beds every day if the making moved closer to home.
        </p>
        <blockquote className="cc-pull cc-reveal cc-d3">
          {'"Yeah, I\'ll be rocking up every day to make them."'}
          <span className="cc-src">Mykel · Utopia Homelands</span>
        </blockquote>
        <p className="cc-reveal cc-d3">
          Fred Campbell, Youth Case Worker at Oonchiumpa, watched another young man, Xavier, find the same thing. {'"He knew what he was doing. He had the pattern of how everything was all coming together. He loved it. We took him back to the family and he just was so proud showing them that he can build it."'}
        </p>
      </section>

      {/* STATS */}
      <section className="cc-stats">
        <div className="cc-wrap">
          <div className="cc-statlead cc-reveal">One bed, in numbers</div>
          <div className="cc-statgrid">
            {beds.map((s, i) => (
              <div className={`cc-stat cc-reveal cc-d${(i % 3) as 0 | 1 | 2}`} key={s.l}>
                <div className="cc-v">{s.v}</div>
                <div className="cc-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ACT: the road */}
      <Immersive
        id="road"
        bg={`${STORY}/02-arrive.jpg`}
        mark="The road"
        title="From town to the homelands"
        stand="We loaded the beds and drove out to Utopia, onto Anmatyerr and Alyawarr Country. Oonchiumpa led the way, and we followed."
      />

      {/* ACT: the homes */}
      <Immersive
        id="utopia"
        bg={`${STORY}/06-delivery.jpg`}
        mark="Utopia"
        title="The beds go to the homes"
        stand="A community close by wanted beds too, more of them. We did not plan that leg. They did. We drove where we were pointed, and we unloaded. Eighty-seven beds reached community across the two days."
      />

      {/* HEALTH HARDWARE */}
      <section className="cc-read">
        <div className="cc-tag cc-reveal">Off the ground</div>
        <h2 className="cc-h2 cc-reveal cc-d1">Why a bed is health hardware</h2>
        <p className="cc-reveal cc-d1">
          A bed is not a comfort upgrade. Sleeping on the ground is linked to chest infections and to skin sores and scabies, and repeated, untreated strep skin infection is one of the drivers behind rheumatic heart disease in remote communities. Getting families up off the floor, onto a surface that can be washed, is one of the simplest pieces of health hardware there is. People asked, unprompted, whether they could wash it. That is the feature that matters most, and the answer is yes.
        </p>
        <blockquote className="cc-pull cc-reveal cc-d2">
          {'"Something as simple as a good bed makes a huge difference. It improves their health, helps with mobility, and gives them dignity."'}
          <span className="cc-src">Chloe · Support worker, Kalgoorlie</span>
        </blockquote>
      </section>

      {/* BLEED QUOTE */}
      <section className="cc-bleed">
        <div className="cc-bg" style={{ backgroundImage: `url('${STORY}/05-waste.jpg')` }} />
        <div className="cc-scrim" />
        <div className="cc-bleedinner cc-reveal"><p>Waste into rest. A morning into a trade.</p></div>
      </section>

      {/* VOICES */}
      <section className="cc-voices">
        <h2 className="cc-vh cc-reveal">What people told us</h2>
        <p className="cc-vsub cc-reveal cc-d1">Voices from this trip, verbatim, cleared with the speakers and Oonchiumpa.</p>
        <div className="cc-qgrid">
          {voices.map((v, i) => (
            <div className={`cc-qcard cc-reveal cc-d${(i % 3) as 0 | 1 | 2}`} key={v.who}>
              <div className="cc-q">{`"${v.q}"`}</div>
              <div className="cc-a"><b>{v.who}</b><br />{v.where}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ACT: the Elders */}
      <Immersive
        id="elders"
        bg={`${STORY}/07-elders.jpg`}
        mark="Ampilatwatja"
        title="Sitting with the old fellas"
        stand="At Ampilatwatja we sat with two senior men, both honoured with the Order of Australia this year, and left four beds. We let the camera run, and got out of the way."
      />

      {/* BEFORE / AFTER */}
      <section className="cc-read cc-wide">
        <div className="cc-tag cc-reveal">From the door to the bed</div>
        <div className="cc-figrow cc-figrow-rev">
          <figure className="cc-portrait cc-reveal cc-d1">
            <Image src={`${STORY}/08-beforeafter.jpg`} alt="An Elder woman and a young boy sitting on a Stretch Bed off the ground, Utopia Homelands" width={1100} height={730} className="cc-img" sizes="(max-width: 760px) 100vw, 520px" />
          </figure>
          <div>
            <h2 className="cc-h2 cc-reveal cc-d1">A door is a door again.</h2>
            <p className="cc-reveal cc-d1">
              Before, some people slept on a door laid flat on the ground. A door, off its hinges, for a bed. Now the door is a door again, and the bed is a bed. Off the ground. Washable. Built to last ten years.
            </p>
          </div>
        </div>
      </section>

      {/* GOOD NEWS STORY (Centrecorp proof point) */}
      <section className="cc-read">
        <div className="cc-tag cc-reveal">Oonchiumpa Good News Story</div>
        <h2 className="cc-h2 cc-reveal cc-d1">Good news from Oonchiumpa</h2>
        {goodNewsStory.map((p, i) => (
          <p className={`cc-reveal cc-d${(i % 3) as 0 | 1 | 2}`} key={p}>{p}</p>
        ))}
      </section>

      {/* VIDEO (real October footage with sound) */}
      <section className="cc-videos">
        <h2 className="cc-vh cc-reveal">Hear it from them</h2>
        <p className="cc-vsub cc-reveal cc-d1">The Oonchiumpa Good News Story, in community voices.</p>
        <figure className="cc-vidframe cc-reveal cc-d1">
          <video controls playsInline preload="metadata" poster="/video/partners/centrecorp/utopia-good-news-full-poster.jpg">
            <source src="/video/partners/centrecorp/utopia-good-news-full.mp4" type="video/mp4" />
          </video>
        </figure>
      </section>

      {/* THE MODEL */}
      <section className="cc-read" id="model">
        <div className="cc-tag cc-reveal">The model</div>
        <h2 className="cc-h2 cc-reveal cc-d1">The point is to hand it over</h2>
        <p className="cc-reveal cc-d1">
          Goods on Country is an enterprise, not a giveaway. The Stretch Bed, and the washing machine named Pakkimjalki Kari by Elder Dianne Stokes in Warumungu, come out of years of work with community. An on-Country plant can shred and press recycled plastic into bed legs, and that plant can move to a community and be owned there.
        </p>
        <p className="cc-reveal cc-d2">
          That is the part Mykel pointed at without knowing it. Alice Springs and Utopia are live candidates for the next place the making happens, not just the next place the beds arrive. The job is to make the making local, and then to become unnecessary.
        </p>
      </section>

      {/* WHERE THE BEDS HAVE GONE */}
      <section className="cc-stats">
        <div className="cc-wrap">
          <div className="cc-statlead cc-reveal">Where the beds have gone</div>
          <div className="cc-statgrid">
            <div className="cc-stat cc-reveal"><div className="cc-v">496</div><div className="cc-l">beds in homes since 2023</div></div>
            <div className="cc-stat cc-reveal cc-d1"><div className="cc-v">9</div><div className="cc-l">communities served</div></div>
            <div className="cc-stat cc-reveal cc-d1"><div className="cc-v">87</div><div className="cc-l">beds to community, this round</div></div>
            <div className="cc-stat cc-reveal cc-d2"><div className="cc-v">1,740kg</div><div className="cc-l">recycled plastic, this round</div></div>
          </div>
          <p className="cc-where cc-reveal cc-d2">
            Palm Island, Tennant Creek, Alice Springs, Utopia Homelands, Ampilatwatja, Maningrida, Kalgoorlie, Mount Isa and Mparntwe. Utopia and Ampilatwatja are the newest. The Centrecorp Foundation pathway carries more Utopia beds still to be reconciled against the asset register before they are counted as delivered.
          </p>
        </div>
      </section>

      {/* CLOSE */}
      <Immersive
        bg={`${STORY}/11-close.jpg`}
        center
        title="This is the first thing he built. It is not the last we will build together."
      />

      {/* RECOGNITION + ASK */}
      <section className="cc-pathways">
        <div className="cc-thanks cc-reveal">
          <h2 className="cc-vh">Thank you to Centrecorp Foundation</h2>
          <p className="cc-vsub">
            Goods on Country and A Curious Tractor acknowledge Centrecorp Foundation&apos;s support for practical bed infrastructure in Central Australia and the Utopia Homelands.
          </p>
        </div>
        <div className="cc-pgrid">
          {pathways.map((p, i) => (
            <div className={`cc-pcard cc-reveal cc-d${(i % 3) as 0 | 1 | 2}`} key={p.h}>
              <div className="cc-who">{p.who}</div>
              <h3 className="cc-ph">{p.h}</h3>
              <p>{p.p}</p>
            </div>
          ))}
        </div>
        <div className="cc-links cc-reveal cc-d2">
          <Link href="/shop/stretch-bed-single" className="cc-btn cc-btn-solid">The Stretch Bed</Link>
          <a href="/docs/partners/centrecorp/utopia-outcomes-one-pager.pdf" className="cc-btn">Outcomes one-pager</a>
          <a href="https://www.centrecorpfoundation.com.au/" target="_blank" rel="noopener" className="cc-btn">Visit Centrecorp Foundation</a>
          <Link href="/contact" className="cc-btn">Contact Goods</Link>
        </div>
      </section>

      <footer className="cc-foot">
        <p>
          <strong>Goods on Country · Utopia Homelands, 21 and 22 May 2026.</strong> Supported by Oonchiumpa. Beds built with young people, purchase supported by the Centrecorp Foundation. A project of A Curious Tractor, since 2023.
        </p>
        <p className="cc-footnote">
          Photos and voices are from the trip and cleared for use with the speakers and Oonchiumpa, who facilitate consent for young people. Quotes are verbatim and never combined across speakers. Numbers are held against the Goods canon and the May 2026 trip record; the Centrecorp Utopia pathway count is reconciled against the asset register before any figure is called delivered.
        </p>
      </footer>
    </div>
  );
}

const CSS = `
.ccstory{--bone:#f4ede1;--bone-dim:#c9bba4;--muted:#9c8d76;--ochre:#c8702e;--ochre-soft:#e6ad6a;--char:#0e0b07;--panel:#15110c;--line:rgba(244,237,225,.14);--serif:Georgia,'Times New Roman',serif;--sans:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
  position:relative;background:var(--char);color:var(--bone);font-family:var(--sans);line-height:1.65;-webkit-font-smoothing:antialiased;overflow-x:hidden}
.ccstory *{box-sizing:border-box}
.cc-grain{position:fixed;inset:-50%;z-index:60;pointer-events:none;opacity:.04;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>")}
.cc-progress{position:fixed;top:0;left:0;height:2px;width:0;background:linear-gradient(90deg,var(--ochre),var(--ochre-soft));z-index:70}

.cc-immersive{position:relative;min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden;padding:9vh 7vw}
.cc-immersive.cc-center{justify-content:center;text-align:center}
.cc-bg{position:absolute;inset:0;z-index:0;width:100%;height:100%;background-size:cover;background-position:center;filter:brightness(.6) saturate(.97);transform:scale(1.08);transition:transform 8s ease-out}
.cc-immersive.cc-in .cc-bg,.cc-bleed.cc-in .cc-bg{transform:scale(1)}
.cc-scrim{position:absolute;inset:0;z-index:1;background:linear-gradient(0deg,rgba(8,6,4,.9),rgba(8,6,4,.25) 55%,rgba(8,6,4,.55))}
.cc-inner{position:relative;z-index:3;max-width:1100px;margin:0 auto;width:100%}
.cc-actmark{font-size:11px;letter-spacing:.3em;text-transform:uppercase;color:var(--ochre-soft);margin-bottom:1rem}
.cc-recog{display:flex;align-items:center;gap:.9rem;margin-bottom:1.6rem}
.cc-recog span:first-child{font-size:10.5px;letter-spacing:.22em;text-transform:uppercase;color:var(--bone-dim)}
.cc-logo{display:inline-flex;background:#fff;border-radius:8px;padding:6px 10px}
.cc-logo img{height:30px;width:auto}
.cc-kicker{font-size:12px;letter-spacing:.34em;text-transform:uppercase;color:var(--ochre-soft);margin-bottom:1.3rem}
.cc-mast{font-family:var(--serif);font-weight:400;font-size:clamp(2.5rem,6.6vw,5.4rem);line-height:1.03;letter-spacing:-.015em;max-width:18ch;text-shadow:0 2px 40px rgba(0,0,0,.5)}
.cc-h1{font-family:var(--serif);font-weight:400;font-size:clamp(2rem,5.4vw,3.6rem);line-height:1.06;letter-spacing:-.01em;max-width:20ch;text-shadow:0 2px 40px rgba(0,0,0,.5)}
.cc-stand{font-family:var(--serif);font-size:clamp(1.2rem,2.3vw,1.7rem);color:var(--bone);max-width:42ch;margin-top:1.8rem;line-height:1.4}
.cc-dateline{font-size:12.5px;letter-spacing:.12em;text-transform:uppercase;color:var(--bone-dim);margin-top:2rem}
.cc-hint{margin-top:2.6rem;font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:var(--bone-dim);opacity:.85}
.cc-hint span{display:inline-block;animation:cc-nudge 2.2s ease-in-out infinite}
@keyframes cc-nudge{0%,100%{transform:translateY(0)}50%{transform:translateY(5px)}}

.cc-read{max-width:720px;margin:0 auto;padding:8vh 7vw}
.cc-read.cc-wide{max-width:1100px}
.cc-tag{font-size:11.5px;letter-spacing:.26em;text-transform:uppercase;color:var(--ochre-soft);margin-bottom:1.2rem}
.cc-h2{font-family:var(--serif);font-weight:400;font-size:clamp(1.8rem,4vw,2.7rem);line-height:1.12;margin-bottom:1.4rem;letter-spacing:-.01em}
.cc-read p{font-size:1.15rem;line-height:1.75;color:#e7dcc9;margin-bottom:1.25rem;max-width:65ch}
.cc-lead{font-variant:small-caps;letter-spacing:.04em;color:var(--bone)}
.cc-pull{font-family:var(--serif);font-size:clamp(1.5rem,3.2vw,2.2rem);line-height:1.28;color:var(--bone);border-left:2px solid var(--ochre);padding-left:1.4rem;margin:2.4rem 0;font-style:italic}
.cc-pull .cc-src{display:block;font-style:normal;font-size:12px;letter-spacing:.18em;text-transform:uppercase;color:var(--bone-dim);margin-top:1rem}

.cc-figrow{display:grid;grid-template-columns:0.9fr 1.1fr;gap:2rem;align-items:center;margin:1.4rem 0 1.6rem}
.cc-figrow-rev{grid-template-columns:1.1fr 0.9fr}
.cc-portrait{margin:0;border:1px solid var(--line);border-radius:16px;overflow:hidden;background:#000}
.cc-img{display:block;width:100%;height:auto}
@media(max-width:760px){.cc-figrow,.cc-figrow-rev{grid-template-columns:1fr}}

.cc-bleed{position:relative;min-height:80vh;display:flex;align-items:center;justify-content:center;text-align:center;overflow:hidden;padding:10vh 7vw}
.cc-bleedinner{position:relative;z-index:3;max-width:22ch}
.cc-bleed p{font-family:var(--serif);font-size:clamp(2rem,5.6vw,4rem);line-height:1.14;color:var(--bone);text-shadow:0 2px 40px rgba(0,0,0,.7)}

.cc-stats{background:var(--panel);border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:7vh 6vw}
.cc-wrap{max-width:1100px;margin:0 auto}
.cc-statlead{font-size:11.5px;letter-spacing:.26em;text-transform:uppercase;color:var(--ochre-soft);margin-bottom:2.4rem;text-align:center}
.cc-statgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:2.2rem 1.4rem}
.cc-stat{text-align:center}
.cc-v{font-family:var(--serif);font-size:clamp(2rem,4.4vw,3rem);color:var(--ochre-soft);line-height:1}
.cc-l{font-size:12.5px;line-height:1.4;color:var(--bone-dim);margin-top:.7rem}
.cc-where{text-align:center;color:var(--bone-dim);font-size:.98rem;max-width:62ch;margin:2.6rem auto 0;line-height:1.7}

.cc-voices,.cc-videos{max-width:1100px;margin:0 auto;padding:9vh 6vw}
.cc-vh{font-family:var(--serif);font-weight:400;font-size:clamp(1.8rem,4vw,2.6rem);margin-bottom:.6rem;text-align:center}
.cc-vsub{text-align:center;color:var(--bone-dim);font-size:.98rem;max-width:54ch;margin:0 auto 3rem}
.cc-qgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.4rem}
.cc-qcard{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:2rem 1.8rem;display:flex;flex-direction:column}
.cc-q{font-family:var(--serif);font-size:1.4rem;line-height:1.32;color:var(--bone)}
.cc-a{font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:var(--bone-dim);margin-top:1.4rem;line-height:1.7}
.cc-a b{color:var(--ochre-soft);font-weight:600}
.cc-vidframe{margin:0;background:#000;border:1px solid var(--line);border-radius:18px;overflow:hidden}
.cc-vidframe video{display:block;width:100%;max-height:74vh;background:#000}

.cc-pathways{max-width:1100px;margin:0 auto;padding:9vh 6vw}
.cc-thanks{text-align:center;margin-bottom:3rem}
.cc-pgrid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.4rem}
.cc-pcard{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:2rem 1.8rem}
.cc-who{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:var(--ochre-soft);margin-bottom:.8rem}
.cc-ph{font-family:var(--serif);font-weight:400;font-size:1.5rem;margin-bottom:.7rem;color:var(--bone)}
.cc-pcard p{font-size:.98rem;color:var(--bone-dim);line-height:1.6}
.cc-links{display:flex;flex-wrap:wrap;gap:.8rem;justify-content:center;margin-top:3rem}
.cc-btn{display:inline-flex;border-radius:10px;padding:.85rem 1.3rem;font-size:13px;font-weight:600;letter-spacing:.02em;color:var(--bone);border:1px solid var(--line);text-decoration:none;transition:opacity .2s}
.cc-btn:hover{opacity:.82}
.cc-btn-solid{background:var(--ochre);color:#fff;border-color:var(--ochre)}

.cc-foot{max-width:760px;margin:0 auto;padding:6vh 7vw 14vh;font-size:13px;line-height:1.75;color:var(--muted);border-top:1px solid var(--line)}
.cc-foot strong{color:var(--bone)}
.cc-footnote{margin-top:.8rem}

.cc-reveal{opacity:0;transform:translateY(20px);transition:opacity 1s ease,transform 1s ease}
.cc-reveal.cc-in{opacity:1;transform:none}
.cc-reveal.cc-d1{transition-delay:.1s}.cc-reveal.cc-d2{transition-delay:.2s}.cc-reveal.cc-d3{transition-delay:.3s}
@media(prefers-reduced-motion:reduce){.cc-hint span{animation:none}.cc-reveal{opacity:1;transform:none;transition:none}.cc-bg{transform:none;transition:none}}
`;
