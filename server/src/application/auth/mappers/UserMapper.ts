import { User } from '../../../domain/user/User.js';
import { UserResponseDTO } from '../dtos/index.js';

export class UserMapper {
  public static toDTO(user: User): UserResponseDTO {
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      roles: [...user.roles],
      avatarUrl: user.avatarUrl,
      phone: user.phone,
      createdAt: user.createdAt.toISOString(),
      isEmailVerified: user.isEmailVerified,
      onboardingCompleted: user.onboardingCompleted,
    };
  }
}
