import crypto from 'node:crypto';
import { User } from './User.js';
import { Email } from './value-objects/Email.js';
import { Phone } from './value-objects/Phone.js';
import { CreateUserDTO, UserRole } from './UserProps.js';

export class UserFactory {
  public static create({

    id, email, fullName, roles, role, 
    avatarUrl = null, phone = null, createdAt = new Date(),

  }: CreateUserDTO): User {

    const finalRoles: UserRole[] = [];
    
    if (roles && Array.isArray(roles) && roles.length > 0) {
      
      finalRoles.push(...roles);
    
    } else if (role) {
      
      finalRoles.push(role);
      
    } else {

      finalRoles.push('student');

    }

    return new User({
      id: id || crypto.randomUUID(),
      email: Email.create(email),
      fullName,
      roles: finalRoles,
      avatarUrl: avatarUrl || null,
      phone: Phone.create(phone || null),
      createdAt,
    });
  }

  public static reconstitute(raw: {
    id: string;
    email: string;
    fullName: string;
    roles?: UserRole[];
    role?: UserRole;
    avatarUrl?: string | null;
    phone?: string | null;
    createdAt: Date | string;
  }): User {
    const roles = raw.roles && raw.roles.length > 0
      ? raw.roles
      : [raw.role || 'student'];

    return new User({
      id: raw.id,
      email: Email.create(raw.email),
      fullName: raw.fullName,
      roles,
      avatarUrl: raw.avatarUrl || null,
      phone: Phone.create(raw.phone || null),
      createdAt: raw.createdAt instanceof Date ? raw.createdAt : new Date(raw.createdAt),
    });
  }
}
