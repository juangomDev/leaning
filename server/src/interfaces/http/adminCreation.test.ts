import { test, describe } from 'node:test';
import assert from 'node:assert';
import { UserFactory } from '../../domain/user/UserFactory.js';
import { TutorFactory } from '../../domain/tutor/TutorFactory.js';
import { SupabaseAuthService } from '../../infrastructure/auth/SupabaseAuthService.js';
import { AdminController } from './controllers/AdminController.js';
import { ApproveTutorUseCase } from '../../application/admin/usecases/ApproveTutorUseCase.js';
import { BanUserUseCase } from '../../application/admin/usecases/BanUserUseCase.js';
import { ModerateReviewUseCase } from '../../application/admin/usecases/ModerateReviewUseCase.js';
import { ITutorRepository } from '../../domain/tutor/TutorRepository.js';
import { IUserRepository } from '../../domain/user/UserRepository.js';
import { IReviewRepository } from '../../domain/review/ReviewRepository.js';
import { Tutor } from '../../domain/tutor/Tutor.js';
import { User } from '../../domain/user/User.js';
import { Review } from '../../domain/review/Review.js';

class MockTutorRepo implements ITutorRepository {
  public tutors = new Map<string, Tutor>();
  async findById(id: string) { return this.tutors.get(id) || null; }
  async findAll() { return Array.from(this.tutors.values()); }
  async create(t: Tutor) { this.tutors.set(t.id, t); return t; }
  async update(id: string, t: Tutor) { this.tutors.set(id, t); return t; }
}

class MockUserRepo implements IUserRepository {
  public users = new Map<string, User>();
  async findById(id: string) { return this.users.get(id) || null; }
  async findByEmail(email: string) {
    return Array.from(this.users.values()).find(u => u.email === email) || null;
  }
  async create(user: User) { this.users.set(user.id, user); return user; }
  async update(id: string, updates: Partial<User>) {
    const user = this.users.get(id);
    if (!user) throw new Error('User not found');
    return user;
  }
  async savePasswordResetToken() {}
  async findByPasswordResetToken() { return null; }
  async clearPasswordResetToken() {}
  async updatePassword() {}
  async saveEmailVerificationToken() {}
  async findByEmailVerificationToken() { return null; }
  async clearEmailVerificationToken() {}
}

class MockReviewRepo implements IReviewRepository {
  public reviews = new Map<string, Review>();
  async findById(id: string) { return this.reviews.get(id) || null; }
  async findByBookingId(id: string) { return null; }
  async findByTutorId(id: string) { return []; }
  async create(r: Review) { this.reviews.set(r.id, r); return r; }
  async update(id: string, r: Review) { this.reviews.set(id, r); return r; }
  async delete(id: string) { this.reviews.delete(id); }
}

describe('👑 Admin Creation & Authorization Suite', () => {
  const tutorRepo = new MockTutorRepo();
  const userRepo = new MockUserRepo();
  const reviewRepo = new MockReviewRepo();

  const approveTutorUseCase = new ApproveTutorUseCase({ tutorRepository: tutorRepo });
  const banUserUseCase = new BanUserUseCase({ userRepository: userRepo });
  const moderateReviewUseCase = new ModerateReviewUseCase({ reviewRepository: reviewRepo });

  const adminController = new AdminController({
    approveTutorUseCase,
    banUserUseCase,
    moderateReviewUseCase,
  });

  const authService = new SupabaseAuthService('test_jwt_secret_key_admin_suite');

  test('debe modelar correctamente una entidad de Usuario Administrador con privilegios', () => {
    const adminUser = UserFactory.reconstitute({
      id: 'usr-admin-001',
      email: 'admin@educonnect.com',
      fullName: 'Administrador General',
      roles: ['admin', 'student'],
      phone: '+1 555-0999',
      createdAt: new Date(),
    });

    assert.strictEqual(adminUser.role, 'admin');
    assert.strictEqual(adminUser.isAdmin(), true);
    assert.strictEqual(adminUser.hasRole('admin'), true);
  });

  test('debe emitir y verificar un token JWT válido con rol de admin', () => {
    const token = authService.generateToken({
      id: 'usr-admin-001',
      email: 'admin@educonnect.com',
      role: 'admin',
      roles: ['admin', 'student'],
    });

    assert.ok(token);
    const verified = authService.verifyToken(token);
    assert.strictEqual(verified.id, 'usr-admin-001');
    assert.strictEqual(verified.email, 'admin@educonnect.com');
    assert.strictEqual(verified.role, 'admin');
  });

  test('debe rechazar llamadas administrativas si el usuario tiene rol de estudiante', async () => {
    const studentReq: any = {
      user: { id: 'std-1', role: 'student' },
      params: { id: 'tut-1' },
    };
    const res: any = { status: () => res, json: () => {} };

    let passedError: any = null;
    await adminController.approveTutor(studentReq, res, (err: any) => {
      passedError = err;
    });

    assert.ok(passedError);
    assert.match(passedError.message, /Acceso denegado: se requieren permisos de administrador/i);
  });

  test('debe permitir llamadas a AdminController cuando req.user.role === admin', async () => {
    const tutor = TutorFactory.create({
      id: 'tut-test-1',
      userId: 'usr-tutor-1',
      fullName: 'Tutor Test',
      subjectName: 'Matemáticas',
      subjectCategory: 'matematicas',
      bio: 'Bio prueba',
      pricePerHour: 30,
      modality: 'online',
    });
    await tutorRepo.create(tutor);

    let responseStatusCode = 0;
    let responseData: any = null;

    const adminReq: any = {
      user: { id: 'usr-admin-001', role: 'admin' },
      params: { id: 'tut-test-1' },
      body: {},
    };

    const res: any = {
      status(code: number) {
        responseStatusCode = code;
        return this;
      },
      json(data: any) {
        responseData = data;
        return this;
      },
    };

    await adminController.approveTutor(adminReq, res, (err) => {
      if (err) throw err;
    });

    assert.strictEqual(responseStatusCode, 200);
    assert.strictEqual(responseData.success, true);
    assert.strictEqual(responseData.data.success, true);
    assert.match(responseData.data.message, /aprobado con éxito/i);

    const updatedTutor = await tutorRepo.findById('tut-test-1');
    assert.ok(updatedTutor?.badges.includes('Verificado'));
  });
});
