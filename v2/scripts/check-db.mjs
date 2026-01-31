import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://cwsyhpiuepvdjtxaozwf.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3c3locGl1ZXB2ZGp0eGFvendmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2NTcxODgsImV4cCI6MjA4MDIzMzE4OH0.Pgexh-ff_zU4SsDWV3uGO7foQjCO8xZbWvN_BU6Vxkw'
);

const { data, error } = await supabase.from('products').select('slug, name, metadata');

if (error) {
  console.error('DB Error:', error);
  process.exit(1);
}

console.log('=== Products in database ===\n');
for (const p of data) {
  console.log(`Product: ${p.slug}`);
  console.log(`  Name: ${p.name}`);
  const keys = p.metadata ? Object.keys(p.metadata) : [];
  console.log(`  Metadata keys: ${keys.join(', ') || 'NONE'}`);
  if (p.metadata?.components) {
    console.log(`  Has components: YES (${p.metadata.components.length} items)`);
  }
  if (p.metadata?.assembly_steps) {
    console.log(`  Has assembly_steps: YES (${p.metadata.assembly_steps.length} steps)`);
  }
  console.log('');
}
