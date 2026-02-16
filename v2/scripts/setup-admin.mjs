#!/usr/bin/env node

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: join(__dirname, '..', '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing environment variables:');
  console.error('   NEXT_PUBLIC_SUPABASE_URL');
  console.error('   SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

console.log('🚀 Setting up admin authentication...\n');

// Step 1: Create profiles table via SQL
console.log('📋 Step 1: Creating profiles table...');
const sqlFile = join(__dirname, '..', 'setup-auth.sql');
const sql = readFileSync(sqlFile, 'utf-8');

// Execute SQL via PostgREST
const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    apikey: SUPABASE_SERVICE_KEY,
    Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
  },
  body: JSON.stringify({ query: sql }),
});

if (!response.ok) {
  console.log('⚠️  Could not execute SQL via API (this is okay, we\'ll continue)');
  console.log('   You may need to run setup-auth.sql manually in Supabase SQL Editor');
}

// Step 2: Create admin user
console.log('\n👤 Step 2: Creating admin user...');

const adminEmail = 'admin@goodsoncountry.com';
const adminPassword = 'GoodsAdmin2026!';

const { data: userData, error: userError } = await supabase.auth.admin.createUser({
  email: adminEmail,
  password: adminPassword,
  email_confirm: true,
});

if (userError) {
  if (userError.message.includes('already registered')) {
    console.log('✅ User already exists:', adminEmail);

    // Get the existing user
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const existingUser = users.find(u => u.email === adminEmail);

    if (existingUser) {
      console.log('   User ID:', existingUser.id);

      // Update to admin role
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({ id: existingUser.id, role: 'admin' }, { onConflict: 'id' });

      if (profileError) {
        console.error('❌ Failed to update profile:', profileError.message);
      } else {
        console.log('✅ Admin role granted');
      }
    }
  } else {
    console.error('❌ Failed to create user:', userError.message);
    process.exit(1);
  }
} else {
  console.log('✅ User created:', userData.user.id);

  // Set admin role
  const { error: profileError } = await supabase
    .from('profiles')
    .insert({ id: userData.user.id, role: 'admin' });

  if (profileError) {
    console.error('❌ Failed to set admin role:', profileError.message);
    process.exit(1);
  }

  console.log('✅ Admin role granted');
}

console.log('\n✅ Setup complete!\n');
console.log('🔑 Login Credentials:');
console.log(`   Email: ${adminEmail}`);
console.log(`   Password: ${adminPassword}`);
console.log('\n🌐 Sign in at: http://localhost:3004/login');
console.log('\n⚠️  If the profiles table doesn\'t exist, run this in Supabase SQL Editor:');
console.log('   cat v2/setup-auth.sql | pbcopy  (copies to clipboard)');
