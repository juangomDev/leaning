import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../../domain/shared/errors/DomainError.js';
import { supabase } from '../../../infrastructure/database/supabase/client.js';

export interface AuthenticatedUser {
  id: string;
  role: string;
  email?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // For development/demo convenience: allow a simulated user if header provided
      const demoUserId = req.headers['x-demo-user-id'] as string;
      if (demoUserId) {
        req.user = {
          id: demoUserId,
          role: (req.headers['x-demo-role'] as string) || 'student',
        };
        return next();
      }
      throw new UnauthorizedError('Token de autorización no proporcionado');
    }

    const token = authHeader.split(' ')[1];

    // Mock token support
    if (token.startsWith('mock-jwt-token-')) {
      const userId = token.replace('mock-jwt-token-', '');
      req.user = {
        id: userId,
        role: userId.includes('tutor') ? 'tutor' : 'student',
      };
      return next();
    }

    // Supabase token verification
    if (supabase) {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (error || !user) {
        throw new UnauthorizedError('Token inválido o expirado');
      }
      req.user = {
        id: user.id,
        email: user.email,
        role: (user.user_metadata?.role as string) || 'student',
      };
      return next();
    }

    // Fallback
    req.user = { id: 'student-demo-id', role: 'student' };
    next();
  } catch (err) {
    next(err);
  }
};
