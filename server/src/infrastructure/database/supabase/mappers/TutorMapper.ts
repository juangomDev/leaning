import { Tutor, TutorModality } from '../../../../domain/tutor/Tutor.js';
import { TutorFactory } from '../../../../domain/tutor/TutorFactory.js';
import { TutorSubject } from '../../../../domain/tutor/TutorSubject.js';
import { TutorRow, TutorSubjectRow } from '../client.js';

export class TutorMapper {
  public static toDomain(row: TutorRow, subjectRows: TutorSubjectRow[] = []): Tutor {
    const subjects = subjectRows.map(
      (s) =>
        new TutorSubject({
          id: s.id,
          tutorId: s.tutor_id,
          subjectName: s.subject_name,
          category: s.category,
          pricePerHour: Number(s.price_per_hour),
          description: s.description,
          isActive: s.is_active,
          createdAt: new Date(s.created_at),
        })
    );

    return TutorFactory.reconstitute({
      id: row.id,
      userId: row.user_id || row.id,
      fullName: row.full_name,
      avatarUrl: row.avatar_url,
      bio: row.bio,
      modality: row.modality as TutorModality,
      rating: Number(row.rating),
      reviewsCount: Number(row.reviews_count),
      badges: row.badges || [],
      isAvailable: row.is_available,
      subjects,
      createdAt: row.created_at,
    });
  }

  public static toRow(tutor: Tutor): Partial<TutorRow> {
    return {
      id: tutor.id,
      full_name: tutor.fullName,
      avatar_url: tutor.avatarUrl,
      bio: tutor.bio,
      modality: tutor.modality,
      rating: tutor.rating,
      reviews_count: tutor.reviewsCount,
      badges: [...tutor.badges],
      is_available: tutor.isAvailable,
    };
  }

  public static toSubjectRow(subject: TutorSubject): Partial<TutorSubjectRow> {
    return {
      id: subject.id,
      tutor_id: subject.tutorId,
      subject_name: subject.subjectName,
      category: subject.category,
      price_per_hour: subject.pricePerHour,
      description: subject.description,
      is_active: subject.isActive,
    };
  }
}
