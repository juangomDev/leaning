import { ValidationError } from '../errors/DomainError.js';

export type UserRole = 'student' | 'tutor' | 'admin';

export interface UserProps {
  id: string;
  email: string;
  fullName: string;
  role?: UserRole;
  avatarUrl?: string | null;
  phone?: string | null;
  createdAt?: Date;
}

export class User {
  public id: string;
  public email: string;
  public fullName: string;
  public role: UserRole;
  public avatarUrl: string | null;
  public phone: string | null;
  public createdAt: Date;

  constructor({
    id,
    email,
    fullName,
    role = 'student',
    avatarUrl = null,
    phone = null,
    createdAt = new Date(),
  }: UserProps) {
    this.validateEmail(email);
    this.validateRole(role);

    this.id = id;
    this.email = email;
    this.fullName = fullName;
    this.role = role;
    this.avatarUrl = avatarUrl;
    this.phone = phone;
    this.createdAt = createdAt;
  }

  private validateEmail(email: string): void {
    if (!email || !email.includes('@')) {
      throw new ValidationError('El correo electrónico no es válido');
    }
  }

  private validateRole(role: string): void {
    const validRoles: UserRole[] = ['student', 'tutor', 'admin'];
    if (!validRoles.includes(role as UserRole)) {
      throw new ValidationError(`Rol inválido: ${role}. Debe ser 'student' o 'tutor'`);
    }
  }

  public isTutor(): boolean {
    return this.role === 'tutor';
  }

  public isStudent(): boolean {
    return this.role === 'student';
  }
}
