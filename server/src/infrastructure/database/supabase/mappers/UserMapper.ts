import { User } from '../../../../domain/user/User.js';
import { UserFactory } from '../../../../domain/user/UserFactory.js';
import { ProfileRow } from '../client.js';

export class UserMapper {
  public static toDomain(row: ProfileRow): User {
    const roles = row.roles && row.roles.length > 0
      ? row.roles
      : [row.role as any || 'student'];

    return UserFactory.reconstitute({
      id: row.id,
      email: row.email || 'user@educonnect.com',
      fullName: row.full_name,
      roles: roles as any,
      avatarUrl: row.avatar_url,
      phone: row.phone,
      createdAt: row.created_at,
    });
  }

  public static toRow(user: User): Partial<ProfileRow> {
    return {
      id: user.id,
      full_name: user.fullName,
      email: user.email,
      role: user.role,
      roles: [...user.roles],
      avatar_url: user.avatarUrl,
      phone: user.phone,
    };
  }
}
