import { User, UserRole } from '../../../domain/entities/User.js';
import { ConflictError } from '../../../domain/errors/DomainError.js';
import { IUserRepository } from '../../../domain/repositories/IUserRepository.js';
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
      role,
      phone,
    });

    return await this.userRepository.create(user, password);
  }
}
