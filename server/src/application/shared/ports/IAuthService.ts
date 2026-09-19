export interface TokenPayload {
  id: string;
  email: string;
  role?: string;
  roles?: string[];
}

export interface IAuthService {
  hashPassword(password: string): Promise<string>;
  comparePassword(plain: string, hashed: string): Promise<boolean>;
  generateToken(payload: TokenPayload): string;
  verifyToken(token: string): TokenPayload;
}
