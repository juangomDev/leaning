import { IUserRepository } from '../ports/IUserRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { UserResponseDTO } from '../dtos/index.js';
import { UserMapper } from '../mappers/UserMapper.js';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.js';
import { ValidationError } from '../../../domain/shared/errors/DomainError.js';

export interface VerifyEmailInput {
  token: string;
}

export interface VerifyEmailOutput {
  success: boolean;
  message: string;
  user?: UserResponseDTO;
}

export interface VerifyEmailDeps {
  userRepository: IUserRepository;
}

export class VerifyEmailUseCase implements IUseCase<VerifyEmailInput, VerifyEmailOutput> {
  private readonly userRepository: IUserRepository;

  constructor({ userRepository }: VerifyEmailDeps) {
    this.userRepository = userRepository;
  }

  async execute({ token }: VerifyEmailInput): Promise<VerifyEmailOutput> {
    if (!token || typeof token !== 'string' || token.trim() === '') {
      throw new ValidationError('El token de verificación es requerido');
    }

    const user = await this.userRepository.findByEmailVerificationToken(token.trim());

    if (!user) {
      throw new UnauthorizedError('El enlace de verificación es inválido o ha expirado');
    }

    user.markEmailAsVerified();
    await this.userRepository.update(user.id, user);
    await this.userRepository.clearEmailVerificationToken(user.id);

    return {
      success: true,
      message: '¡Tu correo electrónico ha sido verificado correctamente!',
      user: UserMapper.toDTO(user),
    };
  }
}
