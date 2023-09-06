import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_PUBLIC_SUPABASE_URL;
const serviceRoleKey = import.meta.env.VITE_PUBLIC_SUPABASE_SERVICE_ROLE_KEY


const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const adminAuthClient = supabase.auth.admin;

export { supabase, adminAuthClient };
