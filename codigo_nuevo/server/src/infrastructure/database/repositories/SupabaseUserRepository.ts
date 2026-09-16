import { IUserRepository, AuthResult } from '../../../domain/repositories/IUserRepository.js';
import { User, UserRole } from '../../../domain/entities/User.js';
import { supabase } from '../supabaseClient.js';

export class SupabaseUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    if (!supabase) return null;

    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error || !data) return null;

    return new User({
      id: data.id,
      email: data.email || 'user@educonnect.com',
      fullName: data.full_name,
      role: data.role as UserRole,
      avatarUrl: data.avatar_url,
      phone: data.phone,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
    });
  }

  async findByEmail(_email: string): Promise<User | null> {
    // In Supabase, email lookup is handled by auth.users
    return null;
  }

  async create(user: User, password?: string): Promise<User> {
    if (!supabase) return user;

    const { data, error } = await supabase.auth.signUp({
      email: user.email,
      password: password || 'DefaultPass123!',
      options: {
        data: {
          full_name: user.fullName,
          role: user.role,
          phone: user.phone,
        },
      },
    });

    if (error) throw new Error(error.message);

    user.id = data.user?.id || user.id;
    return user;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    if (!supabase) {
      const existing = await this.findById(id);
      return existing || (updates as User);
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({
        full_name: updates.fullName,
        avatar_url: updates.avatarUrl,
        phone: updates.phone,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return new User({
      id: data.id,
      email: data.email || 'user@educonnect.com',
      fullName: data.full_name,
      role: data.role as UserRole,
      avatarUrl: data.avatar_url,
      phone: data.phone,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
    });
  }

  async authenticate(email: string, password?: string): Promise<AuthResult> {
    if (!supabase) throw new Error('Supabase client not initialized');

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: password || '',
    });

    if (error) throw new Error(error.message);

    const profile = await this.findById(data.user.id);
    return {
      user:
        profile ||
        new User({
          id: data.user.id,
          email: data.user.email || email,
          fullName: (data.user.user_metadata?.full_name as string) || 'Usuario',
          role: (data.user.user_metadata?.role as UserRole) || 'student',
        }),
      token: data.session?.access_token || '',
    };
  }
}
