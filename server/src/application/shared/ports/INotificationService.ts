export interface BookingNotificationPayload {
  bookingId: string;
  studentId: string;
  tutorId: string;
  studentEmail?: string;
  studentName?: string;
  tutorEmail?: string;
  tutorName?: string;
  subject: string;
  scheduledAt: Date;
  reason?: string;
}

export interface INotificationService {
  sendBookingConfirmation(payload: BookingNotificationPayload): Promise<void>;
  sendBookingCancellation(payload: BookingNotificationPayload): Promise<void>;
  sendNotification(recipientEmail: string, title: string, message: string): Promise<void>;
  sendPasswordReset(recipientEmail: string, token: string, userName?: string): Promise<void>;
  sendEmailVerification(recipientEmail: string, token: string, userName?: string): Promise<void>;
}
