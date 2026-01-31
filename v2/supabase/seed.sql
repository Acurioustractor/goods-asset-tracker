-- Seed data for Goods v2 e-commerce

-- Products
-- Pricing: Sponsorship/retail prices for beds delivered to remote communities
-- Stretch Bed - $1,200 (premium woven design) — HERO PRODUCT
-- The Greate Bed (basket_bed) - $850 (covers production, transport, setup)
-- Pakkimjalki Kari Washing Machine - $650 (includes installation)
-- Accessories: covers, frames, toppers

INSERT INTO products (slug, name, description, short_description, price_cents, product_type, images, featured_image, is_active, is_featured, metadata) VALUES
-- Stretch Bed - HERO PRODUCT, premium tension-weave design (listed first)
('stretch-bed', 'Stretch Bed',
'The Stretch Bed represents the next evolution in community-made sleeping solutions. Born from collaboration between traditional weavers and modern designers, it uses an innovative tension-weave technique that creates natural flexibility — the bed literally adapts to your body as you rest.

This design emerged from listening to community feedback. People wanted something lighter, easier to transport between camps and houses. At just 12kg, the Stretch Bed can be carried by one person, yet still supports 200kg and carries the same 5-year warranty as our Greate Bed.

Like all Goods products, the Stretch Bed is built on a foundation of community ownership. 40% of every sale returns directly to the artisans and their communities. Products can be Aboriginal owned and controlled while sold commercially — that''s the model we''re proving works.

The premium price reflects the additional skill and time required for the tension-weave construction, and supports the training of new weavers in this technique. Every Stretch Bed purchased helps preserve and evolve traditional weaving knowledge.

**Specifications:**
• Weight: ~12kg (lighter design for portability)
• Load capacity: 200kg
• Assembly time: 5 minutes (no tools required)
• Warranty: 5 years
• Materials: Woven cord, hardwood frame',
'Premium tension-weave design. Lighter, flexible, adapts to your body. 40% returns to community.',
120000, 'stretch_bed',
ARRAY['https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg', 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg', 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg'],
'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg',
true, true,
'{
  "dimensions": "188cm x 92cm x 25cm",
  "weight_kg": 12,
  "load_capacity_kg": 200,
  "assembly_time": "5 minutes",
  "warranty": "5 years",
  "materials": "Woven cord, hardwood frame",
  "community_share_percent": 40,
  "plastic_diverted_kg": 25,
  "display_order": 1,
  "components": [
    {
      "name": "Hardwood Frame",
      "description": "Lightweight hardwood frame with powder-coated steel reinforcement. Supports up to 200kg.",
      "image": "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg"
    },
    {
      "name": "Tension-Weave Surface",
      "description": "Innovative woven cord sleeping surface that adapts to body shape. Combines traditional weaving knowledge with modern materials.",
      "image": "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg"
    },
    {
      "name": "Cord Bindings",
      "description": "Strong cord bindings secure the weave to the frame. Made from recycled HDPE plastic.",
      "image": "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg"
    },
    {
      "name": "Leg Assemblies (x4)",
      "description": "Powder-coated steel legs with tool-free attachment. Raises bed 25cm off ground.",
      "image": "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg"
    }
  ],
  "assembly_steps": [
    {
      "step": 1,
      "title": "Unpack components",
      "description": "Remove the frame, weave surface, and four legs from packaging. Lay frame flat on the ground.",
      "image": "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg"
    },
    {
      "step": 2,
      "title": "Attach the legs",
      "description": "Insert each leg into the corner sockets on the frame. Twist clockwise until locked.",
      "image": "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg"
    },
    {
      "step": 3,
      "title": "Flip the frame",
      "description": "With legs attached, carefully flip the frame so it stands on its legs.",
      "image": "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg"
    },
    {
      "step": 4,
      "title": "Attach the weave",
      "description": "Position the tension-weave surface on top of the frame. Hook the cord bindings at each attachment point.",
      "image": "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg"
    }
  ],
  "sustainability": {
    "plastic_diverted_kg": 25,
    "carbon_saved_kg": 10,
    "local_jobs_supported": 1,
    "community_share_percent": 40
  },
  "enterprise_opportunity": {
    "enabled": true,
    "title": "Run this enterprise in your community",
    "description": "Communities can learn the tension-weave technique to manufacture and distribute Stretch Beds locally, creating employment and keeping 100% of profits in community.",
    "benefits": [
      "Full training in tension-weave technique",
      "Supply chain and material connections",
      "Marketing materials and brand usage",
      "Quality assurance framework"
    ],
    "contact_cta": "Express Interest"
  }
}'),

-- The Greate Bed - Flagship basket bed product
('the-greate-bed', 'The Greate Bed',
'Every night, thousands of people in remote Australian communities sleep on the floor, on thin mattresses, or share beds three or four to a single frame. The Greate Bed was born from a simple question: what if a good night''s sleep could be as fundamental to life in remote Australia as a troop carrier or an Akubra hat?

Developed through deep consultation with the Oonchiumpa Bloomfield family in Tennant Creek, the Greate Bed combines traditional basket-weaving knowledge with modern durability. When Diane Stokes received her first bed, she came back within two weeks requesting twenty more for her community. Norm Frank called asking for three beds in maroon after his daughter tried one.

This isn''t charity — it''s commerce with community at its heart. 40% of every sale returns to the communities where our artisans live and work. Each bed diverts 25kg of plastic from landfill through our circular economy model.

The Greate Bed is built to last in tough conditions: a 200kg load capacity, no tools required for assembly, and a 5-year warranty. When you sponsor a bed, you''re not just providing furniture — you''re supporting employment, preserving cultural practice, and giving someone the dignity of rest.

**Specifications:**
• Weight: ~15kg (easy to move)
• Load capacity: 200kg
• Assembly time: 5 minutes (no tools required)
• Warranty: 5 years
• Materials: Cane, rope, hardwood frame',
'Handwoven beds for remote communities. 40% returns to community, each bed diverts 25kg plastic from landfill.',
85000, 'basket_bed',
ARRAY['https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg', 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg', 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg'],
'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg',
true, true,
'{
  "dimensions": "188cm x 92cm x 30cm",
  "weight_kg": 15,
  "load_capacity_kg": 200,
  "assembly_time": "5 minutes",
  "warranty": "5 years",
  "materials": "Cane, rope, hardwood frame",
  "community_share_percent": 40,
  "plastic_diverted_kg": 25,
  "display_order": 2,
  "video_url": "https://www.youtube.com/embed/dQw4w9WgXcQ",
  "components": [
    {
      "name": "Hardwood Frame",
      "description": "Durable hardwood frame built to withstand remote conditions. Supports up to 200kg.",
      "image": "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg"
    },
    {
      "name": "Woven Cane Mat",
      "description": "Hand-woven cane sleeping surface using traditional techniques passed down through generations.",
      "image": "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg"
    },
    {
      "name": "Rope Bindings",
      "description": "Strong rope bindings secure the mat to the frame. Made from recycled HDPE plastic.",
      "image": "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg"
    },
    {
      "name": "Leg Assemblies (x4)",
      "description": "Powder-coated steel legs with tool-free attachment. Raises bed 30cm off ground.",
      "image": "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg"
    }
  ],
  "assembly_steps": [
    {
      "step": 1,
      "title": "Unpack components",
      "description": "Remove the frame, mat, and four legs from packaging. Lay frame flat on the ground.",
      "image": "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg"
    },
    {
      "step": 2,
      "title": "Attach the legs",
      "description": "Insert each leg into the corner sockets on the frame. Twist clockwise until locked.",
      "image": "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg"
    },
    {
      "step": 3,
      "title": "Flip the frame",
      "description": "With legs attached, carefully flip the frame so it stands on its legs.",
      "image": "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg"
    },
    {
      "step": 4,
      "title": "Place the mat",
      "description": "Position the woven cane mat on top of the frame. Secure with the rope bindings at each corner.",
      "image": "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg"
    }
  ],
  "sustainability": {
    "plastic_diverted_kg": 25,
    "carbon_saved_kg": 12,
    "local_jobs_supported": 1,
    "community_share_percent": 40
  },
  "enterprise_opportunity": {
    "enabled": true,
    "title": "Run this enterprise in your community",
    "description": "Communities can license the Goods model to manufacture and distribute beds locally, creating employment and keeping 100% of profits in community.",
    "benefits": [
      "Full training and ongoing support",
      "Supply chain and material connections",
      "Marketing materials and brand usage",
      "Quality assurance framework"
    ],
    "contact_cta": "Express Interest"
  }
}'),

-- Pakkimjalki Kari Washing Machine ("Washing Machine" in Warlpiri language)
('pakkimjalki-kari-washing-machine', 'Pakkimjalki Kari Washing Machine',
'One Alice Springs provider sells $3 million worth of washing machines annually into remote communities. Most end up in dumps within months — they''re not designed for the conditions, not repairable with local skills, and not worth fixing when something breaks. The Pakkimjalki Kari exists to change that.

"Pakkimjalki Kari" means "washing machine" in Warlpiri language. The name itself reflects our approach: products designed with community, named by community, repairable by community.

Before Linda Turner got her Pakkimjalki Kari in Maningrida, washing clothes meant a 4-hour round trip to town. Now families can keep clothes clean right where they live. Clean clothes aren''t a luxury — they''re dignity, health, and the confidence kids need to go to school.

The Pakkimjalki Kari is built for Australia''s toughest conditions: solar-compatible for off-grid locations, low water usage (50L per cycle), and designed so local people can maintain and repair it with common parts. When something breaks, you fix it — you don''t throw it away.

**Specifications:**
• Capacity: 8kg
• Water usage: 50L per cycle
• Power: 1200W — solar compatible (0.6 kWh per 30-min cycle)
• Warranty: 2 years parts and labour
• Design: Repairable with common parts',
'Built for remote Australia. Solar-compatible, low water, locally repairable. "Pakkimjalki Kari" — Warlpiri for washing machine.',
65000, 'washing_machine',
ARRAY['https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg', 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg', 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg'],
'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg',
true, true,
'{"capacity_kg": 8, "water_usage_l": 50, "power_watts": 1200, "kwh_per_cycle": 0.6, "power_requirements": "240V or solar", "warranty_years": 2, "display_order": 3}'),

-- Accessories
('bed-cover-fitted', 'Fitted Bed Cover',
'Custom-fitted cover designed specifically for Goods beds. Made from durable, breathable fabric that is easy to wash and quick to dry. Protects your bed while adding comfort.',
'Durable fitted cover for Goods beds.',
4500, 'accessory',
ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800'],
'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800',
true, false,
'{"fits": ["the-greate-bed", "stretch-bed"], "material": "cotton blend", "wash_instructions": "Machine wash cold", "display_order": 4}'),

('bed-frame-support', 'Bed Frame Support',
'Additional support frame for elevated bed placement. Raises the bed off the ground for improved airflow and easier access. Powder-coated steel construction for durability.',
'Elevated support frame for any Goods bed.',
8500, 'accessory',
ARRAY['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800'],
'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800',
true, false,
'{"height_cm": 40, "material": "powder-coated steel", "max_weight_kg": 200, "display_order": 5}'),

('mattress-topper', 'Comfort Mattress Topper',
'Extra-soft mattress topper for added comfort. Fits perfectly on Goods beds and is easy to roll up for transport or storage.',
'Soft foam topper for extra comfort.',
6500, 'accessory',
ARRAY['https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=800'],
'https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=800',
true, false,
'{"thickness_cm": 5, "material": "high-density foam", "fits": ["the-greate-bed", "stretch-bed"], "display_order": 6}')

ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  short_description = EXCLUDED.short_description,
  price_cents = EXCLUDED.price_cents,
  images = EXCLUDED.images,
  featured_image = EXCLUDED.featured_image,
  is_active = EXCLUDED.is_active,
  is_featured = EXCLUDED.is_featured,
  metadata = EXCLUDED.metadata;

-- Team Members / Community Voices
-- Real community members and supporters from Goods on Country
-- Updated with storytellers from Snow Foundation proposal and Empathy Ledger
INSERT INTO team_members (slug, name, role, bio, short_bio, is_artisan, is_staff, community, display_order, photo) VALUES
('diane-stokes', 'Diane Stokes', 'Community Champion', 'When Diane received her first Greate Bed, she came back within two weeks requesting twenty more for her community. That single moment captured everything Goods is about — word spreads through family, through community. One bed becomes twenty. Diane''s advocacy has helped bring beds to families across the region.', 'Requested 20 beds within two weeks of trying her first one.', false, false, 'Tennant Creek', 1, 'https://cdn.prod.website-files.com/64ea91d96ff3fda1ff23fc38/682be138b6216edeb9c3f159_IMG_2592.jpg'),
('norman-frank', 'Norman Frank', 'Community Leader', 'Norm called us one day asking for three beds — in maroon — after his daughter tried one. That''s how it works in community: word spreads through family. Norm works closely with Goods to ensure beds and washing machines reach the families who need them most. His deep knowledge of Yuendumu guides our delivery priorities.', 'Requested maroon beds after his daughter tried one.', false, false, 'Yuendumu', 2, 'https://cdn.prod.website-files.com/64ea91d96ff3fda1ff23fc38/682be13fde985a13def93b09_IMG_2783.jpg'),
('patricia-frank', 'Patricia Frank', 'Community Coordinator', 'Patricia helps coordinate bed deliveries in Yuendumu and provides direct feedback on product improvements. Her on-the-ground perspective ensures our beds work in real conditions for real families.', 'Community coordinator and product advisor.', false, false, 'Yuendumu', 3, 'https://cdn.prod.website-files.com/64ea91d96ff3fda1ff23fc38/682be1fa2b10661a712b7279_IMG_2575%20(1).jpg'),
('linda-turner', 'Linda Turner', 'Washing Machine Advocate', 'Before Linda got her Pakkimjalki Kari in Maningrida, washing clothes meant a 4-hour round trip to town. "Now families can keep clothes clean right here in community," she says. Linda has been a strong voice for the washing machine program, showing how practical solutions change daily life.', 'Championing the Pakkimjalki Kari program in Maningrida.', false, false, 'Maningrida', 4, 'https://cdn.prod.website-files.com/64ea91d96ff3fda1ff23fc38/682be1c72b10661a712b4fb0_IMG_2438%20(1).jpg'),
('kristy-bloomfield', 'Kristy Bloomfield', 'Oonchiumpa Director', 'Kristy leads Oonchiumpa, the organisation that has been central to developing Goods beds in Alice Springs. The Greate Bed was developed through deep consultation with the Oonchiumpa Bloomfield family in Tennant Creek, combining traditional knowledge with modern durability.', 'Oonchiumpa partnership and bed development.', false, false, 'Alice Springs', 5, 'https://cdn.prod.website-files.com/64ea91d96ff3fda1ff23fc38/682be1007554ed634e82c605_IMG_1937.jpg'),
('georgina-byron', 'Georgina Byron AM', 'Patron & Advocate', 'Georgina Byron AM is a distinguished patron of Goods on Country. Her tireless advocacy has helped raise awareness and funding for bed delivery programs across remote Australia, supporting the vision of making beds as fundamental as a troop carrier.', 'Distinguished patron and funding advocate.', false, false, NULL, 6, 'https://cdn.prod.website-files.com/64ea91d96ff3fda1ff23fc38/682be186b6216edeb9c4220c_IMG_2919.jpg')
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  role = EXCLUDED.role,
  bio = EXCLUDED.bio,
  short_bio = EXCLUDED.short_bio,
  photo = EXCLUDED.photo;

-- Stories - Real impact and community content
-- Based on Goods on Country knowledge base: 369+ beds delivered, 8 communities, 20 washing machines
-- Updated with deeper storytelling from Snow Foundation proposal and community voices
INSERT INTO stories (slug, title, subtitle, excerpt, content, story_type, community, is_published, is_featured, published_at, featured_image) VALUES
('welcome-to-goods', 'What if a good night''s sleep was as fundamental as a troop carrier?', 'The vision behind Goods on Country',
'369 beds delivered. 8 communities served. 40% of every sale back to community. This is commerce with community at its heart.',
'Every night, thousands of people in remote Australian communities sleep on the floor, on thin mattresses, or share beds three or four to a single frame. This isn''t ancient history — it''s happening right now, in one of the wealthiest nations on earth.

Goods on Country was born from a simple question: what if a good night''s sleep could be as fundamental to life in remote Australia as a troop carrier or an Akubra hat?

**Our Model: Commerce, Not Charity**

This isn''t aid. It''s business — but business done differently. 40% of every sale returns directly to the communities where our artisans live and work. Products can be Aboriginal owned and controlled while sold commercially. That''s the model we''re proving works.

When Diane Stokes received her first Greate Bed, she came back within two weeks requesting twenty more for her community. Norm Frank called asking for three beds in maroon after his daughter tried one. Demand isn''t the problem — supply is.

**The Numbers:**
• 369+ beds delivered across Australia
• 8 communities served
• 20+ washing machines deployed
• 200-350 beds currently requested

**Circular Economy**

Each bed diverts 25kg of plastic from landfill. One Alice Springs provider sells $3 million of washing machines annually into communities — most ending up in dumps. We build things that last, that can be repaired, that don''t become someone else''s waste problem.

The Greate Bed and Stretch Bed are designed for durability in remote conditions: 200kg load capacity, 5-year warranty, no tools required. When you sponsor a bed, you''re not just providing furniture — you''re supporting employment, preserving cultural practice, and giving someone the dignity of rest.',
'news', NULL, true, true, NOW(), 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg'),

('yuendumu-delivery', 'Norm Frank''s maroon beds', 'When one bed becomes twenty',
'Norm Frank called requesting three beds in maroon after his daughter tried one. That''s how word spreads in community.',
'Yuendumu, located approximately 300km northwest of Alice Springs, is home to one of the largest Warlpiri communities in Australia.

Norm Frank is a community leader who works closely with Goods to ensure beds and washing machines reach the families who need them most. His deep knowledge of community needs guides our delivery priorities.

When his daughter first slept on a Greate Bed, she told her father. Soon after, Norm called us: "Can I get three beds? In maroon?"

That''s how it works. Word spreads through family, through community. One bed becomes three becomes twenty. Diane Stokes received her first bed and came back within two weeks requesting twenty more.

"These beds make a real difference for our families," Norman says. "People are sleeping better, kids are going to school more rested."

The demand is there. Between 200 and 350 beds have been requested from communities we work with. The challenge now is scaling production to meet it — while keeping community ownership at the centre of everything we do.',
'community_voice', 'Yuendumu', true, false, NOW() - INTERVAL '7 days', 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg'),

('washing-machine-program', 'Pakkimjalki Kari: Breaking the dump cycle', 'Why $3 million worth of washing machines end up as waste',
'One provider sells $3 million of washing machines into communities each year. Most end up in dumps. The Pakkimjalki Kari is built to change that.',
'One Alice Springs provider sells $3 million worth of washing machines annually into remote communities. Most end up in dumps within months — they''re not designed for the conditions, not repairable with local skills, and not worth fixing when something breaks.

"Pakkimjalki Kari" means "washing machine" in Warlpiri language. We didn''t just translate the name — we designed the machine with community, named it with community, and built it so community can maintain and repair it.

**Linda Turner''s Story**

Linda Turner lives in Maningrida. Before she got her Pakkimjalki Kari, washing clothes meant a 4-hour round trip to town. Four hours for clean clothes. That''s not an inconvenience — that''s a barrier to dignity, health, and the confidence kids need to go to school.

"Now families can keep clothes clean right here in community," Linda says.

**Built Different**

The Pakkimjalki Kari is designed for Australia''s toughest conditions:
• Solar-compatible for off-grid locations
• 50L water per cycle (low water usage)
• Repairable with common parts by local people
• Robust construction for harsh environments

When something breaks, you fix it — you don''t throw it away. That''s the difference between a product designed for community and one designed for profit.',
'impact_report', 'Maningrida', true, true, NOW() - INTERVAL '14 days', 'https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg')

ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  subtitle = EXCLUDED.subtitle,
  excerpt = EXCLUDED.excerpt,
  content = EXCLUDED.content,
  featured_image = EXCLUDED.featured_image,
  is_published = EXCLUDED.is_published;

SELECT 'Seed data inserted successfully' as result;
