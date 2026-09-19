import { Student } from './Student.js';

export interface StudentRepository {
  findById(id: string): Promise<Student | null>;
  findByUserId(userId: string): Promise<Student | null>;
  create(student: Student): Promise<Student>;
  update(id: string, updates: Partial<Student>): Promise<Student>;
}

export type IStudentRepository = StudentRepository;
