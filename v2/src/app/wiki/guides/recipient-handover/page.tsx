import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Recipient handover script | Goods Wiki',
  description:
    'What to say and do when handing a Stretch Bed to its recipient. Cultural protocol, scan flow, photo, claim.',
};

export default function RecipientHandoverPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-br from-amber-50 to-stone-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href="/wiki"
            className="text-amber-700 hover:text-amber-800 text-sm font-medium mb-4 inline-block"
          >
            &larr; Back to Wiki
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Recipient handover script</h1>
          <p className="text-lg text-gray-600">
            What to say + do when handing a bed to the person who&apos;ll sleep on it. Tested
            language, not a corporate script. Adapt to the relationship + community.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 prose prose-lg max-w-none">
        <h2>Before you say anything</h2>
        <ul>
          <li>
            <strong>Listen first.</strong> If a Traditional Owner or community lead is welcoming
            you, let them speak. Don&apos;t cut in to explain the bed.
          </li>
          <li>
            <strong>Read the room.</strong> Sometimes the bed is the third thing happening (a death
            in the family, a new baby, a flood). The bed waits. Your timing matters more than your
            words.
          </li>
          <li>
            <strong>No clipboard.</strong> Don&apos;t hold the install logger between you and the
            recipient. Phone in your pocket until after the conversation.
          </li>
          <li>
            <strong>Sit down.</strong> Eye-level is recipient-level. Standing over a bed feels like
            inspection.
          </li>
        </ul>

        <h2>What to say (rough script)</h2>
        <p>
          Aim for three things in the first 60 seconds: <strong>this is yours</strong>,{' '}
          <strong>this is how it works</strong>, <strong>this is how we stay in touch</strong>.
        </p>

        <h3>1. &ldquo;This is your bed.&rdquo;</h3>
        <blockquote>
          &ldquo;G&apos;day. This is a bed from Goods on Country. We made it at the Alice plant.
          The plastic is recycled. The canvas is heavy-duty Australian — washable, holds 200
          kilos, designed for ten years plus. The poles are galvanised steel, won&apos;t rust.&rdquo;
        </blockquote>
        <p>
          Hand them the bed if it&apos;s not already installed. Let them touch it before you talk
          about what to do with it.
        </p>

        <h3>2. &ldquo;Here&apos;s how it works.&rdquo;</h3>
        <blockquote>
          &ldquo;Five-minute setup, no tools. The two poles slide through the canvas sleeves and
          the holes at the top of the plastic X-legs. Push the pole in from its end, not the
          side, and tension holds it.&rdquo;
        </blockquote>
        <p>
          Demonstrate once. Then let them try. If they want to pull it apart and put it back
          together, let them — that&apos;s the moment they actually own it.
        </p>
        <blockquote>
          &ldquo;To wash the canvas: slide the poles out, pop the canvas off, machine wash cold
          or warm with mild soap, hang it on the line. Comes back like new. Don&apos;t put the
          poles or legs in the machine.&rdquo;
        </blockquote>

        <h3>3. &ldquo;Here&apos;s how we stay in touch.&rdquo;</h3>
        <p>Pull out your phone. Scan the QR sticker on the bed&apos;s leg.</p>
        <blockquote>
          &ldquo;Every bed has a QR sticker. Anyone scans this, it opens a page just for your bed.
          You can give it a name — kids name beds, that&apos;s normal. You can let us know how
          it&apos;s going with one tap. You can ask any question, we&apos;ll get back to you.
          If you want a blanket or pillow, ask through here. If anything breaks, ask through
          here.&rdquo;
        </blockquote>
        <p>Show them <strong>one</strong> tile working. The Pulse 👍 is the fastest demo.</p>
        <blockquote>
          &ldquo;Or you can text us straight: +61 468 052 660. Same person on the other end. Reply
          STOP any time and we stop texting.&rdquo;
        </blockquote>

        <h2>If they want an account</h2>
        <p>
          Account = messages + ability to request things like blankets without retyping who you
          are. <strong>Optional.</strong> Most people are fine without.
        </p>
        <ul>
          <li>Tap &ldquo;Stay in touch&rdquo; on the bed page.</li>
          <li>Phone number, OTP code, done. 30 seconds.</li>
          <li>After that, all their bed&apos;s photos + messages land in /my-items.</li>
        </ul>

        <h2>What you do, not what you say</h2>
        <h3>Install logger (admin only)</h3>
        <ol>
          <li>Scan the QR. Page opens.</li>
          <li>
            You see the install logger card above everything else (admins only see this — it
            doesn&apos;t appear for the recipient).
          </li>
          <li>Pick the community from the dropdown.</li>
          <li>
            Type the <strong>place</strong>: family name, outstation, house number. Whatever
            they call it locally.
          </li>
          <li>Tap &ldquo;📍 Use my GPS&rdquo;. Wait for accuracy &le;30m.</li>
          <li>Set status to <strong>deployed</strong>.</li>
          <li>Save. You&apos;ll see &ldquo;The asset register is updated.&rdquo;</li>
        </ol>

        <h3>Photo (with consent)</h3>
        <ul>
          <li>
            <strong>Ask first.</strong> &ldquo;Mind if I take a photo for our records?&rdquo; Some
            yes, some no. Some yes-but-not-of-people. Respect that.
          </li>
          <li>
            One photo of the bed in place is enough. Upload via{' '}
            <Link href="/admin/media-library" className="text-amber-700 underline">
              the Media Room
            </Link>
            .
          </li>
          <li>
            Tick &ldquo;Show on the public bed page&rdquo; <strong>only</strong> if they&apos;re
            comfortable with that. Default for sensitive photos: unticked.
          </li>
        </ul>

        <h2>Cultural protocol</h2>
        <ul>
          <li>
            <strong>Sorry business.</strong> If someone has passed in this community recently,
            ask if it&apos;s OK to be here today. If not, leave the beds and come back.
            Don&apos;t take photos. Don&apos;t name names.
          </li>
          <li>
            <strong>Photos of children.</strong> Default: don&apos;t. If a parent insists, only the
            parent in frame, not the child.
          </li>
          <li>
            <strong>Naming dead people.</strong> Some communities have strong protocols about
            naming people who have passed. If unsure, ask &ldquo;is it OK to use this name in our
            records?&rdquo; before logging anything publicly.
          </li>
          <li>
            <strong>In-language names.</strong> If a community leader gives the bed a name in
            their own language (the way Dianne Stokes named the washing machine{' '}
            <em>Pakkimjalki Kari</em>), record it carefully. Spell it back. Get the right speaker
            to confirm.
          </li>
        </ul>

        <h2>If something goes wrong</h2>
        <h3>Bed is damaged out of the truck</h3>
        <p>
          Don&apos;t install. Set status to <strong>under_investigation</strong>. Photo the damage.
          Notes field: what&apos;s wrong. Goods will replace or repair from the next batch.
        </p>

        <h3>Recipient doesn&apos;t want it</h3>
        <p>
          That&apos;s fine. Don&apos;t pressure. Pull status back to{' '}
          <strong>allocated</strong>, leave the community pool to redistribute. Note the reason in
          the asset record if they shared it.
        </p>

        <h3>Bed lands in wrong house</h3>
        <p>
          Move it. Update <strong>place</strong> in the install logger to where it actually ended
          up.
        </p>

        <h3>Recipient asks for something we don&apos;t have</h3>
        <p>
          Honest answer: &ldquo;I&apos;ll check when I&apos;m back, but I can&apos;t promise.&rdquo;
          Log it as a demand_bump via the &ldquo;We need more here&rdquo; tile on /bed/&lt;ID&gt;.
          Goods follows up.
        </p>

        <h2>Before you leave the community</h2>
        <ul>
          <li>Every bed scanned + GPS-logged.</li>
          <li>Photos uploaded (with consent).</li>
          <li>Anything unusual captured in notes.</li>
          <li>Demand bumps logged for what the community asked for that we couldn&apos;t deliver.</li>
          <li>Goodbye to the people who hosted you.</li>
        </ul>

        <h2>After the trip</h2>
        <p>
          Goods staff: monitor{' '}
          <Link href="/admin/bed-signals" className="text-amber-700 underline">
            /admin/bed-signals
          </Link>{' '}
          for the next few days. Recipients sometimes wait a day or two before scanning. Pulse
          spikes (3+ 👎 in 7 days per community) trigger a GHL alert automatically — but reading
          the signal feed yourself catches softer issues first.
        </p>

        <hr />
        <p className="text-sm text-gray-500">
          Last updated: 2026-05-16. Tested at: Tennant Creek, Maningrida, Palm Island. Refine as
          you learn from each community — handover scripts aren&apos;t universal.
        </p>
      </div>
    </div>
  );
}
