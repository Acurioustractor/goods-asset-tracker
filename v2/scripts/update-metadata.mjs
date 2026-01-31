import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cwsyhpiuepvdjtxaozwf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3c3locGl1ZXB2ZGp0eGFvendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTcxODgsImV4cCI6MjA4MDIzMzE4OH0.Pgexh-ff_zU4SsDWV3uGO7foQjCO8xZbWvN_BU6Vxkw';

const supabase = createClient(supabaseUrl, supabaseKey);

const metadata = {
  dimensions: "188cm x 92cm x 30cm",
  weight_kg: 15,
  load_capacity_kg: 200,
  assembly_time: "5 minutes",
  warranty: "5 years",
  materials: "Cane, rope, hardwood frame",
  community_share_percent: 40,
  plastic_diverted_kg: 25,
  video_url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  components: [
    { name: "Hardwood Frame", description: "Durable hardwood frame built to withstand remote conditions. Supports up to 200kg.", image: "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg" },
    { name: "Woven Cane Mat", description: "Hand-woven cane sleeping surface using traditional techniques.", image: "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg" },
    { name: "Rope Bindings", description: "Strong rope bindings made from recycled HDPE plastic.", image: "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg" },
    { name: "Leg Assemblies (x4)", description: "Powder-coated steel legs with tool-free attachment.", image: "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg" }
  ],
  assembly_steps: [
    { step: 1, title: "Unpack components", description: "Remove the frame, mat, and four legs from packaging.", image: "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg" },
    { step: 2, title: "Attach the legs", description: "Insert each leg into the corner sockets. Twist clockwise until locked.", image: "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f06aca919ac39a08c6cbc_20250629-IMG_7731.jpg" },
    { step: 3, title: "Flip the frame", description: "With legs attached, flip the frame so it stands on its legs.", image: "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686f0a19b97e3e9c7b4dc6f0_20250628-IMG_6976.jpg" },
    { step: 4, title: "Place the mat", description: "Position the woven mat on the frame. Secure with rope bindings.", image: "https://cdn.prod.website-files.com/64ea91d86ff3fda1ff23fb95/686e5122692fd1a0ee508f2e_20250628-IMG_6872.jpg" }
  ],
  sustainability: { plastic_diverted_kg: 25, carbon_saved_kg: 12, local_jobs_supported: 1, community_share_percent: 40 },
  enterprise_opportunity: {
    enabled: true,
    title: "Run this enterprise in your community",
    description: "Communities can license the Goods model to manufacture and distribute beds locally.",
    benefits: ["Full training and ongoing support", "Supply chain connections", "Marketing materials", "Quality assurance framework"],
    contact_cta: "Express Interest"
  }
};

const { data, error } = await supabase
  .from('products')
  .update({ metadata })
  .eq('slug', 'the-greate-bed')
  .select();

if (error) {
  console.error('Error:', error);
} else {
  console.log('Updated:', data?.[0]?.name || 'the-greate-bed');
}
