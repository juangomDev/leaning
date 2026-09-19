import { ValidationError, InvalidStateTransitionError } from '../shared/errors/DomainError.js';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type BookingModality = 'online' | 'presencial';

export const VALID_BOOKING_STATUSES: readonly BookingStatus[] = [
  'pending',
  'confirmed',
  'cancelled',
  'completed',
] as const;

export const VALID_BOOKING_MODALITIES: readonly BookingModality[] = [
  'online',
  'presencial',
] as const;

export interface BookingProps {
  id: string;
  studentId: string;
  tutorId: string;
  tutorSubjectId: string;
  subject: string;
  scheduledAt: Date;
  durationHours: number;
  modality: BookingModality;
  status: BookingStatus;
  hourlyRate: number;
  totalPrice: number;
  notes: string | null;
  createdAt: Date;
  tutor?: any;
  student?: any;
}

export class Booking {
  public readonly id: string;
  public readonly studentId: string;
  public readonly tutorId: string;
  public readonly tutorSubjectId: string;
  public readonly subject: string;
  public scheduledAt: Date;
  public durationHours: number;
  public modality: BookingModality;
  public status: BookingStatus;
  public hourlyRate: number;
  public totalPrice: number;
  public notes: string | null;
  public readonly createdAt: Date;
  public tutor?: any;
  public student?: any;

  constructor({
    id,
    studentId,
    tutorId,
    tutorSubjectId,
    subject,
    scheduledAt,
    durationHours,
    modality,
    status,
    hourlyRate,
    totalPrice,
    notes,
    createdAt,
    tutor = null,
    student = null,
  }: BookingProps) {
    this.validateRequired(id, 'id');
    this.validateRequired(studentId, 'studentId');
    this.validateRequired(tutorId, 'tutorId');
    this.validateRequired(tutorSubjectId, 'tutorSubjectId');
    this.validateRequired(subject, 'subject');
    this.validateStatus(status);
    this.validateModality(modality);

    if (notes === undefined) {
      throw new ValidationError('El campo notes es requerido (puede ser null)');
    }

    if (studentId.trim() === tutorId.trim()) {
      throw new ValidationError('El estudiante no puede reservar una clase consigo mismo como tutor');
    }

    const duration = Number(durationHours);
    if (isNaN(duration) || duration < 0.5) {
      throw new ValidationError('La duración mínima de una clase debe ser de al menos 0.5 horas (30 minutos)');
    }

    if (!scheduledAt || !(scheduledAt instanceof Date) || isNaN(scheduledAt.getTime())) {
      throw new ValidationError('La fecha de reserva scheduledAt es requerida y debe ser válida');
    }

    if (!createdAt || !(createdAt instanceof Date) || isNaN(createdAt.getTime())) {
      throw new ValidationError('La fecha de creación createdAt es requerida y debe ser válida');
    }

    const rate = Number(hourlyRate);
    if (isNaN(rate) || rate < 0) {
      throw new ValidationError('La tarifa por hora (hourlyRate) es requerida y debe ser positiva');
    }

    const price = Number(totalPrice);
    if (isNaN(price) || price < 0) {
      throw new ValidationError('El precio total (totalPrice) es requerido y debe ser positivo');
    }

    this.id = id.trim();
    this.studentId = studentId.trim();
    this.tutorId = tutorId.trim();
    this.tutorSubjectId = tutorSubjectId.trim();
    this.subject = subject.trim();
    this.scheduledAt = scheduledAt;
    this.durationHours = duration;
    this.modality = modality;
    this.status = status;
    this.hourlyRate = rate;
    this.totalPrice = Number(price.toFixed(2));
    this.notes = notes ? notes.trim() : null;
    this.createdAt = createdAt;
    this.tutor = tutor;
    this.student = student;
  }

  private validateRequired(val: any, fieldName: string): void {
    if (!val || typeof val !== 'string' || val.trim() === '') {
      throw new ValidationError(`El campo ${fieldName} es obligatorio`);
    }
  }

  private validateStatus(status: string): void {
    if (!VALID_BOOKING_STATUSES.includes(status as BookingStatus)) {
      throw new ValidationError(`Estado de reserva inválido: "${status}". Válidos: ${VALID_BOOKING_STATUSES.join(', ')}`);
    }
  }

  private validateModality(modality: string): void {
    if (!VALID_BOOKING_MODALITIES.includes(modality as BookingModality)) {
      throw new ValidationError(`Modalidad de reserva inválida: "${modality}". Válidas: ${VALID_BOOKING_MODALITIES.join(', ')}`);
    }
  }

  public confirm(): void {
    if (this.status !== 'pending') {
      throw new InvalidStateTransitionError(
        `No se puede confirmar la reserva porque su estado actual es "${this.status}". Solo reservas "pending" pueden ser confirmadas.`
      );
    }
    this.status = 'confirmed';
  }

  public cancel(reason?: string): void {
    if (this.status === 'completed') {
      throw new InvalidStateTransitionError('No se puede cancelar una clase que ya fue completada');
    }
    if (this.status === 'cancelled') {
      throw new InvalidStateTransitionError('La clase ya se encuentra cancelada');
    }
    this.status = 'cancelled';
    if (reason) {
      this.notes = (this.notes ? this.notes + ' | ' : '') + `Motivo cancelación: ${reason}`;
    }
  }

  public complete(): void {
    if (this.status !== 'confirmed') {
      throw new InvalidStateTransitionError(
        `No se puede completar una reserva en estado "${this.status}". Debe estar en estado "confirmed".`
      );
    }
    this.status = 'completed';
  }

  public canGenerateReview(): boolean {
    return this.status === 'completed';
  }
}
