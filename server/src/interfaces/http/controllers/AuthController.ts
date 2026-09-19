import { Response, NextFunction } from 'express';
import {
  RegisterUserUseCase,
  LoginUserUseCase,
  GetCurrentUserUseCase,
} from '../../../application/auth/index.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

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
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id || 'student-demo-id';
      const user = await this.getCurrentUserUseCase.execute(userId);
      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      next(err);
    }
  };
}
