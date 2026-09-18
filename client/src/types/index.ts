export type UserRole = 'student' | 'tutor' | string;

export interface UserProfile {
  id: string;
  full_name: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  email?: string;
  created_at?: string;
}

export interface AppUser {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    role?: UserRole;
    phone?: string;
    [key: string]: any;
  };
  profile?: UserProfile;
}

export interface Tutor {
  id: string;
  full_name: string;
  avatar_url: string;
  subject_name: string;
  subject_category: string;
  bio: string;
  price_per_hour: number;
  modality: 'online' | 'presencial' | 'ambas' | string;
  rating: number;
  reviews_count: number;
  badges: string[];
  is_available: boolean;

  // Optional aliases for template flexibility
  name?: string;
  avatar?: string;
  headline?: string;
  subject?: string;
  category?: string;
  hourly_rate?: number;
  price?: number;
  reviews?: number;
}

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | string;

export interface Booking {
  id: string;
  student_id: string;
  student_name?: string;
  student_avatar?: string;
  tutor_id: string;
  tutor_name?: string;
  tutor_avatar?: string;
  subject: string;
  scheduled_at: string;
  duration_hours: number;
  modality: 'online' | 'presencial' | string;
  status: BookingStatus;
  total_price: number;
  notes?: string;
  created_at?: string;
}

export interface CreateBookingInput {
  student_id: string;
  tutor_id: string;
  subject: string;
  scheduled_at: string;
  duration_hours: number;
  modality?: 'online' | 'presencial' | string;
  total_price: number;
  notes?: string;
}

export interface SignUpParams {
  email: string;
  password: string;
  full_name?: string;
  fullName?: string;
  role?: string;
  phone?: string;
}

export interface AuthContextType {
  user: AppUser | any | null;
  profile: UserProfile | null;
  role: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (
    paramsOrEmail: SignUpParams | string,
    maybePassword?: string,
    maybeExtra?: { fullName?: string; full_name?: string; role?: string; phone?: string }
  ) => Promise<any>;
  signOut: () => Promise<void>;
  demoLogin: (role?: string) => void;
  isSupabaseConfigured: boolean;
}
