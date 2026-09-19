import { ValidationError } from '../shared/errors/DomainError.js';

export type TransactionType =
  | 'recharge'
  | 'class_payment'
  | 'booking_payment'
  | 'tutor_payout'
  | 'booking_refund';

export type TransactionStatus = 'completed' | 'pending' | 'failed';

export const VALID_TRANSACTION_TYPES: readonly TransactionType[] = [
  'recharge',
  'class_payment',
  'booking_payment',
  'tutor_payout',
  'booking_refund',
] as const;

export const VALID_TRANSACTION_STATUSES: readonly TransactionStatus[] = [
  'completed',
  'pending',
  'failed',
] as const;

export interface WalletTransactionProps {
  id: string;
  walletId: string;
  userId: string;
  bookingId: string | null;
  amount: number;
  type: TransactionType | string;
  concept: string;
  status: TransactionStatus;
  createdAt: Date;
}

export class WalletTransaction {
  public readonly id: string;
  public readonly walletId: string;
  public readonly userId: string;
  public readonly bookingId: string | null;
  public readonly amount: number;
  public readonly type: TransactionType;
  public readonly concept: string;
  public status: TransactionStatus;
  public readonly createdAt: Date;

  constructor({
    id,
    walletId,
    userId,
    bookingId,
    amount,
    type,
    concept,
    status,
    createdAt,
  }: WalletTransactionProps) {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new ValidationError('El id de la transacción es requerido');
    }
    if (!walletId || typeof walletId !== 'string' || walletId.trim() === '') {
      throw new ValidationError('El walletId de la transacción es requerido');
    }
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new ValidationError('userId es requerido para la transacción');
    }
    if (bookingId === undefined) {
      throw new ValidationError('El campo bookingId es requerido (puede ser null)');
    }
    if (!concept || typeof concept !== 'string' || concept.trim() === '') {
      throw new ValidationError('El concepto de la transacción es requerido');
    }
    if (!createdAt || !(createdAt instanceof Date) || isNaN(createdAt.getTime())) {
      throw new ValidationError('La fecha createdAt es requerida y debe ser válida');
    }

    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new ValidationError('El monto de la transacción debe ser un número positivo mayor a 0');
    }

    this.validateType(type);
    this.validateStatus(status);

    this.id = id.trim();
    this.walletId = walletId.trim();
    this.userId = userId.trim();
    this.bookingId = bookingId ? bookingId.trim() : null;
    this.amount = Number(parsedAmount.toFixed(2));
    this.type = type as TransactionType;
    this.concept = concept.trim();
    this.status = status;
    this.createdAt = createdAt;
  }

  private validateType(type: string): void {
    if (!VALID_TRANSACTION_TYPES.includes(type as TransactionType)) {
      throw new ValidationError(
        `Tipo de transacción inválido: "${type}". Tipos permitidos: ${VALID_TRANSACTION_TYPES.join(', ')}`
      );
    }
  }

  private validateStatus(status: string): void {
    if (!VALID_TRANSACTION_STATUSES.includes(status as TransactionStatus)) {
      throw new ValidationError(`Estado de transacción inválido: "${status}"`);
    }
  }

  public markAsCompleted(): void {
    this.status = 'completed';
  }

  public markAsFailed(): void {
    this.status = 'failed';
  }
}
