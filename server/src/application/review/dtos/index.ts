export interface CreateReviewDTO {
  bookingId: string;
  rating: number;
  comment: string;
  studentId?: string;
}

export interface ReviewResponseDTO {
  id: string;
  bookingId: string;
  studentId: string;
  tutorId: string;
  rating: number;
  comment: string;
  createdAt: string;
}
