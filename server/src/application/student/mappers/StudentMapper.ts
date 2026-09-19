import { Student } from '../../../domain/student/Student.js';
import { StudentResponseDTO } from '../dtos/index.js';

export class StudentMapper {
  public static toDTO(student: Student): StudentResponseDTO {
    return {
      id: student.id,
      userId: student.userId,
      educationLevel: student.educationLevel,
      learningGoals: student.learningGoals,
      createdAt: student.createdAt.toISOString(),
      updatedAt: student.updatedAt.toISOString(),
    };
  }
}
