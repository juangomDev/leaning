export interface SendBookingConfirmationDTO {
  bookingId: string;
}

export interface SendBookingCancellationDTO {
  bookingId: string;
  reason?: string;
}

export interface NotificationResultDTO {
  success: boolean;
  bookingId: string;
  message: string;
}
