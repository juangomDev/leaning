import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Booking, BookingStatus } from '../../../domain/booking/Booking.js';
import { IBookingRepository } from '../ports/IBookingRepository.js';
import { ITutorRepository } from '../../tutor/ports/ITutorRepository.js';
import { IAvailabilityChecker } from '../ports/IAvailabilityChecker.js';
import { Tutor } from '../../../domain/tutor/Tutor.js';
import { TutorSubject } from '../../../domain/tutor/TutorSubject.js';
import { CreateBookingUseCase } from './CreateBookingUseCase.js';
import { GetUserBookingsUseCase } from './GetUserBookingsUseCase.js';
import { UpdateBookingStatusUseCase } from './UpdateBookingStatusUseCase.js';
import { CancelBookingUseCase } from './CancelBookingUseCase.js';
import { TutorUnavailableError, BookingNotFoundError } from '../errors/index.js';
import { IClock } from '../../shared/ports/IClock.js';

class MockBookingRepository implements IBookingRepository {
  public bookings: Map<string, Booking> = new Map();

  async findById(id: string): Promise<Booking | null> {
    return this.bookings.get(id) || null;
  }

  async findByStudentId(studentId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter((b) => b.studentId === studentId);
  }

  async findByTutorId(tutorId: string): Promise<Booking[]> {
    return Array.from(this.bookings.values()).filter((b) => b.tutorId === tutorId);
  }

  async create(booking: Booking): Promise<Booking> {
    this.bookings.set(booking.id, booking);
    return booking;
  }

  async updateStatus(id: string, status: BookingStatus, notes?: string): Promise<Booking> {
    const b = this.bookings.get(id);
    if (!b) throw new Error('Not found');
    b.status = status;
    if (notes !== undefined) b.notes = notes;
    return b;
  }
}

class MockTutorRepository implements ITutorRepository {
  public tutors: Map<string, Tutor> = new Map();

  async findById(id: string): Promise<Tutor | null> {
    return this.tutors.get(id) || null;
  }
  async findAll(): Promise<Tutor[]> {
    return Array.from(this.tutors.values());
  }
  async create(t: Tutor): Promise<Tutor> {
    this.tutors.set(t.id, t);
    return t;
  }
  async update(id: string, t: Tutor): Promise<Tutor> {
    this.tutors.set(id, t);
    return t;
  }
}

class MockAvailabilityChecker implements IAvailabilityChecker {
  public available = true;
  async isTutorAvailable(): Promise<boolean> {
    return this.available;
  }
}

class FixedClock implements IClock {
  constructor(private readonly d: Date) {}
  now(): Date {
    return this.d;
  }
}

describe('Booking UseCases', () => {
  const sampleTutor = new Tutor({
    id: 'tut-einstein',
    userId: 'usr-einstein',
    fullName: 'Albert Einstein',
    avatarUrl: 'http://avatar.com/albert.png',
    bio: 'Física cuántica y relatividad',
    modality: 'online',
    rating: 5,
    reviewsCount: 10,
    badges: ['Top'],
    isAvailable: true,
    subjects: [
      new TutorSubject({
        id: 'subj-rel',
        tutorId: 'tut-einstein',
        subjectName: 'Física Teórica',
        category: 'ciencias',
        pricePerHour: 50,
        description: 'Relatividad general y física moderna',
        isActive: true,
        createdAt: new Date(),
      }),
    ],
    createdAt: new Date(),
  });

  it('debe crear una reserva calculando precio con Money y manteniendo solo IDs', async () => {
    const bookingRepo = new MockBookingRepository();
    const tutorRepo = new MockTutorRepository();
    await tutorRepo.create(sampleTutor);

    const fixedDate = new Date('2026-03-01T10:00:00Z');
    const clock = new FixedClock(fixedDate);
    const useCase = new CreateBookingUseCase({
      bookingRepository: bookingRepo,
      tutorRepository: tutorRepo,
      clock,
    });

    const result = await useCase.execute({
      studentId: 'stu-bohr',
      tutorId: 'tut-einstein',
      scheduledAt: '2026-03-10T15:00:00Z',
      durationHours: 2,
      modality: 'online',
      notes: 'Discusión sobre paradoja EPR',
    });

    assert.ok(result.id);
    assert.strictEqual(result.studentId, 'stu-bohr');
    assert.strictEqual(result.tutorId, 'tut-einstein');
    assert.strictEqual(result.hourlyRate, 50);
    assert.strictEqual(result.totalPrice, 100);
    assert.strictEqual(result.createdAt, fixedDate.toISOString());
    assert.strictEqual(result.tutor?.name, 'Albert Einstein');

    // Verificar en el repositorio que la entidad NO contiene objetos anidados student/tutor
    const savedEntity = await bookingRepo.findById(result.id);
    assert.ok(savedEntity);
    assert.strictEqual((savedEntity as any).tutor, undefined);
    assert.strictEqual((savedEntity as any).student, undefined);
  });

  it('debe rechazar la reserva si el tutor no está disponible según IAvailabilityChecker', async () => {
    const bookingRepo = new MockBookingRepository();
    const tutorRepo = new MockTutorRepository();
    await tutorRepo.create(sampleTutor);

    const checker = new MockAvailabilityChecker();
    checker.available = false;

    const useCase = new CreateBookingUseCase({
      bookingRepository: bookingRepo,
      tutorRepository: tutorRepo,
      availabilityChecker: checker,
    });

    await assert.rejects(
      async () => {
        await useCase.execute({
          studentId: 'stu-1',
          tutorId: 'tut-einstein',
          scheduledAt: new Date(),
          durationHours: 1,
        });
      },
      TutorUnavailableError
    );
  });

  it('debe listar reservas del usuario y actualizar/cancelar su estado', async () => {
    const bookingRepo = new MockBookingRepository();
    const tutorRepo = new MockTutorRepository();
    await tutorRepo.create(sampleTutor);

    const createUseCase = new CreateBookingUseCase({
      bookingRepository: bookingRepo,
      tutorRepository: tutorRepo,
    });

    const created = await createUseCase.execute({
      studentId: 'stu-feynman',
      tutorId: 'tut-einstein',
      scheduledAt: new Date(Date.now() + 86400000),
      durationHours: 1,
    });

    const listUseCase = new GetUserBookingsUseCase({ bookingRepository: bookingRepo });
    const studentList = await listUseCase.execute({ userId: 'stu-feynman', role: 'student' });
    assert.strictEqual(studentList.length, 1);

    const updateUseCase = new UpdateBookingStatusUseCase({ bookingRepository: bookingRepo });
    const confirmed = await updateUseCase.execute({ bookingId: created.id, status: 'confirmed' });
    assert.strictEqual(confirmed.status, 'confirmed');

    const cancelUseCase = new CancelBookingUseCase({ bookingRepository: bookingRepo });
    const cancelled = await cancelUseCase.execute({ bookingId: created.id, reason: 'Imprevisto de viaje' });
    assert.strictEqual(cancelled.status, 'cancelled');
  });
});
