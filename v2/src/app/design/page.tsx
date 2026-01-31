import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const concepts = [
  {
    id: 1,
    name: 'Country First',
    description: 'Expansive landscape photography, ochre earth tones, reverent tone',
    palette: ['#fafaf9', '#C2703B', '#2D5A47', '#1C1917'],
    mood: 'Reverent, grounded',
    href: '/design/country-first',
    status: 'prototype',
  },
  {
    id: 2,
    name: 'Circular Story',
    description: 'Environmental transformation narrative, forest greens, recycling journey',
    palette: ['#FFFEF5', '#1B4332', '#D4A373', '#081C15'],
    mood: 'Innovative, hopeful',
    href: '/design/circular-story',
    status: 'concept',
  },
  {
    id: 3,
    name: 'Community Voices',
    description: 'Testimonial-first, faces and stories, warm terracotta',
    palette: ['#FDF8F3', '#C45C3E', '#8B9D77', '#2E2E2E'],
    mood: 'Intimate, trustworthy',
    href: '/design/community-voices',
    status: 'prototype',
  },
  {
    id: 4,
    name: 'Bold Impact',
    description: 'Data-driven, bold typography, dark background, gold accents',
    palette: ['#1A1A1A', '#E8A54B', '#FFFFFF', '#333333'],
    mood: 'Confident, modern',
    href: '/design/bold-impact',
    status: 'concept',
  },
  {
    id: 5,
    name: 'Gentle Earth',
    description: 'Soft, organic shapes, handmade feel, linen textures',
    palette: ['#F5F0EB', '#A67B5B', '#B5C9B9', '#4A4543'],
    mood: 'Nurturing, artisanal',
    href: '/design/gentle-earth',
    status: 'concept',
  },
  {
    id: 6,
    name: 'Mission Forward',
    description: 'Purpose-driven, Patagonia style, clear mission statement',
    palette: ['#FFFFFF', '#1E3A5F', '#E07A3E', '#111111'],
    mood: 'Action-driven, transparent',
    href: '/design/mission-forward',
    status: 'prototype',
  },
  {
    id: 7,
    name: 'Woven Stories',
    description: 'Cultural patterns, deep reds and golds, community connections',
    palette: ['#F7F4EF', '#8B3A3A', '#C9A959', '#3D2B1F'],
    mood: 'Cultural, respectful',
    href: '/design/woven-stories',
    status: 'concept',
  },
  {
    id: 8,
    name: 'Clean Commerce',
    description: 'Minimal, Apple-style, product photography focused',
    palette: ['#FFFFFF', '#333333', '#10B981', '#000000'],
    mood: 'Premium, efficient',
    href: '/design/clean-commerce',
    status: 'concept',
  },
  {
    id: 9,
    name: 'Journey Map',
    description: 'Storytelling timeline, bed journey visualization, blues',
    palette: ['#FAF7F2', '#4A6FA5', '#D4A03D', '#1A2E4C'],
    mood: 'Narrative, engaging',
    href: '/design/journey-map',
    status: 'concept',
  },
  {
    id: 10,
    name: 'Sponsor Hero',
    description: 'Donation-first, split buy/sponsor, gift-giving focus',
    palette: ['#FEFDFB', '#6B46C1', '#DC2626', '#0D9488'],
    mood: 'Generous, personal',
    href: '/design/sponsor-hero',
    status: 'concept',
  },
];

export default function DesignPage() {
  return (
    <main className="py-8 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">Design Sprint</Badge>
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">
            Homepage Design Exploration
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
            10 distinct concepts exploring different brand directions for Goods on Country.
            Select a concept to preview.
          </p>
        </div>

        {/* Design Principles Summary */}
        <Card className="mb-12 bg-muted/30">
          <CardHeader>
            <CardTitle>Guiding Principles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <h3 className="font-semibold text-foreground mb-2">Respecting Country</h3>
                <p className="text-sm text-muted-foreground">
                  Circular design connecting environmental care with community benefit
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Community-Driven</h3>
                <p className="text-sm text-muted-foreground">
                  Co-designed with communities, not for them. Voice in every decision.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Place-Based</h3>
                <p className="text-sm text-muted-foreground">
                  Made for Country. Adapted to heat, dust, humidity, remoteness.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Concepts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {concepts.map((concept) => (
            <Card key={concept.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {/* Color Palette Preview */}
              <div className="flex h-4">
                {concept.palette.map((color, i) => (
                  <div
                    key={i}
                    className="flex-1"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">
                    {concept.id}. {concept.name}
                  </CardTitle>
                  <Badge variant={concept.status === 'prototype' ? 'default' : 'secondary'}>
                    {concept.status}
                  </Badge>
                </div>
                <CardDescription>{concept.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  <strong>Mood:</strong> {concept.mood}
                </p>
                <div className="flex gap-2">
                  {concept.status === 'prototype' ? (
                    <Button asChild className="flex-1">
                      <Link href={concept.href}>View Prototype</Link>
                    </Button>
                  ) : (
                    <Button variant="outline" disabled className="flex-1">
                      Concept Only
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recommendation */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>Recommendation</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Based on the design principles and brand voice, a <strong>hybrid approach</strong> is suggested combining:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
              <li><strong>Community Voices (#3)</strong> for authenticity and trust</li>
              <li><strong>Mission Forward (#6)</strong> for clarity of purpose</li>
              <li><strong>Clean Commerce (#8)</strong> for e-commerce UX</li>
            </ul>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/design/community-voices">Start with Community Voices</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/docs/HOMEPAGE_DESIGN_EXPLORATION.md">View Full Document</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
