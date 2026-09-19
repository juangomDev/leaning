import { IUserRepository } from '../../../../domain/user/UserRepository.js';
import { User } from '../../../../domain/user/User.js';
import { supabase } from '../client.js';
import { UserMapper } from '../mappers/UserMapper.js';

export class SupabaseUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    if (!supabase) return null;

    const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
    if (error || !data) return null;

    return UserMapper.toDomain(data);
  }

  async findByEmail(email: string): Promise<User | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .maybeSingle();

    if (error || !data) return null;
    return UserMapper.toDomain(data);
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

    const profileRow = UserMapper.toRow(user);
    await supabase.from('profiles').upsert(profileRow);

    return user;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    if (!supabase) {
      const existing = await this.findById(id);
      return existing || (updates as User);
    }

    const payload: any = {};
    if (updates.fullName !== undefined) payload.full_name = updates.fullName;
    if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
    if (updates.phone !== undefined) payload.phone = updates.phone;

    const { data, error } = await supabase
      .from('profiles')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return UserMapper.toDomain(data);
  }
}

