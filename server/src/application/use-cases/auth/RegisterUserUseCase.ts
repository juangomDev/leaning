import { User, UserRole } from '../../../domain/user/User.js';
import { ConflictError } from '../../../domain/shared/errors/DomainError.js';
import { IUserRepository } from '../../../domain/user/UserRepository.js';
import crypto from 'node:crypto';

export interface RegisterUserDTO {
  email: string;
  password?: string;
  fullName: string;
  role?: UserRole;
  phone?: string | null;
}

export class RegisterUserUseCase {
  private userRepository: IUserRepository;

  constructor({ userRepository }: { userRepository: IUserRepository }) {
    this.userRepository = userRepository;
  }

  async execute({ email, password, fullName, role = 'student', phone = null }: RegisterUserDTO): Promise<User> {
    const existing = await this.userRepository.findByEmail(email);
    if (existing) {
      throw new ConflictError('Ya existe una cuenta con este correo electrónico');
    }

    const user = new User({
      id: crypto.randomUUID(),
      email,
      fullName,
      roles: [role],
      avatarUrl: null,
      phone: phone || null,
      createdAt: new Date(),
    });

    return await this.userRepository.create(user, password);
  }
}
