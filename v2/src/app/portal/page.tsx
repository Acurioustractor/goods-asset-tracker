import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partner Portal | Goods on Country',
  description: 'Your community enterprise support system.',
};

const pillars = [
  {
    title: 'Ask Goods',
    subtitle: 'Get answers',
    description: 'Ask anything about your beds, facility, or enterprise. Instant answers from all Goods knowledge.',
    href: '/portal/ask-goods',
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
    ),
    colour: 'bg-green-600',
  },
  {
    title: 'Walk Together',
    subtitle: 'Track projects',
    description: 'Organise your enterprise steps, capture meetings, and track progress on everything.',
    href: '/portal/projects',
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
    colour: 'bg-amber-600',
  },
  {
    title: 'Our Story',
    subtitle: 'Tell the world',
    description: 'Build your enterprise report from photos, quotes, and milestones. Make funders say yes.',
    href: '/portal/our-story',
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
      </svg>
    ),
    colour: 'bg-blue-600',
  },
  {
    title: 'Where We\'re Heading',
    subtitle: 'Set goals',
    description: 'Capture what your community wants for the future. Connect goals to projects and track progress.',
    href: '/portal/goals',
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
      </svg>
    ),
    colour: 'bg-purple-600',
  },
];

export default function PortalHomePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* Welcome */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-stone-900 mb-2">
          G&apos;day, partner
        </h1>
        <p className="text-stone-600 text-lg">
          Your enterprise support system. What do you need?
        </p>
      </div>

      {/* Four big buttons */}
      <div className="grid grid-cols-1 gap-4">
        {pillars.map((pillar) => (
          <Link
            key={pillar.title}
            href={pillar.href}
            className="flex items-center gap-4 p-5 bg-white rounded-xl border border-stone-200 hover:border-stone-300 hover:shadow-md transition-all active:scale-[0.98]"
          >
            <div className={`${pillar.colour} text-white p-3 rounded-xl flex-shrink-0`}>
              {pillar.icon}
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <h2 className="text-lg font-bold text-stone-900">{pillar.title}</h2>
                <span className="text-sm text-stone-500">{pillar.subtitle}</span>
              </div>
              <p className="text-sm text-stone-600 mt-0.5">{pillar.description}</p>
            </div>
            <svg className="w-5 h-5 text-stone-400 flex-shrink-0 ml-auto" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </Link>
        ))}
      </div>

      {/* Quick help */}
      <div className="mt-8 p-4 bg-green-50 rounded-xl border border-green-100 text-center">
        <p className="text-sm text-green-800">
          Need to talk to a person? <a href="tel:+61400000000" className="font-bold underline">Call Ben</a> anytime.
        </p>
      </div>
    </div>
  );
}
