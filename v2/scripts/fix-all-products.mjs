import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cwsyhpiuepvdjtxaozwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3c3locGl1ZXB2ZGp0eGFvendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTcxODgsImV4cCI6MjA4MDIzMzE4OH0.Pgexh-ff_zU4SsDWV3uGO7foQjCO8xZbWvN_BU6Vxkw'
);

const products = [
  {
    slug: 'basket-bed-single',
    name: 'The Greate Bed - Single',
    short_description: 'Handwoven beds for remote communities. 40% returns to community, each bed diverts 25kg plastic from landfill.',
    description: `Every night, thousands of people in remote Australian communities sleep on the floor, on thin mattresses, or share beds three or four to a single frame. The Greate Bed was born from a simple question: what if a good night's sleep could be as fundamental to life in remote Australia as a troop carrier or an Akubra hat?

Developed through deep consultation with the Oonchiumpa Bloomfield family in Tennant Creek, the Greate Bed combines traditional basket-weaving knowledge with modern durability. When Diane Stokes received her first bed, she came back within two weeks requesting twenty more for her community.

This isn't charity — it's commerce with community at its heart. 40% of every sale returns to the communities where our artisans live and work. Each bed diverts 25kg of plastic from landfill through our circular economy model.

The Greate Bed is built to last in tough conditions: a 200kg load capacity, no tools required for assembly, and a 5-year warranty.`,
    price_cents: 85000,
    currency: 'AUD',
    product_type: 'basket_bed',
    featured_image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg',
    images: [
      'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg',
      'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg',
      'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg'
    ],
    is_active: true,
    is_featured: true,
    metadata: {
      dimensions: '188cm x 92cm x 30cm',
      materials: 'Cane, rope, hardwood frame',
      assembly_time: '5 minutes (no tools required)',
      warranty: '5 years',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      components: [
        { name: 'Hardwood Frame', description: 'Durable hardwood frame built to withstand remote conditions. Supports up to 200kg.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg' },
        { name: 'Woven Cane Mat', description: 'Hand-woven cane sleeping surface using traditional techniques passed down through generations.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg' },
        { name: 'Rope Bindings', description: 'Strong rope bindings secure the mat to the frame. Made from recycled HDPE plastic.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg' },
        { name: 'Leg Assemblies (x4)', description: 'Powder-coated steel legs with tool-free attachment. Raises bed 30cm off ground.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg' }
      ],
      assembly_steps: [
        { step: 1, title: 'Unpack components', description: 'Remove the frame, mat, and four legs from packaging. Lay frame flat on the ground.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg' },
        { step: 2, title: 'Attach the legs', description: 'Insert each leg into the corner sockets on the frame. Twist clockwise until locked.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg' },
        { step: 3, title: 'Flip the frame', description: 'With legs attached, carefully flip the frame so it stands on its legs.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg' },
        { step: 4, title: 'Place the mat', description: 'Position the woven cane mat on top of the frame. Secure with the rope bindings at each corner.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg' }
      ],
      sustainability: {
        plastic_diverted_kg: 25,
        carbon_saved_kg: 12,
        local_jobs_supported: 1,
        community_share_percent: 40
      },
      enterprise_opportunity: {
        enabled: true,
        title: 'Run this enterprise in your community',
        description: 'Communities can license the Goods model to manufacture and distribute beds locally, creating employment and keeping 100% of profits in community.',
        benefits: ['Full training and ongoing support', 'Supply chain and material connections', 'Marketing materials and brand usage', 'Quality assurance framework'],
        contact_cta: 'Express Interest'
      }
    }
  },
  {
    slug: 'basket-bed-double',
    name: 'The Greate Bed - Double',
    short_description: 'Double-sized handwoven bed for families. 40% returns to community.',
    description: `The double-sized Greate Bed provides sleeping space for couples or families who need extra room. Built with the same quality craftsmanship as our single bed, but wider for comfort.

Like all Goods products, the double Greate Bed is built on a foundation of community ownership. 40% of every sale returns directly to the artisans and their communities.`,
    price_cents: 110000,
    currency: 'AUD',
    product_type: 'basket_bed',
    featured_image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg',
    images: [
      'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg',
      'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg'
    ],
    is_active: true,
    is_featured: true,
    metadata: {
      dimensions: '188cm x 138cm x 30cm',
      materials: 'Cane, rope, hardwood frame',
      assembly_time: '5 minutes (no tools required)',
      warranty: '5 years',
      components: [
        { name: 'Hardwood Frame (Double)', description: 'Extra-wide hardwood frame. Supports up to 300kg.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg' },
        { name: 'Woven Cane Mat (Double)', description: 'Hand-woven cane sleeping surface, double width.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg' },
        { name: 'Leg Assemblies (x6)', description: 'Six powder-coated steel legs for extra support.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg' }
      ],
      assembly_steps: [
        { step: 1, title: 'Unpack components', description: 'Remove all components from packaging.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg' },
        { step: 2, title: 'Attach all six legs', description: 'Insert each leg and twist clockwise to lock.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg' },
        { step: 3, title: 'Flip and position', description: 'Flip the frame and place the mat on top.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg' }
      ],
      sustainability: { plastic_diverted_kg: 35, carbon_saved_kg: 18, local_jobs_supported: 1, community_share_percent: 40 },
      enterprise_opportunity: { enabled: true, title: 'Run this enterprise in your community', description: 'License the Goods model for local manufacturing.', benefits: ['Full training', 'Supply chain', 'Marketing', 'Quality assurance'], contact_cta: 'Express Interest' }
    }
  },
  {
    slug: 'weave-bed-single',
    name: 'Stretch Bed - Single',
    short_description: 'Premium tension-weave design. Lighter, flexible, adapts to your body. 40% returns to community.',
    description: `The Stretch Bed represents the next evolution in community-made sleeping solutions. Born from collaboration between traditional weavers and modern designers, it uses an innovative tension-weave technique that creates natural flexibility — the bed literally adapts to your body as you rest.

At just 12kg, the Stretch Bed can be carried by one person, yet still supports 200kg and carries the same 5-year warranty as our Greate Bed.`,
    price_cents: 120000,
    currency: 'AUD',
    product_type: 'stretch_bed',
    featured_image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg',
    images: [
      'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg',
      'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg'
    ],
    is_active: true,
    is_featured: true,
    metadata: {
      dimensions: '188cm x 92cm x 25cm',
      materials: 'Woven cord, hardwood frame',
      assembly_time: '5 minutes (no tools required)',
      warranty: '5 years',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      components: [
        { name: 'Lightweight Frame', description: 'Engineered hardwood frame, 30% lighter. Supports up to 200kg.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg' },
        { name: 'Tension-Weave Surface', description: 'Innovative weave technique creates natural flexibility.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg' },
        { name: 'Quick-Lock Legs (x4)', description: 'Snap-in legs for faster assembly.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg' }
      ],
      assembly_steps: [
        { step: 1, title: 'Unfold the frame', description: 'The Stretch Bed frame unfolds in one motion.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg' },
        { step: 2, title: 'Snap in the legs', description: 'Push each leg until you hear a click.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg' },
        { step: 3, title: 'Ready to use', description: 'The surface is pre-attached. Done!', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg' }
      ],
      sustainability: { plastic_diverted_kg: 20, carbon_saved_kg: 10, local_jobs_supported: 1, community_share_percent: 40 },
      enterprise_opportunity: { enabled: true, title: 'Run this enterprise in your community', description: 'We provide full weaving technique training.', benefits: ['Weaving training', 'Supply chain', 'Marketing support', 'Quality framework'], contact_cta: 'Express Interest' }
    }
  },
  {
    slug: 'weave-bed-double',
    name: 'Stretch Bed - Double',
    short_description: 'Double-sized premium tension-weave bed. Lightweight and flexible.',
    description: `The double Stretch Bed brings our innovative tension-weave design to a larger format. Despite the larger size, it remains remarkably light at just 16kg.`,
    price_cents: 150000,
    currency: 'AUD',
    product_type: 'stretch_bed',
    featured_image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg',
    images: ['https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg'],
    is_active: true,
    is_featured: false,
    metadata: {
      dimensions: '188cm x 138cm x 25cm',
      materials: 'Woven cord, hardwood frame',
      assembly_time: '5 minutes',
      warranty: '5 years',
      components: [
        { name: 'Lightweight Double Frame', description: 'Wider engineered frame, still light.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg' },
        { name: 'Double Tension-Weave Surface', description: 'Wider weave adapts to multiple sleepers.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg' }
      ],
      assembly_steps: [
        { step: 1, title: 'Unfold and snap legs', description: 'Unfold frame, snap in all six legs.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg' },
        { step: 2, title: 'Ready', description: 'Surface is pre-attached. Done!', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg' }
      ],
      sustainability: { plastic_diverted_kg: 28, carbon_saved_kg: 14, local_jobs_supported: 1, community_share_percent: 40 },
      enterprise_opportunity: { enabled: true, title: 'Run this enterprise in your community', description: 'License the Goods model.', benefits: ['Full training', 'Supply chain', 'Marketing', 'Quality assurance'], contact_cta: 'Express Interest' }
    }
  },
  {
    slug: 'washing-machine-standard',
    name: 'Pakkimjalki Kari Washing Machine',
    short_description: 'Built for remote Australia. Solar-compatible, low water, locally repairable.',
    description: `One Alice Springs provider sells $3 million worth of washing machines annually into remote communities. Most end up in dumps within months. The Pakkimjalki Kari exists to change that.

"Pakkimjalki Kari" means "washing machine" in Warlpiri language. Before Linda Turner got hers in Maningrida, washing clothes meant a 4-hour round trip to town.

Specs: 8kg capacity, 50L water per cycle, 1200W solar-compatible, 2-year warranty.`,
    price_cents: 65000,
    currency: 'AUD',
    product_type: 'washing_machine',
    featured_image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg',
    images: ['https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg'],
    is_active: true,
    is_featured: true,
    metadata: {
      dimensions: '60cm x 60cm x 85cm',
      materials: 'Steel body, stainless drum',
      assembly_time: 'Plug and play',
      warranty: '2 years parts and labour',
      video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      components: [
        { name: 'Stainless Steel Drum', description: '8kg capacity, rust-resistant.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg' },
        { name: 'Low-Water System', description: '50L per cycle — critical for remote water supplies.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg' },
        { name: 'Solar-Ready Motor', description: '1200W, 0.6 kWh per cycle.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg' },
        { name: 'Common Parts Design', description: 'Every part replaceable with common components.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg' }
      ],
      assembly_steps: [
        { step: 1, title: 'Position', description: 'Place on flat surface near water.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg' },
        { step: 2, title: 'Connect water', description: 'Attach inlet hose to tap.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg' },
        { step: 3, title: 'Connect drain', description: 'Position drain hose.', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg' },
        { step: 4, title: 'Power on', description: 'Connect to 240V or solar. Ready!', image: 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg' }
      ],
      sustainability: { plastic_diverted_kg: 0, carbon_saved_kg: 50, local_jobs_supported: 2, community_share_percent: 30 },
      enterprise_opportunity: { enabled: true, title: 'Become a repair hub for your region', description: 'Communities can become certified repair centres.', benefits: ['Repair technician training', 'Parts supply chain', 'Service contracts', 'Ongoing support'], contact_cta: 'Become a Repair Hub' }
    }
  }
];

console.log('Upserting all products...\n');

const { data, error } = await supabase
  .from('products')
  .upsert(products, { onConflict: 'slug' })
  .select('slug, name');

if (error) {
  console.error('ERROR:', error.message);
  console.error('Details:', error);
} else {
  console.log('SUCCESS! Updated products:');
  data.forEach(p => console.log(`  ✓ ${p.name} (${p.slug})`));
}
