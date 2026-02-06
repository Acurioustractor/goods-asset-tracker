import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const metadata = {
  title: 'Partner With Us | Goods on Country',
  description: 'Sponsor beds, license the model, or partner on distribution. Join the movement for community-owned manufacturing.',
};

const partnerOptions = [
  {
    title: 'Sponsor Beds',
    description: 'Fund beds for remote communities. Bulk orders at wholesale pricing with full impact reporting.',
    pricing: 'From $600 per bed (wholesale)',
    features: [
      'Bulk delivery to nominated communities',
      'Impact report with photos and stories',
      'Tax-deductible through DGR partner',
      'Co-branded delivery acknowledgement',
    ],
    cta: 'Sponsor Beds',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
      </svg>
    ),
  },
  {
    title: 'License the Model',
    description: 'Manufacture locally in your community. Full training, supply chain, and quality assurance included.',
    pricing: 'Custom — based on community needs',
    features: [
      'Full manufacturing training program',
      'Supply chain and material connections',
      'Quality assurance framework',
      'Ongoing technical support',
    ],
    cta: 'Enquire About Licensing',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
      </svg>
    ),
  },
  {
    title: 'Distribution Partner',
    description: 'Help us reach more communities. Partner on freight, logistics, and last-mile delivery.',
    pricing: 'Revenue share model',
    features: [
      'Regional distribution rights',
      'Freight and logistics coordination',
      'Community relationship management',
      'Joint marketing and reporting',
    ],
    cta: 'Discuss Distribution',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    title: 'Grant or Investment',
    description: 'Support through grants, impact investment, or philanthropic funding. Full transparency and reporting.',
    pricing: 'Flexible — aligned to your program',
    features: [
      'Detailed impact measurement (ALMA framework)',
      'Quarterly reporting and community updates',
      'Site visits and community introductions',
      'Co-design of impact outcomes',
    ],
    cta: 'Discuss Funding',
    icon: (
      <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
      </svg>
    ),
  },
];

const impactMetrics = [
  { value: '369+', label: 'Beds delivered' },
  { value: '8+', label: 'Communities' },
  { value: '40%', label: 'Returns to community' },
  { value: '14kg', label: 'Plastic diverted per bed' },
];

const fundingPartners = [
  'Snow Foundation',
  'Vincent Fairfax Family Foundation',
  'FRRR (Backing the Future)',
  'AMP Spark',
  'The Funding Network',
];

export default function PartnerPage() {
  return (
    <main>
      {/* Header */}
      <section className="bg-gradient-to-b from-muted/50 to-background py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-accent mb-4">
              For Organisations
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Partner With Us
            </h1>
            <p className="text-lg text-muted-foreground">
              Whether you want to sponsor beds, license the manufacturing model, or support
              through grants — there&apos;s a way to be part of this movement.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Metrics */}
      <section className="bg-accent py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 sm:grid-cols-4 max-w-3xl mx-auto text-center">
            {impactMetrics.map((metric) => (
              <div key={metric.label}>
                <div className="text-3xl font-bold text-accent-foreground">{metric.value}</div>
                <div className="text-sm text-accent-foreground/80 mt-1">{metric.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Options */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
            {partnerOptions.map((option) => (
              <Card key={option.title} className="flex flex-col">
                <CardContent className="p-8 flex flex-col flex-1">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary mb-4">
                    {option.icon}
                  </div>
                  <h2 className="text-xl font-bold text-foreground mb-2">{option.title}</h2>
                  <p className="text-muted-foreground mb-4">{option.description}</p>
                  <p className="text-sm font-medium text-primary mb-4">{option.pricing}</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {option.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <svg className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button asChild className="w-full">
                    <Link href={`mailto:hi@act.place?subject=${encodeURIComponent(option.cta)}`}>
                      {option.cta}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Existing Partners */}
      <section className="bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-foreground mb-8">Our Partners</h2>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              {fundingPartners.map((partner) => (
                <span
                  key={partner}
                  className="inline-flex items-center rounded-full bg-background border border-border px-4 py-2 text-sm font-medium text-foreground"
                >
                  {partner}
                </span>
              ))}
            </div>
            <p className="text-muted-foreground">
              We work alongside health organisations including Anyinginyi Health, Miwatj Health,
              Purple House, and Red Dust across remote Australia.
            </p>
          </div>
        </div>
      </section>

      {/* Expression of Interest Form */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">Express Interest</h2>
              <p className="text-muted-foreground">
                Tell us how you&apos;d like to be involved and we&apos;ll be in touch.
              </p>
            </div>
            <form action="/api/partnership" method="POST" className="space-y-4">
              <div>
                <label htmlFor="organization" className="block text-sm font-medium text-foreground mb-1">
                  Organisation Name
                </label>
                <input
                  type="text"
                  id="organization"
                  name="organization_name"
                  required
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Your organisation"
                />
              </div>
              <div>
                <label htmlFor="contact_name" className="block text-sm font-medium text-foreground mb-1">
                  Contact Name
                </label>
                <input
                  type="text"
                  id="contact_name"
                  name="contact_name"
                  required
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="contact_email"
                  required
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="you@organisation.com"
                />
              </div>
              <div>
                <label htmlFor="partnership_type" className="block text-sm font-medium text-foreground mb-1">
                  Partnership Type
                </label>
                <select
                  id="partnership_type"
                  name="partnership_type"
                  required
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select an option</option>
                  <option value="sponsor">Sponsor Beds</option>
                  <option value="license">License the Model</option>
                  <option value="distribution">Distribution Partner</option>
                  <option value="grant">Grant or Investment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Tell us about your interest..."
                />
              </div>
              <Button type="submit" size="lg" className="w-full">
                Submit Expression of Interest
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
