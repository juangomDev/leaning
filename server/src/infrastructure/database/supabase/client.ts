import { SupabaseClient } from '@supabase/supabase-js';
import { supabase, supabaseAdmin } from '../../config/supabase.config.js';

export interface ProfileRow {
  id: string;
  full_name: string;
  email?: string;
  role?: string;
  roles?: string[];
  avatar_url: string | null;
  phone: string | null;
  created_at: string;
}

export interface StudentRow {
  id: string;
  user_id: string;
  education_level: string;
  learning_goals: string;
  created_at: string;
  updated_at: string;
}

export interface TutorRow {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string;
  bio: string;
  modality: string;
  rating: number;
  reviews_count: number;
  badges: string[];
  is_available: boolean;
  created_at: string;
}

export interface TutorSubjectRow {
  id: string;
  tutor_id: string;
  subject_name: string;
  category: string;
  price_per_hour: number;
  description: string;
  is_active: boolean;
  created_at: string;
}

export interface BookingRow {
  id: string;
  student_id: string;
  tutor_id: string;
  tutor_subject_id?: string;
  subject: string;
  scheduled_at: string;
  duration_hours: number;
  modality: string;
  status: string;
  hourly_rate?: number;
  total_price: number;
  notes: string | null;
  created_at: string;
}

export interface ReviewRow {
  id: string;
  booking_id: string;
  student_id: string;
  tutor_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export interface WalletRow {
  id: string;
  user_id: string;
  balance: number;
  currency: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface WalletTransactionRow {
  id: string;
  wallet_id: string;
  user_id: string;
  booking_id: string | null;
  amount: number;
  type: string;
  concept: string;
  status: string;
  created_at: string;
}

// Cliente principal para repositorios del servidor: utiliza privilegios administrativos
// (service_role) para no ser bloqueado por las políticas Row Level Security (RLS).
export const dbClient: SupabaseClient | null = supabaseAdmin || supabase;

export { supabase, supabaseAdmin };
export type { SupabaseClient };
