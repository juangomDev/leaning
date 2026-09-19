import { describe, it } from 'node:test';
import assert from 'node:assert';
import { InMemoryUserRepository } from './InMemoryUserRepository.js';
import { InMemoryStudentRepository } from './InMemoryStudentRepository.js';
import { InMemoryTutorRepository } from './InMemoryTutorRepository.js';
import { InMemoryBookingRepository } from './InMemoryBookingRepository.js';
import { InMemoryReviewRepository } from './InMemoryReviewRepository.js';
import { InMemoryWalletRepository } from './InMemoryWalletRepository.js';

import { UserFactory } from '../../../domain/user/UserFactory.js';
import { StudentFactory } from '../../../domain/student/StudentFactory.js';
import { TutorFactory } from '../../../domain/tutor/TutorFactory.js';
import { BookingFactory } from '../../../domain/booking/BookingFactory.js';
import { ReviewFactory } from '../../../domain/review/ReviewFactory.js';
import { WalletFactory } from '../../../domain/wallet/WalletFactory.js';
import { WalletTransaction } from '../../../domain/wallet/WalletTransaction.js';

describe('Infrastructure: InMemory Repositories', () => {
  it('InMemoryUserRepository: almacena y recupera usuarios por id y email', async () => {
    const repo = new InMemoryUserRepository();
    const user = UserFactory.create({
      fullName: 'Carlos Fuentes',
      email: 'carlos@test.com',
      role: 'student',
    });

    await repo.create(user);

    const foundById = await repo.findById(user.id);
    assert.ok(foundById);
    assert.strictEqual(foundById?.email, 'carlos@test.com');

    const foundByEmail = await repo.findByEmail('carlos@test.com');
    assert.ok(foundByEmail);
    assert.strictEqual(foundByEmail?.id, user.id);

    const notFound = await repo.findById('non-existent');
    assert.strictEqual(notFound, null);
  });

  it('InMemoryStudentRepository: guarda y consulta perfiles de estudiante', async () => {
    const repo = new InMemoryStudentRepository();
    const student = StudentFactory.create({
      userId: 'user-stu-1',
      educationLevel: 'universitario',
      learningGoals: 'Aprender arquitectura de software',
    });

    await repo.create(student);

    const foundByUserId = await repo.findByUserId('user-stu-1');
    assert.ok(foundByUserId);
    assert.strictEqual(foundByUserId?.learningGoals, 'Aprender arquitectura de software');

    await repo.update(student.id, {
      learningGoals: 'Preparar tesis de grado',
      educationLevel: 'postgrado',
    });

    const updated = await repo.findById(student.id);
    assert.strictEqual(updated?.learningGoals, 'Preparar tesis de grado');
    assert.strictEqual(updated?.educationLevel, 'postgrado');
  });

  it('InMemoryTutorRepository: gestiona tutores y aplica filtros de materias y disponibilidad', async () => {
    const repo = new InMemoryTutorRepository();
    const tutor = TutorFactory.create({
      userId: 'user-tut-1',
      fullName: 'Dra. María Lopez',
      bio: 'Especialista en IA y Álgebra',
      subjectName: 'Matemáticas',
      pricePerHour: 35,
      modality: 'online',
    });

    await repo.create(tutor);

    const found = await repo.findById(tutor.id);
    assert.ok(found);
    assert.strictEqual(found?.subjects.length, 1);

    const filtered = await repo.findAll({ query: 'Matemáticas' });
    assert.ok(filtered.some((t) => t.id === tutor.id));

    const notMatching = await repo.findAll({ query: 'Química Inexistente' });
    assert.strictEqual(notMatching.length, 0);
  });

  it('InMemoryBookingRepository: guarda y actualiza estados de reservas', async () => {
    const repo = new InMemoryBookingRepository();
    const booking = BookingFactory.create({
      studentId: 'stu-100',
      tutorId: 'tut-200',
      tutorSubjectId: 'sub-300',
      subject: 'Química Orgánica',
      scheduledAt: new Date('2026-06-15T10:00:00.000Z'),
      durationHours: 1,
      hourlyRate: 40,
    });

    await repo.create(booking);

    const found = await repo.findById(booking.id);
    assert.ok(found);
    assert.strictEqual(found?.status, 'pending');

    await repo.updateStatus(booking.id, 'confirmed');

    const updated = await repo.findById(booking.id);
    assert.strictEqual(updated?.status, 'confirmed');

    const studentBookings = await repo.findByStudentId('stu-100');
    assert.strictEqual(studentBookings.length, 1);
  });

  it('InMemoryReviewRepository: registra y recupera reseñas por tutorId', async () => {
    const repo = new InMemoryReviewRepository();
    const booking = BookingFactory.create({
      studentId: 'stu-rev-1',
      tutorId: 'tut-rev-1',
      tutorSubjectId: 'sub-rev-1',
      subject: 'Álgebra',
      scheduledAt: new Date('2026-05-01T10:00:00.000Z'),
      durationHours: 1,
      hourlyRate: 25,
    });
    booking.confirm();
    booking.complete();

    const review = ReviewFactory.createFromCompletedBooking(booking, {
      rating: 5,
      comment: 'Excelente explicación y paciencia.',
    });

    await repo.create(review);

    const tutorReviews = await repo.findByTutorId('tut-rev-1');
    assert.strictEqual(tutorReviews.length, 1);
    assert.strictEqual(tutorReviews[0].rating, 5);
    assert.strictEqual(tutorReviews[0].comment, 'Excelente explicación y paciencia.');
  });

  it('InMemoryWalletRepository: gestiona balances, billeteras y transacciones', async () => {
    const repo = new InMemoryWalletRepository();
    const wallet = WalletFactory.create({
      userId: 'user-wal-1',
      currency: 'USD',
      initialBalance: 100,
    });

    await repo.saveWallet(wallet);

    const foundWallet = await repo.findByUserId('user-wal-1');
    assert.ok(foundWallet);
    assert.strictEqual(foundWallet?.balance, 100);

    const tx = new WalletTransaction({
      id: 'tx-1',
      walletId: wallet.id,
      userId: wallet.userId,
      bookingId: null,
      amount: 50,
      type: 'recharge',
      concept: 'Recarga promocional',
      status: 'completed',
      createdAt: new Date(),
    });

    await repo.addTransaction(tx);
    const transactions = await repo.getTransactions('user-wal-1');
    assert.strictEqual(transactions.length, 1);
    assert.strictEqual(transactions[0].amount, 50);
  });
});
