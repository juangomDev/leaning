import { ValidationError, InsufficientFundsError, ConflictError } from '../shared/errors/DomainError.js';
import { Money } from './value-objects/Money.js';

export type WalletStatus = 'active' | 'frozen';

export const VALID_WALLET_STATUSES: readonly WalletStatus[] = ['active', 'frozen'] as const;

export interface WalletProps {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  status: WalletStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Wallet {
  public readonly id: string;
  public readonly userId: string;
  private _money: Money;
  public status: WalletStatus;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor({
    id,
    userId,
    balance,
    currency,
    status,
    createdAt,
    updatedAt,
  }: WalletProps) {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new ValidationError('El id de la billetera es requerido');
    }
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new ValidationError('El userId asociado a la billetera es requerido');
    }
    if (!currency || typeof currency !== 'string' || currency.trim() === '') {
      throw new ValidationError('La moneda (currency) de la billetera es requerida');
    }
    if (!VALID_WALLET_STATUSES.includes(status)) {
      throw new ValidationError(`Estado de billetera inválido: "${status}". Válidos: ${VALID_WALLET_STATUSES.join(', ')}`);
    }
    if (!createdAt || !(createdAt instanceof Date) || isNaN(createdAt.getTime())) {
      throw new ValidationError('La fecha de creación createdAt es requerida y debe ser válida');
    }
    if (!updatedAt || !(updatedAt instanceof Date) || isNaN(updatedAt.getTime())) {
      throw new ValidationError('La fecha de actualización updatedAt es requerida y debe ser válida');
    }

    if (balance === undefined || isNaN(Number(balance)) || Number(balance) < 0) {
      throw new ValidationError('El saldo inicial (balance) de la billetera es requerido y no puede ser negativo ni inválido');
    }

    this.id = id.trim();
    this.userId = userId.trim();
    this._money = Money.create(balance, currency);
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public get balance(): number {
    return this._money.amount;
  }

  public get currency(): string {
    return this._money.currency;
  }

  public get moneyVO(): Money {
    return this._money;
  }

  public canAfford(amount: number): boolean {
    if (this.status !== 'active') return false;
    return this._money.amount >= Number(amount);
  }

  public recharge(amount: number): void {
    this.assertActive();
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new ValidationError('El monto a recargar debe ser mayor a 0');
    }

    const rechargeMoney = Money.create(parsedAmount, this.currency);
    this._money = this._money.add(rechargeMoney);
    this.updatedAt = new Date();
  }

  public debit(amount: number): void {
    this.assertActive();
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new ValidationError('El monto a debitar debe ser mayor a 0');
    }

    if (this._money.amount < parsedAmount) {
      throw new InsufficientFundsError(
        `Saldo insuficiente: se requieren $${parsedAmount} ${this.currency} pero el saldo disponible es $${this._money.amount} ${this.currency}`
      );
    }

    const debitMoney = Money.create(parsedAmount, this.currency);
    this._money = this._money.subtract(debitMoney);
    this.updatedAt = new Date();
  }

  public credit(amount: number): void {
    this.assertActive();
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      throw new ValidationError('El monto a acreditar debe ser mayor a 0');
    }

    const creditMoney = Money.create(parsedAmount, this.currency);
    this._money = this._money.add(creditMoney);
    this.updatedAt = new Date();
  }

  public freeze(): void {
    this.status = 'frozen';
    this.updatedAt = new Date();
  }

  public unfreeze(): void {
    this.status = 'active';
    this.updatedAt = new Date();
  }

  private assertActive(): void {
    if (this.status === 'frozen') {
      throw new ConflictError('La billetera se encuentra congelada. Operación denegada.');
    }
  }
}
