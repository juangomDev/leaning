import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Student } from '../../../domain/student/Student.js';
import { IStudentRepository } from '../ports/IStudentRepository.js';
import { CreateStudentProfileUseCase } from './CreateStudentProfileUseCase.js';
import { GetStudentProfileUseCase } from './GetStudentProfileUseCase.js';
import { UpdateStudentProfileUseCase } from './UpdateStudentProfileUseCase.js';
import { ConflictError } from '../../shared/errors/ConflictError.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';

class MockStudentRepository implements IStudentRepository {
  public students: Map<string, Student> = new Map();

  async findById(id: string): Promise<Student | null> {
    return this.students.get(id) || null;
  }

  async findByUserId(userId: string): Promise<Student | null> {
    for (const s of this.students.values()) {
      if (s.userId === userId) return s;
    }
    return null;
  }

  async create(student: Student): Promise<Student> {
    this.students.set(student.id, student);
    return student;
  }

  async update(id: string, updates: Partial<Student>): Promise<Student> {
    const existing = this.students.get(id);
    if (!existing) throw new Error('Student not found');
    this.students.set(id, existing);
    return existing;
  }
}

describe('Student UseCases', () => {
  it('debe crear un perfil de estudiante y mapearlo a DTO', async () => {
    const repo = new MockStudentRepository();
    const createUseCase = new CreateStudentProfileUseCase({ studentRepository: repo });

    const result = await createUseCase.execute({
      userId: 'usr-100',
      educationLevel: 'Universidad',
      learningGoals: 'Aprender Cálculo y Física',
    });

    assert.ok(result.id);
    assert.strictEqual(result.userId, 'usr-100');
    assert.strictEqual(result.educationLevel, 'Universidad');
    assert.strictEqual(result.learningGoals, 'Aprender Cálculo y Física');
  });

  it('debe rechazar la creación si ya existe perfil para ese userId', async () => {
    const repo = new MockStudentRepository();
    const createUseCase = new CreateStudentProfileUseCase({ studentRepository: repo });

    await createUseCase.execute({
      userId: 'usr-100',
      educationLevel: 'Secundaria',
      learningGoals: 'Matemáticas',
    });

    await assert.rejects(
      async () => {
        await createUseCase.execute({
          userId: 'usr-100',
          educationLevel: 'Universidad',
          learningGoals: 'Otra meta',
        });
      },
      ConflictError
    );
  });

  it('debe consultar el perfil por userId o studentId', async () => {
    const repo = new MockStudentRepository();
    const createUseCase = new CreateStudentProfileUseCase({ studentRepository: repo });
    const created = await createUseCase.execute({
      userId: 'usr-200',
      educationLevel: 'Universidad',
      learningGoals: 'Programación',
    });

    const getUseCase = new GetStudentProfileUseCase({ studentRepository: repo });
    const found = await getUseCase.execute({ userId: 'usr-200' });
    assert.strictEqual(found.id, created.id);

    const foundById = await getUseCase.execute({ studentId: created.id });
    assert.strictEqual(foundById.userId, 'usr-200');

    await assert.rejects(async () => {
      await getUseCase.execute({ userId: 'unknown' });
    }, NotFoundError);
  });

  it('debe actualizar metas de aprendizaje y nivel', async () => {
    const repo = new MockStudentRepository();
    const createUseCase = new CreateStudentProfileUseCase({ studentRepository: repo });
    const created = await createUseCase.execute({
      userId: 'usr-300',
      educationLevel: 'Universidad',
      learningGoals: 'Inglés Básico',
    });

    const updateUseCase = new UpdateStudentProfileUseCase({ studentRepository: repo });
    const updated = await updateUseCase.execute({
      id: created.id,
      educationLevel: 'Postgrado',
      learningGoals: 'Inglés Avanzado C1',
    });

    assert.strictEqual(updated.educationLevel, 'Postgrado');
    assert.strictEqual(updated.learningGoals, 'Inglés Avanzado C1');
  });
});
