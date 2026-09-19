import { Tutor } from '../../../domain/tutor/Tutor.js';
import { TutorResponseDTO } from '../dtos/index.js';

export class TutorMapper {
  public static toDTO(tutor: Tutor): TutorResponseDTO {
    return {
      id: tutor.id,
      userId: tutor.userId,
      fullName: tutor.fullName,
      avatarUrl: tutor.avatarUrl,
      bio: tutor.bio,
      modality: tutor.modality,
      rating: tutor.rating,
      reviewsCount: tutor.reviewsCount,
      badges: [...tutor.badges],
      isAvailable: tutor.isAvailable,
      subjects: tutor.subjects.map((s) => ({
        id: s.id,
        tutorId: s.tutorId,
        subjectName: s.subjectName,
        category: s.category,
        pricePerHour: s.pricePerHour,
        description: s.description,
        isActive: s.isActive,
      })),
      createdAt: tutor.createdAt.toISOString(),
    };
  }
}
