import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from './env.js';

export class SupabaseClientFactory {
  private static instance: SupabaseClient | null = null;
  private static adminInstance: SupabaseClient | null = null;

  public static getClient(): SupabaseClient | null {
    if (!config.isSupabaseConfigured()) {
      return null;
    }

    if (!this.instance) {
      this.instance = createClient(config.supabaseUrl, config.supabaseKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }

    return this.instance;
  }

  public static getAdminClient(): SupabaseClient | null {
    if (!config.isSupabaseConfigured()) {
      return null;
    }

    if (!this.adminInstance) {
      const key = config.supabaseServiceRoleKey || config.supabaseKey;
      this.adminInstance = createClient(config.supabaseUrl, key, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }

    return this.adminInstance;
  }
}

export const supabase = SupabaseClientFactory.getClient();
export const supabaseAdmin = SupabaseClientFactory.getAdminClient();
