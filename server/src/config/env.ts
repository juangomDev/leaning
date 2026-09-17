import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '',
  jwtSecret: process.env.JWT_SECRET || 'educonnect_dev_secret_key_2026',
  isSupabaseConfigured(): boolean {
    return Boolean(this.supabaseUrl && this.supabaseKey && !this.supabaseUrl.includes('your-project'));
  },
};
