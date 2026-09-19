export interface ApproveTutorDTO {
  tutorId: string;
  badge?: string;
}

export interface BanUserDTO {
  userId: string;
  reason: string;
}

export interface ModerateReviewDTO {
  reviewId: string;
  action: 'approve' | 'hide' | 'delete';
  reason?: string;
}

export interface AdminOperationResultDTO {
  success: boolean;
  message: string;
  targetId: string;
}
