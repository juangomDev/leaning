import { ValidationError } from '../errors/DomainError.js';

export class Money {
  private readonly _amount: number;
  private readonly _currency: string;

  private constructor(amount: number, currency = 'USD') {
    this._amount = amount;
    this._currency = currency;
  }

  public static create(amount: number, currency = 'USD'): Money {
    if (amount === undefined || isNaN(amount) || amount < 0) {
      throw new ValidationError('El monto de dinero no puede ser negativo ni inválido');
    }
    if (!currency || typeof currency !== 'string' || currency.trim() === '') {
      throw new ValidationError('La moneda es requerida');
    }

    const rounded = Math.round((Number(amount) + Number.EPSILON) * 100) / 100;
    return new Money(rounded, currency.trim().toUpperCase());
  }

  public get amount(): number {
    return this._amount;
  }

  public get currency(): string {
    return this._currency;
  }

  public add(other: Money): Money {
    this.assertSameCurrency(other);
    return Money.create(this._amount + other._amount, this._currency);
  }

  public subtract(other: Money): Money {
    this.assertSameCurrency(other);
    if (this._amount < other._amount) {
      throw new ValidationError('El monto a restar supera los fondos disponibles');
    }
    return Money.create(this._amount - other._amount, this._currency);
  }

  public isGreaterThanOrEqual(other: Money): boolean {
    this.assertSameCurrency(other);
    return this._amount >= other._amount;
  }

  private assertSameCurrency(other: Money): void {
    if (this._currency !== other._currency) {
      throw new ValidationError(`Monedas incompatibles: ${this._currency} vs ${other._currency}`);
    }
  }

  public toString(): string {
    return `${this._amount.toFixed(2)} ${this._currency}`;
  }
}
