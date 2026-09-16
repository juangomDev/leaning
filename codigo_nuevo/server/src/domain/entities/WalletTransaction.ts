import { ValidationError } from '../errors/DomainError.js';

export type TransactionType = 'recharge' | 'class_payment' | 'tutor_payout';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface WalletTransactionProps {
  id?: string;
  userId: string;
  amount: number;
  type: TransactionType;
  concept: string;
  status?: TransactionStatus;
  createdAt?: Date;
}

export class WalletTransaction {
  public id?: string;
  public userId: string;
  public amount: number;
  public type: TransactionType;
  public concept: string;
  public status: TransactionStatus;
  public createdAt: Date;

  constructor({
    id,
    userId,
    amount,
    type,
    concept,
    status = 'completed',
    createdAt = new Date(),
  }: WalletTransactionProps) {
    if (!userId) throw new ValidationError('userId es requerido para la transacción');
    if (amount === undefined || isNaN(amount)) throw new ValidationError('Monto inválido');

    this.id = id;
    this.userId = userId;
    this.amount = Number(amount);
    this.type = type;
    this.concept = concept;
    this.status = status;
    this.createdAt = createdAt;
  }
}
