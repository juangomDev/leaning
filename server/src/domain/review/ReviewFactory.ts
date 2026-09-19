import crypto from 'node:crypto';
import { Review } from './Review.js';
import { Booking } from '../booking/Booking.js';

export class ReviewFactory {
  public static createFromCompletedBooking(
    booking: Booking,
    { rating, comment, id }: { rating: number; comment: string; id?: string }
  ): Review {
    return Review.fromCompletedBooking(booking, {
      id: id || crypto.randomUUID(),
      rating,
      comment,
      createdAt: new Date(),
    });
  }

  public static reconstitute(raw: {
    id: string;
    bookingId: string;
    studentId: string;
    tutorId: string;
    rating: number;
    comment: string;
    createdAt: Date | string;
  }): Review {
    return new Review({
      id: raw.id,
      bookingId: raw.bookingId,
      studentId: raw.studentId,
      tutorId: raw.tutorId,
      rating: raw.rating,
      comment: raw.comment,
      createdAt: raw.createdAt instanceof Date ? raw.createdAt : new Date(raw.createdAt),
    });
  }
}
