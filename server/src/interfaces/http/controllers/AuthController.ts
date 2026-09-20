import { Response, NextFunction } from 'express';
import {
  RegisterUserUseCase,
  LoginUserUseCase,
  GetCurrentUserUseCase,
  RequestPasswordResetUseCase,
  ResetPasswordUseCase,
  SendEmailVerificationUseCase,
  VerifyEmailUseCase,
  CompleteOnboardingUseCase,
} from '../../../application/auth/index.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import { config } from '../../../infrastructure/config/env.js';

export class AuthController {
  private registerUserUseCase: RegisterUserUseCase;
  private loginUserUseCase: LoginUserUseCase;
  private getCurrentUserUseCase: GetCurrentUserUseCase;
  private requestPasswordResetUseCase: RequestPasswordResetUseCase;
  private resetPasswordUseCase: ResetPasswordUseCase;
  private sendEmailVerificationUseCase: SendEmailVerificationUseCase;
  private verifyEmailUseCase: VerifyEmailUseCase;
  private completeOnboardingUseCase: CompleteOnboardingUseCase;

  constructor({
    registerUserUseCase,
    loginUserUseCase,
    getCurrentUserUseCase,
    requestPasswordResetUseCase,
    resetPasswordUseCase,
    sendEmailVerificationUseCase,
    verifyEmailUseCase,
    completeOnboardingUseCase,
  }: {
    registerUserUseCase: RegisterUserUseCase;
    loginUserUseCase: LoginUserUseCase;
    getCurrentUserUseCase: GetCurrentUserUseCase;
    requestPasswordResetUseCase: RequestPasswordResetUseCase;
    resetPasswordUseCase: ResetPasswordUseCase;
    sendEmailVerificationUseCase: SendEmailVerificationUseCase;
    verifyEmailUseCase: VerifyEmailUseCase;
    completeOnboardingUseCase: CompleteOnboardingUseCase;
  }) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
    this.getCurrentUserUseCase = getCurrentUserUseCase;
    this.requestPasswordResetUseCase = requestPasswordResetUseCase;
    this.resetPasswordUseCase = resetPasswordUseCase;
    this.sendEmailVerificationUseCase = sendEmailVerificationUseCase;
    this.verifyEmailUseCase = verifyEmailUseCase;
    this.completeOnboardingUseCase = completeOnboardingUseCase;
  }

  register = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password, fullName, role, phone } = req.body;
      const user = await this.registerUserUseCase.execute({ email, password, fullName, role, phone });
      res.status(201).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  };

  login = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.loginUserUseCase.execute({ email, password });

      const isProduction = config.nodeEnv === 'production';

      // Almacenar el token en una Cookie HttpOnly segura contra ataques XSS
      if (result.token) {
        res.cookie('auth_token', result.token, {
          httpOnly: true,
          secure: isProduction,
          sameSite: isProduction ? 'strict' : 'lax',
          maxAge: 1 * 24 * 60 * 60 * 1000, // 1 día
          path: '/',
        });
      }

      // No exponer el token en el cuerpo de la respuesta JSON
      res.status(200).json({
        success: true,
        data: {
          user: result.user,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  logout = async (_req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const isProduction = config.nodeEnv === 'production';
      res.clearCookie('auth_token', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'strict' : 'lax',
        path: '/',
      });

      res.status(200).json({
        success: true,
        message: 'Sesión cerrada exitosamente',
      });
    } catch (err) {
      next(err);
    }
  };

  getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id || 'student-demo-id';
      const email = req.user?.email;
      const role = req.user?.role;
      const user = await this.getCurrentUserUseCase.execute({ userId, email, role });
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  };

  forgotPassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { email } = req.body;
      const result = await this.requestPasswordResetUseCase.execute({ email });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  resetPassword = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { token, newPassword } = req.body;
      const result = await this.resetPasswordUseCase.execute({ token, newPassword });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  verifyEmail = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const token = (req.body?.token || req.query?.token) as string;
      const result = await this.verifyEmailUseCase.execute({ token });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  resendVerification = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const emailOrUserId = req.body?.email || req.user?.id;
      const result = await this.sendEmailVerificationUseCase.execute({ emailOrUserId });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };

  onboarding = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id || 'student-demo-id';
      const result = await this.completeOnboardingUseCase.execute({
        userId,
        ...req.body,
      });
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  };
}

