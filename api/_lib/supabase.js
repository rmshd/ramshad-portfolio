const { createClient } = require('@supabase/supabase-js');

function env(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured in Vercel.`);
  return value;
}

function getSupabaseAdmin() {
  return createClient(env('SUPABASE_URL'), env('SUPABASE_SERVICE_ROLE_KEY'), {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}

function getPublicConfig() {
  return {
    supabaseUrl: env('SUPABASE_URL'),
    supabaseAnonKey: env('SUPABASE_ANON_KEY'),
    bucket: process.env.SUPABASE_STORAGE_BUCKET || 'portfolio-media'
  };
}

module.exports = { getSupabaseAdmin, getPublicConfig };
