import { Response, NextFunction } from 'express';
import {
  RegisterUserUseCase,
  LoginUserUseCase,
  GetCurrentUserUseCase,
} from '../../../application/auth/index.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import { config } from '../../../infrastructure/config/env.js';

export class AuthController {
  private registerUserUseCase: RegisterUserUseCase;
  private loginUserUseCase: LoginUserUseCase;
  private getCurrentUserUseCase: GetCurrentUserUseCase;

  constructor({
    registerUserUseCase,
    loginUserUseCase,
    getCurrentUserUseCase,
  }: {
    registerUserUseCase: RegisterUserUseCase;
    loginUserUseCase: LoginUserUseCase;
    getCurrentUserUseCase: GetCurrentUserUseCase;
  }) {
    this.registerUserUseCase = registerUserUseCase;
    this.loginUserUseCase = loginUserUseCase;
    this.getCurrentUserUseCase = getCurrentUserUseCase;
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
}

