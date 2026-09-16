import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from '../../config/env.js';

export const supabase: SupabaseClient | null = config.isSupabaseConfigured()
  ? createClient(config.supabaseUrl, config.supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;
