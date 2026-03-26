import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'FAQ | Goods Wiki',
  description: 'Frequently asked questions about Goods on Country products, ordering, shipping, and community support.',
};

const faqs = [
  {
    category: 'Products',
    questions: [
      {
        q: 'What is a Stretch Bed?',
        a: 'The Stretch Bed is a flat-packable, washable bed made from recycled HDPE plastic panels (legs), galvanised steel poles, and heavy-duty Australian canvas. It weighs 26kg, holds 200kg, and assembles in about 5 minutes with no tools.',
      },
      {
        q: 'How long does a Stretch Bed last?',
        a: 'The Stretch Bed is designed for 10+ years of use and comes with a 5-year warranty. The recycled plastic legs are virtually indestructible, the galvanised steel poles resist rust, and the canvas sleeping surface can be removed and washed.',
      },
      {
        q: 'Can I wash the bed?',
        a: 'Yes! The canvas sleeping surface detaches from the frame and can be machine washed or hosed down. This is a key feature for remote communities where hygiene and dust are concerns.',
      },
      {
        q: 'What about the washing machines?',
        a: 'Pakkimjalki Kari (named in Warumungu language by Elder Dianne Stokes) are commercial-grade Speed Queen machines adapted for remote conditions. They\'re currently in prototype stage deployed across several communities. You can register your interest on our shop page.',
      },
      {
        q: 'What happened to the Basket Bed?',
        a: 'The Basket Bed was our first prototype. We\'re discontinuing sales and open-sourcing the design plans so anyone can build them. The Stretch Bed is our flagship product going forward.',
      },
    ],
  },
  {
    category: 'Ordering & Shipping',
    questions: [
      {
        q: 'How do I buy a Stretch Bed?',
        a: 'Visit our shop page at goodsoncountry.com/shop/stretch-bed-single and purchase directly with a credit card. We handle packaging and shipping from our facility.',
      },
      {
        q: 'How much does shipping cost?',
        a: 'Shipping costs vary by location. Remote community deliveries often involve significant freight costs which we factor into our pricing. Contact us for bulk order shipping quotes.',
      },
      {
        q: 'Can I sponsor beds for a community?',
        a: 'Absolutely! Our sponsorship program lets you buy beds that are delivered to communities in need. You\'ll receive impact photos and a story about where your sponsored bed went.',
      },
      {
        q: 'Do you offer bulk/wholesale pricing?',
        a: 'Yes. Housing organisations, health services, and community groups ordering 10+ beds receive wholesale pricing. Contact us at hello@goodsoncountry.com for a quote.',
      },
    ],
  },
  {
    category: 'Community Support',
    questions: [
      {
        q: 'I have a QR code on my bed — what does it do?',
        a: 'Every Goods product has a unique QR code. Scanning it lets you claim ownership, report issues, request repairs or replacements, and connect directly with our support team via SMS.',
      },
      {
        q: 'My bed needs a repair — what do I do?',
        a: 'Scan the QR code on your bed and select "Report an Issue". Describe the problem and we\'ll arrange a repair or replacement. You can also text us directly.',
      },
      {
        q: 'How do I get beds for my community?',
        a: 'If you represent a community organisation, contact us through our partner page or email hello@goodsoncountry.com. We work with housing bodies, health services, and community councils to assess needs and arrange deliveries.',
      },
    ],
  },
  {
    category: 'About Us',
    questions: [
      {
        q: 'Where are Stretch Beds made?',
        a: 'We\'re building on-country manufacturing capability. The recycled plastic legs are pressed from collected HDPE plastic, steel poles are sourced from Australian suppliers, and the canvas is Australian-made. Our goal is community-owned production facilities.',
      },
      {
        q: 'How much plastic does each bed divert from landfill?',
        a: 'Each Stretch Bed uses approximately 20kg of recycled HDPE plastic that would otherwise end up in landfill or the environment.',
      },
      {
        q: 'Can I volunteer or get involved?',
        a: 'We welcome community involvement! Contact us to learn about volunteering, corporate build days (like QIC\'s NAIDOC week plans), or other ways to contribute.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="bg-gradient-to-br from-green-50 to-blue-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/wiki" className="text-green-600 hover:text-green-700 text-sm font-medium mb-4 inline-block">
            &larr; Back to Wiki
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h1>
          <p className="text-lg text-gray-600">
            Common questions about Goods on Country products, ordering, and community support.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {faqs.map(section => (
          <section key={section.category} className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
              {section.category}
            </h2>
            <div className="space-y-6">
              {section.questions.map((faq, i) => (
                <details key={i} className="group">
                  <summary className="flex items-center justify-between cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                    <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0">
                      &#9660;
                    </span>
                  </summary>
                  <div className="px-4 pt-3 pb-4 text-gray-600 leading-relaxed">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        <div className="mt-12 p-6 bg-green-50 rounded-lg border border-green-100 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Still have questions?</h3>
          <p className="text-gray-600 mb-4">
            We&apos;re here to help. Reach out to our team.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/contact" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium">
              Contact Us
            </Link>
            <Link href="/support" className="px-4 py-2 bg-white text-green-700 border border-green-200 rounded-md hover:bg-green-50 transition-colors text-sm font-medium">
              Support Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
