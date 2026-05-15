import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'How Goods on Country collects, uses, and protects your information. We keep it simple and we keep it small.',
};

export default function PrivacyPage() {
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
          Privacy
        </h1>
        <p className="text-sm text-[#2E2E2E]/60 mb-10">
          Last updated {today}
        </p>

        <div className="prose prose-stone max-w-none space-y-6 text-base leading-relaxed">
          <Section title="What we collect">
            <p>
              When you buy a bed, sign up for updates, contact us, or scan a Goods QR code,
              we collect what you give us: your name, email, phone number (if you share it),
              shipping address (if you order), and any message you send.
            </p>
            <p>
              When you visit goodsoncountry.com we collect basic, non-identifying analytics:
              which pages you viewed and roughly where you visited from. We use Vercel Analytics
              for this and we do not share or sell that data.
            </p>
          </Section>

          <Section title="How we use it">
            <p>We use your information to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Fulfil orders and send Stretch Beds to the address you give us</li>
              <li>Reply to messages from the contact form</li>
              <li>Send the email newsletter, if you opted in</li>
              <li>Improve the website based on what people actually use</li>
            </ul>
            <p>That&apos;s the list. We don&apos;t profile you, build advertising audiences,
              or resell your data to anyone.</p>
          </Section>

          <Section title="Who we share it with">
            <p>
              We share order details with the services we need to fulfil the order: Stripe
              (payments), our shipping partner, and Supabase (the database that holds your
              order record). We share newsletter sign-ups with Mailchimp / GHL so we can
              send the emails. We do not share with anyone else.
            </p>
          </Section>

          <Section title="How long we keep it">
            <p>
              Order records are kept for as long as we&apos;re legally required to (typically
              seven years for accounting). Newsletter sign-ups are kept until you unsubscribe.
              Contact-form messages are kept until we&apos;ve replied and then deleted within
              twelve months.
            </p>
          </Section>

          <Section title="Cookies">
            <p>
              We use one essential cookie to keep you signed in if you have an account, and
              one analytics cookie via Vercel Analytics. We don&apos;t use marketing or tracking
              cookies from third parties.
            </p>
          </Section>

          <Section title="Your rights">
            <p>
              You can ask us at any time to see, correct, or delete the information we hold
              about you. Email us at <a href="mailto:ben@goodsoncountry.com" className="underline text-[#C45C3E]">ben@goodsoncountry.com</a> and
              we&apos;ll do it within thirty days.
            </p>
          </Section>

          <Section title="Children">
            <p>
              The website isn&apos;t aimed at children under sixteen. If you&apos;re a parent
              or guardian and you think your child has signed up, get in touch and we&apos;ll
              remove the record.
            </p>
          </Section>

          <Section title="Contact">
            <p>
              Questions, corrections, or concerns:{' '}
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
