// ============================================================
//  BillSafe — Supabase Configuration
//  Replace SUPABASE_URL and SUPABASE_ANON_KEY with your own
//  values from: https://supabase.com → your project → Settings → API
// ============================================================

const SUPABASE_URL  = 'https://YOUR_PROJECT_ID.supabase.co';
const SUPABASE_ANON = 'YOUR_ANON_PUBLIC_KEY';

const { createClient } = supabase;
const db = createClient(SUPABASE_URL, SUPABASE_ANON);

export default db;
