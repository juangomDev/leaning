import { IStudentRepository } from '../../../domain/student/StudentRepository.js';
import { Student } from '../../../domain/student/Student.js';

export class InMemoryStudentRepository implements IStudentRepository {
  private students: Student[];

  constructor() {
    const now = new Date();
    this.students = [
      new Student({
        id: 'student-prof-1',
        userId: 'student-demo-id',
        educationLevel: 'Universidad',
        learningGoals: 'Dominar Cálculo Integral y Preparar Exámenes Finales',
        createdAt: now,
        updatedAt: now,
      }),
    ];
  }

  async findById(id: string): Promise<Student | null> {
    const student = this.students.find((s) => s.id === id);
    return student || null;
  }

  async findByUserId(userId: string): Promise<Student | null> {
    const student = this.students.find((s) => s.userId === userId);
    return student || null;
  }

  async create(student: Student): Promise<Student> {
    this.students.push(student);
    return student;
  }

  async update(id: string, updates: Partial<Student>): Promise<Student> {
    const student = this.students.find((s) => s.id === id);
    if (!student) throw new Error('Estudiante no encontrado');
    Object.assign(student, updates);
    return student;
  }
}
