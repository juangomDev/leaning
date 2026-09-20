import { IUserRepository } from '../ports/IUserRepository.js';
import { IAuthService } from '../../shared/ports/IAuthService.js';
import { IClock, SystemClock } from '../../shared/ports/IClock.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { ValidationError } from '../../../domain/shared/errors/DomainError.js';
import { UnauthorizedError } from '../../shared/errors/UnauthorizedError.js';

export interface ResetPasswordInput {
  token: string;
  newPassword: string;
}

export interface ResetPasswordOutput {
  success: boolean;
  message: string;
}

export interface ResetPasswordDeps {
  userRepository: IUserRepository;
  authService: IAuthService;
  clock?: IClock;
}

export class ResetPasswordUseCase implements IUseCase<ResetPasswordInput, ResetPasswordOutput> {
  private readonly userRepository: IUserRepository;
  private readonly authService: IAuthService;
  private readonly clock: IClock;

  constructor({ userRepository, authService, clock = new SystemClock() }: ResetPasswordDeps) {
    this.userRepository = userRepository;
    this.authService = authService;
    this.clock = clock;
  }

  async execute({ token, newPassword }: ResetPasswordInput): Promise<ResetPasswordOutput> {
    if (!token || typeof token !== 'string' || token.trim() === '') {
      throw new ValidationError('El token de restablecimiento es requerido');
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      throw new ValidationError('La nueva contraseña debe tener al menos 6 caracteres');
    }

    const resetRecord = await this.userRepository.findByPasswordResetToken(token.trim());

    if (!resetRecord) {
      throw new UnauthorizedError('El enlace de restablecimiento es inválido o no existe');
    }

    const { user, expiresAt } = resetRecord;

    if (this.clock.now() > expiresAt) {
      await this.userRepository.clearPasswordResetToken(user.id);
      throw new UnauthorizedError('El enlace de restablecimiento ha expirado. Por favor solicita uno nuevo.');
    }

    const hashedPassword = await this.authService.hashPassword(newPassword);
    await this.userRepository.updatePassword(user.id, hashedPassword);
    await this.userRepository.clearPasswordResetToken(user.id);

    return {
      success: true,
      message: 'Tu contraseña ha sido restablecida exitosamente. Ya puedes iniciar sesión con tu nueva clave.',
    };
  }
}
