import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Tutor } from '../../../domain/tutor/Tutor.js';
import { ITutorRepository } from '../../tutor/ports/ITutorRepository.js';
import { User } from '../../../domain/user/User.js';
import { IUserRepository } from '../../auth/ports/IUserRepository.js';
import { Review } from '../../../domain/review/Review.js';
import { IReviewRepository } from '../../review/ports/IReviewRepository.js';
import { ApproveTutorUseCase } from './ApproveTutorUseCase.js';
import { BanUserUseCase } from './BanUserUseCase.js';
import { ModerateReviewUseCase } from './ModerateReviewUseCase.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';

class MockAdminTutorRepo implements ITutorRepository {
  public tutors = new Map<string, Tutor>();
  async findById(id: string) { return this.tutors.get(id) || null; }
  async findAll() { return Array.from(this.tutors.values()); }
  async create(t: Tutor) { this.tutors.set(t.id, t); return t; }
  async update(id: string, t: Tutor) { this.tutors.set(id, t); return t; }
}

class MockAdminUserRepo implements IUserRepository {
  public users = new Map<string, User>();
  async findById(id: string) { return this.users.get(id) || null; }
  async findByEmail() { return null; }
  async create(u: User) { this.users.set(u.id, u); return u; }
  async update(id: string, updates: Partial<User>) {
    const u = this.users.get(id);
    if (!u) throw new Error('Not found');
    Object.assign(u, updates);
    return u;
  }
}

class MockAdminReviewRepo implements IReviewRepository {
  public reviews = new Map<string, Review>();
  async findById(id: string) { return this.reviews.get(id) || null; }
  async findByBookingId() { return null; }
  async findByTutorId() { return []; }
  async create(r: Review) { this.reviews.set(r.id, r); return r; }
}

describe('Admin UseCases', () => {
  it('debe aprobar un tutor asignando insignia y disponibilidad', async () => {
    const repo = new MockAdminTutorRepo();
    const tutor = new Tutor({
      id: 'tut-pending-1',
      userId: 'tut-pending-1',
      fullName: 'Tutor Aspirante',
      avatarUrl: 'http://img.com',
      bio: 'Biología',
      modality: 'online',
      rating: 5,
      reviewsCount: 0,
      badges: [],
      isAvailable: false,
      subjects: [],
      createdAt: new Date(),
    });
    await repo.create(tutor);

    const useCase = new ApproveTutorUseCase({ tutorRepository: repo });
    const result = await useCase.execute({ tutorId: 'tut-pending-1', badge: 'Verificado EduConnect' });

    assert.strictEqual(result.success, true);
    const updated = await repo.findById('tut-pending-1');
    assert.strictEqual(updated?.isAvailable, true);
    assert.ok(updated?.badges.includes('Verificado EduConnect'));
  });

  it('debe suspender a un usuario', async () => {
    const repo = new MockAdminUserRepo();
    const user = new User({
      id: 'usr-spammer',
      email: 'spammer@educonnect.com',
      fullName: 'Bad User',
      roles: ['student'],
      avatarUrl: null,
      phone: null,
      createdAt: new Date(),
    });
    await repo.create(user);

    const useCase = new BanUserUseCase({ userRepository: repo });
    const result = await useCase.execute({ userId: 'usr-spammer', reason: 'Spam masivo' });

    assert.strictEqual(result.success, true);
    assert.ok(result.message.includes('spammer@educonnect.com'));
  });

  it('debe moderar una reseña inadecuada', async () => {
    const repo = new MockAdminReviewRepo();
    const review = new Review({
      id: 'rev-spam',
      bookingId: 'book-1',
      studentId: 'stu-1',
      tutorId: 'tut-1',
      rating: 1,
      comment: 'Comentario inapropiado que viola los términos',
      createdAt: new Date(),
    });
    await repo.create(review);

    const useCase = new ModerateReviewUseCase({ reviewRepository: repo });
    const result = await useCase.execute({
      reviewId: 'rev-spam',
      action: 'hide',
      reason: 'Lenguaje ofensivo',
    });

    assert.strictEqual(result.success, true);
    const updated = await repo.findById('rev-spam');
    assert.ok(updated?.comment.includes('oculto por moderación'));
  });

  it('debe lanzar NotFoundError al intentar moderar tutor inexistente', async () => {
    const repo = new MockAdminTutorRepo();
    const useCase = new ApproveTutorUseCase({ tutorRepository: repo });
    await assert.rejects(async () => {
      await useCase.execute({ tutorId: 'none' });
    }, NotFoundError);
  });
});
