#!/usr/bin/env tsx

/**
 * Setup script for admin authentication
 * Creates profiles table, triggers, and initial admin user
 */

import { createClient } from '@supabase/supabase-js';
import * as readline from 'readline';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Missing Supabase credentials in environment variables');
  console.error('   Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createProfilesTable() {
  console.log('📋 Creating profiles table...');

  const { error } = await supabase.rpc('exec_sql', {
    sql: `
      -- Create profiles table
      CREATE TABLE IF NOT EXISTS profiles (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        role TEXT NOT NULL DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );

      -- Enable RLS
      ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

      -- Drop existing policies if they exist
      DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
      DROP POLICY IF EXISTS "Service role can do everything" ON profiles;

      -- Create policies
      CREATE POLICY "Users can read own profile" ON profiles
        FOR SELECT USING (auth.uid() = id);

      CREATE POLICY "Service role can do everything" ON profiles
        FOR ALL USING (true);

      -- Create function to handle new user signups
      CREATE OR REPLACE FUNCTION handle_new_user()
      RETURNS TRIGGER AS $$
      BEGIN
        INSERT INTO public.profiles (id, role)
        VALUES (new.id, 'user');
        RETURN new;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;

      -- Create trigger
      DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
      CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION handle_new_user();
    `,
  });

  if (error) {
    console.error('❌ Failed to create profiles table:', error);
    return false;
  }

  console.log('✅ Profiles table created successfully');
  return true;
}

async function createAdminUser(email: string, password: string) {
  console.log(`\n👤 Creating admin user: ${email}...`);

  // Create user in Supabase Auth
  const { data: authData, error: authError } =
    await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) {
    console.error('❌ Failed to create user:', authError.message);
    return false;
  }

  console.log('✅ User created:', authData.user.id);

  // Set role to admin
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert({
      id: authData.user.id,
      role: 'admin',
    });

  if (profileError) {
    console.error('❌ Failed to set admin role:', profileError.message);
    return false;
  }

  console.log('✅ Admin role granted');
  return true;
}

async function promptUser(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

async function main() {
  console.log('🚀 Goods on Country - Admin Auth Setup\n');

  // Create profiles table and triggers
  const tableCreated = await createProfilesTable();
  if (!tableCreated) {
    console.error('\n❌ Setup failed at table creation step');
    process.exit(1);
  }

  // Get admin credentials
  console.log('\n📝 Admin Account Setup');
  const email =
    (await promptUser('Enter admin email: ')) || 'admin@goodsoncountry.com';
  const password = (await promptUser('Enter admin password: ')) || 'Admin123!';

  // Create admin user
  const userCreated = await createAdminUser(email, password);
  if (!userCreated) {
    console.error('\n❌ Failed to create admin user');
    process.exit(1);
  }

  console.log('\n✅ Setup complete!');
  console.log('\n🔑 Login Credentials:');
  console.log(`   Email: ${email}`);
  console.log(`   Password: ${password}`);
  console.log('\n🌐 Sign in at: http://localhost:3004/login');
}

main();
