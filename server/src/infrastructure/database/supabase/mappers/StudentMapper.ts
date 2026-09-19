import { Student } from '../../../../domain/student/Student.js';
import { StudentFactory } from '../../../../domain/student/StudentFactory.js';
import { StudentRow } from '../client.js';

export class StudentMapper {
  public static toDomain(row: StudentRow): Student {
    return StudentFactory.reconstitute({
      id: row.id,
      userId: row.user_id,
      educationLevel: row.education_level,
      learningGoals: row.learning_goals,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    });
  }

  public static toRow(student: Student): Partial<StudentRow> {
    return {
      id: student.id,
      user_id: student.userId,
      education_level: student.educationLevel,
      learning_goals: student.learningGoals,
      updated_at: student.updatedAt.toISOString(),
    };
  }
}
