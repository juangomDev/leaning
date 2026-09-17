import { ValidationError } from '../errors/DomainError.js';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type BookingModality = 'online' | 'presencial';

export interface BookingProps {
  id?: string;
  studentId: string;
  tutorId: string;
  subject: string;
  scheduledAt: Date | string;
  durationHours?: number;
  modality?: BookingModality;
  status?: BookingStatus;
  totalPrice?: number;
  notes?: string | null;
  createdAt?: Date;
  tutor?: any;
  student?: any;
}

export class Booking {
  public id?: string;
  public studentId: string;
  public tutorId: string;
  public subject: string;
  public scheduledAt: Date;
  public durationHours: number;
  public modality: BookingModality;
  public status: BookingStatus;
  public totalPrice: number;
  public notes: string | null;
  public createdAt: Date;
  public tutor?: any;
  public student?: any;

  constructor({
    id,
    studentId,
    tutorId,
    subject,
    scheduledAt,
    durationHours = 1,
    modality = 'online',
    status = 'pending',
    totalPrice = 0,
    notes = null,
    createdAt = new Date(),
    tutor = null,
    student = null,
  }: BookingProps) {
    this.validateRequired(studentId, 'studentId');
    this.validateRequired(tutorId, 'tutorId');
    this.validateRequired(subject, 'subject');
    this.validateStatus(status);

    this.id = id;
    this.studentId = studentId;
    this.tutorId = tutorId;
    this.subject = subject;
    this.scheduledAt = new Date(scheduledAt);
    this.durationHours = Number(durationHours);
    this.modality = modality;
    this.status = status;
    this.totalPrice = Number(totalPrice);
    this.notes = notes;
    this.createdAt = createdAt;
    this.tutor = tutor;
    this.student = student;
  }

  private validateRequired(val: any, fieldName: string): void {
    if (!val) {
      throw new ValidationError(`El campo ${fieldName} es obligatorio`);
    }
  }

  private validateStatus(status: string): void {
    const validStatuses: BookingStatus[] = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!validStatuses.includes(status as BookingStatus)) {
      throw new ValidationError(`Estado de reserva inválido: ${status}`);
    }
  }

  public confirm(): void {
    if (this.status === 'cancelled') {
      throw new ValidationError('No se puede confirmar una clase cancelada');
    }
    this.status = 'confirmed';
  }

  public cancel(reason?: string): void {
    if (this.status === 'completed') {
      throw new ValidationError('No se puede cancelar una clase que ya fue completada');
    }
    this.status = 'cancelled';
    if (reason) {
      this.notes = (this.notes ? this.notes + ' | ' : '') + `Motivo cancelación: ${reason}`;
    }
  }

  public complete(): void {
    this.status = 'completed';
  }
}
