import crypto from 'node:crypto';
import { Student } from './Student.js';

export interface CreateStudentDTO {
  id?: string;
  userId: string;
  educationLevel: string;
  learningGoals: string;
}

export class StudentFactory {
  public static create({
    id,
    userId,
    educationLevel,
    learningGoals,
  }: CreateStudentDTO): Student {
    const now = new Date();
    return new Student({
      id: id || crypto.randomUUID(),
      userId,
      educationLevel,
      learningGoals,
      createdAt: now,
      updatedAt: now,
    });
  }

  public static reconstitute(raw: {
    id: string;
    userId: string;
    educationLevel: string;
    learningGoals: string;
    createdAt: Date | string;
    updatedAt: Date | string;
  }): Student {
    return new Student({
      id: raw.id,
      userId: raw.userId,
      educationLevel: raw.educationLevel,
      learningGoals: raw.learningGoals,
      createdAt: raw.createdAt instanceof Date ? raw.createdAt : new Date(raw.createdAt),
      updatedAt: raw.updatedAt instanceof Date ? raw.updatedAt : new Date(raw.updatedAt),
    });
  }
}
