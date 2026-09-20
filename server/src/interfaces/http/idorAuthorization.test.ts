import { test, describe } from 'node:test';
import assert from 'node:assert';
import { UpdateBookingStatusUseCase } from '../../application/booking/usecases/UpdateBookingStatusUseCase.js';
import { UpdateStudentProfileUseCase } from '../../application/student/usecases/UpdateStudentProfileUseCase.js';
import { RegisterTutorUseCase } from '../../application/tutor/usecases/RegisterTutorUseCase.js';
import { RechargeWalletUseCase } from '../../application/wallet/usecases/RechargeWalletUseCase.js';
import { BookingFactory } from '../../domain/booking/BookingFactory.js';
import { StudentFactory } from '../../domain/student/StudentFactory.js';
import { Tutor } from '../../domain/tutor/Tutor.js';
import { Booking } from '../../domain/booking/Booking.js';
import { Student } from '../../domain/student/Student.js';
import { Wallet } from '../../domain/wallet/Wallet.js';
import { WalletTransaction } from '../../domain/wallet/WalletTransaction.js';
import { ForbiddenError } from '../../application/shared/errors/ForbiddenError.js';
import { ValidationError } from '../../domain/shared/errors/DomainError.js';
import { IBookingRepository } from '../../domain/booking/BookingRepository.js';
import { IStudentRepository } from '../../domain/student/StudentRepository.js';
import { ITutorRepository } from '../../domain/tutor/TutorRepository.js';
import { IWalletRepository } from '../../domain/wallet/WalletRepository.js';

class MockBookingRepo implements IBookingRepository {
  public bookings = new Map<string, Booking>();
  async findById(id: string) { return this.bookings.get(id) || null; }
  async create(b: Booking) { this.bookings.set(b.id, b); return b; }
  async findByStudentId(sid: string) { return Array.from(this.bookings.values()).filter(b => b.studentId === sid); }
  async findByTutorId(tid: string) { return Array.from(this.bookings.values()).filter(b => b.tutorId === tid); }
  async updateStatus(id: string, s: any, notes?: string) {
    const b = this.bookings.get(id);
    if (!b) throw new Error('Not found');
    b.status = s;
    if (notes) b.notes = notes;
    return b;
  }
}

class MockStudentRepo implements IStudentRepository {
  public students = new Map<string, Student>();
  async findById(id: string) { return this.students.get(id) || null; }
  async findByUserId(uid: string) {
    return Array.from(this.students.values()).find(s => s.userId === uid) || null;
  }
  async create(s: Student) { this.students.set(s.id, s); return s; }
  async update(id: string, s: Student) { this.students.set(id, s); return s; }
}

class MockTutorRepo implements ITutorRepository {
  public tutors = new Map<string, Tutor>();
  async findById(id: string) { return this.tutors.get(id) || null; }
  async findAll() { return Array.from(this.tutors.values()); }
  async create(t: Tutor) { this.tutors.set(t.id, t); return t; }
  async update(id: string, t: Tutor) { this.tutors.set(id, t); return t; }
}

class MockWalletRepo implements IWalletRepository {
  public balance = 100;
  async getBalance(_uid: string) { return this.balance; }
  async updateBalance(_uid: string, nb: number) { this.balance = nb; }
  async addTransaction(t: WalletTransaction) { this.balance += t.amount; return t; }
  async getTransactions(_uid: string) { return []; }
  async findByUserId(uid: string) { return Wallet.create({ userId: uid, balance: this.balance }); }
  async saveWallet(_w: Wallet) {}
}

describe('Fase 5: Control de Autorización y Prevención BOLA/IDOR', () => {
  describe('BOLA / IDOR en Reservas', () => {
    test('debe rechazar modificación de reserva si el solicitante no es el estudiante ni el tutor de la clase', async () => {
      const repo = new MockBookingRepo();
      const booking = BookingFactory.create({
        id: 'book-100',
        studentId: 'student-owner-id',
        tutorId: 'tutor-teacher-id',
        tutorSubjectId: 'subj-1',
        subject: 'Cálculo',
        scheduledAt: new Date(Date.now() + 86400000),
        durationHours: 1,
        modality: 'online',
        hourlyRate: 25,
        totalPrice: 25,
      });
      await repo.create(booking);

      const useCase = new UpdateBookingStatusUseCase({ bookingRepository: repo });

      // Intento de cancelación por un tercero no autorizado
      await assert.rejects(
        async () => {
          await useCase.execute({
            bookingId: 'book-100',
            status: 'cancelled',
            requesterId: 'attacker-random-student',
            requesterRole: 'student',
          });
        },
        ForbiddenError
      );
    });

    test('debe permitir confirmación por parte del tutor asignado', async () => {
      const repo = new MockBookingRepo();
      const booking = BookingFactory.create({
        id: 'book-101',
        studentId: 'student-owner-id',
        tutorId: 'tutor-teacher-id',
        tutorSubjectId: 'subj-1',
        subject: 'Cálculo',
        scheduledAt: new Date(Date.now() + 86400000),
        durationHours: 1,
        modality: 'online',
        hourlyRate: 25,
        totalPrice: 25,
      });
      await repo.create(booking);

      const useCase = new UpdateBookingStatusUseCase({ bookingRepository: repo });
      const result = await useCase.execute({
        bookingId: 'book-101',
        status: 'confirmed',
        requesterId: 'tutor-teacher-id',
        requesterRole: 'tutor',
      });

      assert.strictEqual(result.status, 'confirmed');
    });

    test('debe permitir acción a un administrador', async () => {
      const repo = new MockBookingRepo();
      const booking = BookingFactory.create({
        id: 'book-102',
        studentId: 'student-owner-id',
        tutorId: 'tutor-teacher-id',
        tutorSubjectId: 'subj-1',
        subject: 'Cálculo',
        scheduledAt: new Date(Date.now() + 86400000),
        durationHours: 1,
        modality: 'online',
        hourlyRate: 25,
        totalPrice: 25,
      });
      await repo.create(booking);

      const useCase = new UpdateBookingStatusUseCase({ bookingRepository: repo });
      const result = await useCase.execute({
        bookingId: 'book-102',
        status: 'cancelled',
        requesterId: 'admin-super-user',
        requesterRole: 'admin',
      });

      assert.strictEqual(result.status, 'cancelled');
    });
  });

  describe('IDOR en Perfiles de Estudiantes', () => {
    test('debe rechazar actualización de perfil de estudiante si no pertenece al usuario autenticado', async () => {
      const repo = new MockStudentRepo();
      const student = StudentFactory.create({
        id: 'stu-profile-1',
        userId: 'real-student-user-id',
        educationLevel: 'Secundaria',
        learningGoals: 'Matemáticas',
      });
      await repo.create(student);

      const useCase = new UpdateStudentProfileUseCase({ studentRepository: repo });

      await assert.rejects(
        async () => {
          await useCase.execute({
            id: 'stu-profile-1',
            learningGoals: 'Hackeado',
            requesterId: 'other-user-id',
            requesterRole: 'student',
          });
        },
        ForbiddenError
      );
    });

    test('debe permitir actualización cuando el solicitante es el dueño del perfil', async () => {
      const repo = new MockStudentRepo();
      const student = StudentFactory.create({
        id: 'stu-profile-2',
        userId: 'real-student-user-id',
        educationLevel: 'Secundaria',
        learningGoals: 'Matemáticas',
      });
      await repo.create(student);

      const useCase = new UpdateStudentProfileUseCase({ studentRepository: repo });
      const result = await useCase.execute({
        id: 'stu-profile-2',
        educationLevel: 'Universidad',
        requesterId: 'real-student-user-id',
        requesterRole: 'student',
      });

      assert.strictEqual(result.educationLevel, 'Universidad');
    });
  });

  describe('Insignias Seguras en Postulación de Tutores', () => {
    test('un tutor recién registrado no debe recibir automáticamente la insignia de Verificado', async () => {
      const repo = new MockTutorRepo();
      const useCase = new RegisterTutorUseCase({ tutorRepository: repo });

      const tutor = await useCase.execute({
        userId: 'usr-new-tutor',
        fullName: 'Profesor Aspirante',
        subjectName: 'Química',
      });

      assert.ok(tutor.badges.includes('Nuevo Tutor'));
      assert.strictEqual(tutor.badges.includes('Verificado'), false, 'No debe auto-asignar Verificado');
    });
  });

  describe('Límites Financieros en Billetera', () => {
    test('debe rechazar recargas inferiores al mínimo ($5.00 USD)', async () => {
      const repo = new MockWalletRepo();
      const useCase = new RechargeWalletUseCase({ walletRepository: repo });

      await assert.rejects(
        async () => {
          await useCase.execute({
            userId: 'usr-1',
            amount: 2.5,
          });
        },
        (err: any) => err instanceof ValidationError && err.message.includes('$5.00')
      );
    });

    test('debe rechazar recargas superiores al tope máximo ($1,000.00 USD)', async () => {
      const repo = new MockWalletRepo();
      const useCase = new RechargeWalletUseCase({ walletRepository: repo });

      await assert.rejects(
        async () => {
          await useCase.execute({
            userId: 'usr-1',
            amount: 50000,
          });
        },
        (err: any) => err instanceof ValidationError && err.message.includes('$1,000.00')
      );
    });

    test('debe aceptar recargas legítimas dentro del rango ($5 a $1,000 USD)', async () => {
      const repo = new MockWalletRepo();
      const useCase = new RechargeWalletUseCase({ walletRepository: repo });

      const result = await useCase.execute({
        userId: 'usr-1',
        amount: 100,
      });

      assert.strictEqual(result.newBalance, 200);
      assert.strictEqual(result.transaction.amount, 100);
    });
  });
});
