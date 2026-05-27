import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms',
  description:
    'The terms that apply when you buy from Goods on Country, sign up for updates, or use the website.',
};

export default function TermsPage() {
  const today = new Date().toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <main className="bg-[#FDF8F3] text-[#2E2E2E]">
      <div className="max-w-2xl mx-auto px-6 py-16 sm:py-24">
        <p className="text-xs uppercase tracking-[0.25em] text-[#C45C3E] mb-4">
          Goods on Country
        </p>
        <h1 className="font-display text-4xl sm:text-5xl tracking-tight mb-3">
          Terms
        </h1>
        <p className="text-sm text-[#2E2E2E]/60 mb-10">
          Last updated {today}
        </p>

        <div className="prose prose-stone max-w-none space-y-6 text-base leading-relaxed">
          <Section title="Who we are">
            <p>
              Goods on Country is a social enterprise operated by A Curious Tractor.
              When this page says &ldquo;we&rdquo; or &ldquo;us&rdquo; it means us. When
              it says &ldquo;you&rdquo; it means you, the visitor or customer.
            </p>
          </Section>

          <Section title="Buying a Stretch Bed">
            <p>
              When you place an order on the website you&apos;re entering a contract with us
              to deliver one Stretch Bed (or however many you ordered) to the address you give
              us. Payment is taken at checkout through Stripe. The order is confirmed once
              payment clears.
            </p>
            <p>
              Beds usually ship within ten business days. We&apos;ll let you know if a delay
              is likely. Shipping costs and delivery timeframes are shown at checkout.
            </p>
          </Section>

          <Section title="Refunds and faults">
            <p>
              If a Stretch Bed has a manufacturing defect, write to us and we&apos;ll work with
              you to put it right.
            </p>
            <p>
              We accept returns for change of mind within fourteen days, provided the bed is
              unused and in the original packaging. You cover return shipping.
            </p>
            <p>
              Nothing here limits your rights under the Australian Consumer Law.
            </p>
          </Section>

          <Section title="The website">
            <p>
              The website is provided as-is. We try to keep everything accurate but we
              can&apos;t guarantee zero errors or downtime. We may change the site, prices,
              or product details without notice.
            </p>
            <p>
              Everything on the site (text, photographs, design) is owned by us or by the
              communities we work with. Don&apos;t copy or reproduce it without permission.
              If you&apos;re a journalist or researcher and you&apos;d like to use something,
              email us and we&apos;ll usually say yes.
            </p>
          </Section>

          <Section title="Stories and photographs">
            <p>
              Some of the photographs and stories on the site come from community members
              we work with. They&apos;ve given us permission to share their stories under our
              consent process. If you see something you think shouldn&apos;t be there, tell
              us and we&apos;ll review it.
            </p>
          </Section>

          <Section title="QR code claims and asset records">
            <p>
              Every Goods bed has a QR code. Scanning that code shows the bed&apos;s public
              record (where it lives, who made it, what it&apos;s for). Some records may be
              updated by community members or by Goods staff over time. We don&apos;t guarantee
              accuracy of every field at every moment.
            </p>
          </Section>

          <Section title="Liability">
            <p>
              We&apos;re a small team doing our best. To the extent permitted by law, we
              limit our liability to the amount you paid for the product. We&apos;re not
              liable for indirect or consequential loss.
            </p>
          </Section>

          <Section title="Governing law">
            <p>
              These terms are governed by the laws of Queensland, Australia.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions about these terms:{' '}
              <a href="mailto:ben@goodsoncountry.com" className="underline text-[#C45C3E]">
                ben@goodsoncountry.com
              </a>.
            </p>
          </Section>
        </div>
      </div>
    </main>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="font-display text-xl sm:text-2xl mt-8 mb-3 text-[#2E2E2E]">
        {title}
      </h2>
      <div className="space-y-3 text-[#2E2E2E]/85">{children}</div>
    </section>
  );
}
