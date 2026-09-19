import crypto from 'node:crypto';
import { Booking } from '../Booking.js';
import { Wallet } from '../../wallet/Wallet.js';
import { WalletTransaction } from '../../wallet/WalletTransaction.js';
import { ValidationError, ConflictError } from '../../shared/errors/DomainError.js';

export interface BookingPaymentResult {
  booking: Booking;
  wallet: Wallet;
  transaction: WalletTransaction;
}

export class BookingPaymentDomainService {
  /**
   * Procesa el pago de una reserva utilizando los fondos disponibles en la billetera del estudiante.
   * Regla multi-entidad:
   * 1. Booking debe estar en estado 'pending'.
   * 2. Wallet debe pertenecer al estudiante que solicita la clase.
   * 3. Wallet debe tener fondos suficientes (debit lanzará InsufficientFundsError si no alcanza).
   * 4. Se genera la transacción de débito enlazada a la reserva.
   * 5. Booking pasa a estado 'confirmed'.
   */
  public payBooking(wallet: Wallet, booking: Booking): BookingPaymentResult {
    if (booking.status !== 'pending') {
      throw new ConflictError(
        `No se puede pagar una reserva que no está pendiente. Estado actual: "${booking.status}"`
      );
    }

    if (wallet.userId !== booking.studentId) {
      throw new ValidationError(
        'La billetera provista no pertenece al estudiante que solicita la reserva'
      );
    }

    // 1. Debitar fondos (arroja InsufficientFundsError si balance < totalPrice)
    wallet.debit(booking.totalPrice);

    // 2. Crear registro de transacción financiera enlazada
    const transaction = new WalletTransaction({
      id: crypto.randomUUID(),
      walletId: wallet.id,
      userId: wallet.userId,
      bookingId: booking.id,
      amount: booking.totalPrice,
      type: 'booking_payment',
      concept: `Pago por clase de ${booking.subject}`,
      status: 'completed',
      createdAt: new Date(),
    });

    // 3. Confirmar la reserva de clase
    booking.confirm();

    return {
      booking,
      wallet,
      transaction,
    };
  }
}
