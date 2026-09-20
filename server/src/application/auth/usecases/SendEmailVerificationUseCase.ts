import crypto from 'node:crypto';
import { IUserRepository } from '../ports/IUserRepository.js';
import { INotificationService } from '../../shared/ports/INotificationService.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';

export interface SendEmailVerificationInput {
  emailOrUserId: string;
}

export interface SendEmailVerificationOutput {
  success: boolean;
  message: string;
}

export interface SendEmailVerificationDeps {
  userRepository: IUserRepository;
  notificationService: INotificationService;
}

export class SendEmailVerificationUseCase implements IUseCase<SendEmailVerificationInput, SendEmailVerificationOutput> {
  private readonly userRepository: IUserRepository;
  private readonly notificationService: INotificationService;

  constructor({ userRepository, notificationService }: SendEmailVerificationDeps) {
    this.userRepository = userRepository;
    this.notificationService = notificationService;
  }

  async execute({ emailOrUserId }: SendEmailVerificationInput): Promise<SendEmailVerificationOutput> {
    if (!emailOrUserId || typeof emailOrUserId !== 'string') {
      return { success: true, message: 'Si la cuenta existe, se ha enviado un correo de verificación.' };
    }

    const query = emailOrUserId.trim();
    let user = query.includes('@')
      ? await this.userRepository.findByEmail(query)
      : await this.userRepository.findById(query);

    if (!user) {
      return { success: true, message: 'Si la cuenta existe, se ha enviado un correo de verificación.' };
    }

    if (user.isEmailVerified) {
      return { success: true, message: 'Tu correo electrónico ya se encuentra verificado.' };
    }

    const token = crypto.randomBytes(24).toString('hex');
    await this.userRepository.saveEmailVerificationToken(user.id, token);
    await this.notificationService.sendEmailVerification(user.email, token, user.fullName);

    return {
      success: true,
      message: 'Se ha enviado un enlace de verificación a tu correo electrónico.',
    };
  }
}
