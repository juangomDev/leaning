import { IUserRepository } from '../../../../domain/user/UserRepository.js';
import { User } from '../../../../domain/user/User.js';
import { dbClient as supabase, supabaseAdmin } from '../client.js';
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

    let userId = user.id;
    if (supabaseAdmin?.auth?.admin) {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: user.email,
        password: password || 'DefaultPass123!',
        email_confirm: true,
        user_metadata: {
          full_name: user.fullName,
          role: user.role,
          phone: user.phone,
        },
      });

      if (error) {
        throw new Error(error.message);
      }
      if (data?.user) {
        userId = data.user.id;
      }
    } else {
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
      userId = data.user?.id || user.id;
    }

    user.id = userId;

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

  async savePasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    if (!supabase) return;
    await supabase.from('profiles').update({
      reset_token: token,
      reset_expires: expiresAt.toISOString(),
    }).eq('id', userId);
  }

  async findByPasswordResetToken(token: string): Promise<{ user: User; expiresAt: Date } | null> {
    if (!supabase) return null;
    const { data } = await supabase.from('profiles').select('*').eq('reset_token', token).maybeSingle();
    if (!data || !data.reset_expires) return null;
    return {
      user: UserMapper.toDomain(data),
      expiresAt: new Date(data.reset_expires),
    };
  }

  async clearPasswordResetToken(userId: string): Promise<void> {
    if (!supabase) return;
    await supabase.from('profiles').update({
      reset_token: null,
      reset_expires: null,
    }).eq('id', userId);
  }

  async updatePassword(_userId: string, _newHashedPassword: string): Promise<void> {
    // Supabase auth handles its own passwords via auth API
  }

  async saveEmailVerificationToken(userId: string, token: string): Promise<void> {
    if (!supabase) return;
    await supabase.from('profiles').update({
      verification_token: token,
    }).eq('id', userId);
  }

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    if (!supabase) return null;
    const { data } = await supabase.from('profiles').select('*').eq('verification_token', token).maybeSingle();
    return data ? UserMapper.toDomain(data) : null;
  }

  async clearEmailVerificationToken(userId: string): Promise<void> {
    if (!supabase) return;
    await supabase.from('profiles').update({
      verification_token: null,
    }).eq('id', userId);
  }
}

