import crypto from 'node:crypto';
import { IUserRepository } from '../ports/IUserRepository.js';
import { INotificationService } from '../../shared/ports/INotificationService.js';
import { IClock, SystemClock } from '../../shared/ports/IClock.js';
import { IUseCase } from '../../shared/IUseCase.js';

export interface RequestPasswordResetInput {
  email: string;
}

export interface RequestPasswordResetOutput {
  success: boolean;
  message: string;
}

export interface RequestPasswordResetDeps {
  userRepository: IUserRepository;
  notificationService: INotificationService;
  clock?: IClock;
}

export class RequestPasswordResetUseCase implements IUseCase<RequestPasswordResetInput, RequestPasswordResetOutput> {
  private readonly userRepository: IUserRepository;
  private readonly notificationService: INotificationService;
  private readonly clock: IClock;

  constructor({ userRepository, notificationService, clock = new SystemClock() }: RequestPasswordResetDeps) {
    this.userRepository = userRepository;
    this.notificationService = notificationService;
    this.clock = clock;
  }

  async execute({ email }: RequestPasswordResetInput): Promise<RequestPasswordResetOutput> {
    const genericMessage = 'Si el correo electrónico está registrado, recibirás un enlace para restablecer tu contraseña.';

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return { success: true, message: genericMessage };
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await this.userRepository.findByEmail(normalizedEmail);

    if (!user) {
      // Seguridad: no revelar si el correo existe o no en la base de datos
      return { success: true, message: genericMessage };
    }

    // Generar token criptográfico seguro y expiración en 1 hora
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(this.clock.now().getTime() + 60 * 60 * 1000);

    await this.userRepository.savePasswordResetToken(user.id, token, expiresAt);
    await this.notificationService.sendPasswordReset(user.email, token, user.fullName);

    return {
      success: true,
      message: genericMessage,
    };
  }
}
