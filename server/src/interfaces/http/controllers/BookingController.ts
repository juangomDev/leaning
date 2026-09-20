import { Response, NextFunction } from 'express';
import {
  CreateBookingUseCase,
  GetUserBookingsUseCase,
  UpdateBookingStatusUseCase,
} from '../../../application/booking/index.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import { BookingStatus } from '../../../domain/booking/Booking.js';

export class BookingController {
  private createBookingUseCase: CreateBookingUseCase;
  private getUserBookingsUseCase: GetUserBookingsUseCase;
  private updateBookingStatusUseCase: UpdateBookingStatusUseCase;

  constructor({
    createBookingUseCase,
    getUserBookingsUseCase,
    updateBookingStatusUseCase,
  }: {
    createBookingUseCase: CreateBookingUseCase;
    getUserBookingsUseCase: GetUserBookingsUseCase;
    updateBookingStatusUseCase: UpdateBookingStatusUseCase;
  }) {
    this.createBookingUseCase = createBookingUseCase;
    this.getUserBookingsUseCase = getUserBookingsUseCase;
    this.updateBookingStatusUseCase = updateBookingStatusUseCase;
  }

  createBooking = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const studentId = req.user?.id || req.body.studentId;
      const { tutorId, subject, scheduledAt, durationHours, modality, notes } = req.body;

      const booking = await this.createBookingUseCase.execute({
        studentId,
        tutorId,
        subject,
        scheduledAt,
        durationHours,
        modality,
        notes,
      });

      res.status(201).json({
        success: true,
        data: booking,
      });
    } catch (err) {
      next(err);
    }
  };

  getMyBookings = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id || 'student-demo-id';
      const role = req.user?.role || 'student';

      const bookings = await this.getUserBookingsUseCase.execute({ userId, role });
      res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } catch (err) {
      next(err);
    }
  };

  updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, notes } = req.body;

      const updated = await this.updateBookingStatusUseCase.execute({
        bookingId: id,
        status: status as BookingStatus,
        notes,
        requesterId: req.user?.id,
        requesterRole: req.user?.role,
      });

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (err) {
      next(err);
    }
  };
}
