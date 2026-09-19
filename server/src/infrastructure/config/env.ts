import dotenv from 'dotenv';
dotenv.config();

export interface AppConfig {
  port: number;
  nodeEnv: string;
  supabaseUrl: string;
  supabaseKey: string;
  supabaseServiceRoleKey: string;
  supabaseAnonKey: string;
  jwtSecret: string;
  resendApiKey: string;
  isSupabaseConfigured(): boolean;
  isResendConfigured(): boolean;
}

export const config: AppConfig = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  supabaseUrl: process.env.SUPABASE_URL || '',
  supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '',
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY || '',
  jwtSecret: process.env.JWT_SECRET || 'educonnect_dev_secret_key_2026',
  resendApiKey: process.env.RESEND_API_KEY || '',

  isSupabaseConfigured(): boolean {
    return Boolean(
      this.supabaseUrl &&
      this.supabaseKey &&
      !this.supabaseUrl.includes('your-project') &&
      !this.supabaseUrl.includes('placeholder')
    );
  },

  isResendConfigured(): boolean {
    return Boolean(
      this.resendApiKey &&
      this.resendApiKey.startsWith('re_')
    );
  },
};
