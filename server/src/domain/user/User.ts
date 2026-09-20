import { ValidationError } from '../shared/errors/DomainError.js';
import { Email } from './value-objects/Email.js';
import { Phone } from './value-objects/Phone.js';
import { type UserProps, type UserRole, VALID_ROLES } from './UserProps.js';

export { VALID_ROLES };
export type { UserRole };

export class User {
  public id: string;
  private _email: Email;
  public fullName: string;
  private _roles: Set<UserRole>;
  public avatarUrl: string | null;
  private _phone: Phone | null;
  public readonly createdAt: Date;
  private _isEmailVerified: boolean;
  private _onboardingCompleted: boolean;

  constructor({
    id,
    email,
    fullName,
    roles,
    avatarUrl,
    phone,
    createdAt,
    isEmailVerified = false,
    onboardingCompleted = false,
  }: UserProps) {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new ValidationError('El id del usuario es requerido');
    }
    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
      throw new ValidationError('El nombre completo es requerido');
    }
    const emailVO = email instanceof Email ? email : Email.create(email);
    if (avatarUrl === undefined) {
      throw new ValidationError('El campo avatarUrl es requerido (puede ser null)');
    }
    if (phone === undefined) {
      throw new ValidationError('El campo phone es requerido (puede ser null)');
    }
    const phoneVO = phone instanceof Phone ? phone : Phone.create(phone);
    if (!createdAt || !(createdAt instanceof Date) || isNaN(createdAt.getTime())) {
      throw new ValidationError('La fecha de creación createdAt es requerida y debe ser válida');
    }

    if (!roles || !Array.isArray(roles) || roles.length === 0) {
      throw new ValidationError('El usuario debe tener al menos un rol especificado en roles');
    }

    this.id = id.trim();
    this._email = emailVO;
    this.fullName = fullName.trim();
    this.avatarUrl = avatarUrl;
    this._phone = phoneVO;
    this.createdAt = createdAt;
    this._isEmailVerified = Boolean(isEmailVerified);
    this._onboardingCompleted = Boolean(onboardingCompleted);

    this._roles = new Set<UserRole>();
    for (const r of roles) {
      this.validateRole(r);
      this._roles.add(r);
    }
  }

  public get email(): string {
    return this._email.value;
  }

  public get emailVO(): Email {
    return this._email;
  }

  public get phone(): string | null {
    return this._phone ? this._phone.value : null;
  }

  public get phoneVO(): Phone | null {
    return this._phone;
  }

  public get roles(): UserRole[] {
    return Array.from(this._roles);
  }

  public get role(): UserRole {
    if (this._roles.has('admin')) return 'admin';
    if (this._roles.has('tutor')) return 'tutor';
    return 'student';
  }

  public addRole(role: UserRole): void {
    this.validateRole(role);
    this._roles.add(role);
  }

  public removeRole(role: UserRole): void {
    this.validateRole(role);
    if (this._roles.size <= 1 && this._roles.has(role)) {
      throw new ValidationError('No se puede eliminar el único rol del usuario. Debe tener al menos uno.');
    }
    this._roles.delete(role);
  }

  public hasRole(role: UserRole): boolean {
    return this._roles.has(role);
  }

  public isTutor(): boolean {
    return this._roles.has('tutor');
  }

  public isStudent(): boolean {
    return this._roles.has('student');
  }

  public isAdmin(): boolean {
    return this._roles.has('admin');
  }

  public get isEmailVerified(): boolean {
    return this._isEmailVerified;
  }

  public get onboardingCompleted(): boolean {
    return this._onboardingCompleted;
  }

  public markEmailAsVerified(): void {
    this._isEmailVerified = true;
  }

  public completeOnboarding(): void {
    this._onboardingCompleted = true;
  }

  private validateRole(role: string): void {
    if (!VALID_ROLES.includes(role as UserRole)) {
      throw new ValidationError(`Rol inválido: "${role}". Los roles válidos son: ${VALID_ROLES.join(', ')}`);
    }
  }
}
