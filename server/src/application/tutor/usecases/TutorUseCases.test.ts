import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Tutor, TutorFilterOptions } from '../../../domain/tutor/Tutor.js';
import { ITutorRepository } from '../ports/ITutorRepository.js';
import { RegisterTutorUseCase } from './RegisterTutorUseCase.js';
import { GetTutorsListUseCase } from './GetTutorsListUseCase.js';
import { GetTutorByIdUseCase } from './GetTutorByIdUseCase.js';
import { AddTutorSubjectUseCase } from './AddTutorSubjectUseCase.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { IClock } from '../../shared/ports/IClock.js';

class MockTutorRepository implements ITutorRepository {
  public tutors: Map<string, Tutor> = new Map();

  async findById(id: string): Promise<Tutor | null> {
    return this.tutors.get(id) || null;
  }

  async findAll(filters: TutorFilterOptions = {}): Promise<Tutor[]> {
    let list = Array.from(this.tutors.values());
    if (filters.query) {
      list = list.filter((t) =>
        t.subjects.some((s) => s.subjectName.toLowerCase().includes(filters.query!.toLowerCase()))
      );
    }
    return list;
  }

  async create(tutor: Tutor): Promise<Tutor> {
    this.tutors.set(tutor.id, tutor);
    return tutor;
  }

  async update(id: string, tutor: Tutor): Promise<Tutor> {
    this.tutors.set(id, tutor);
    return tutor;
  }
}

class FixedClock implements IClock {
  constructor(private readonly d: Date) {}
  now(): Date {
    return this.d;
  }
}

describe('Tutor UseCases', () => {
  it('debe registrar un tutor nuevo con su materia principal', async () => {
    const repo = new MockTutorRepository();
    const fixedDate = new Date('2026-02-01T12:00:00Z');
    const useCase = new RegisterTutorUseCase({ tutorRepository: repo, clock: new FixedClock(fixedDate) });

    const result = await useCase.execute({
      id: 'tut-1',
      fullName: 'Prof. Alan Turing',
      subjectName: 'Ciencias de la Computación',
      subjectCategory: 'ciencias',
      pricePerHour: 40,
      modality: 'online',
    });

    assert.strictEqual(result.id, 'tut-1');
    assert.strictEqual(result.fullName, 'Prof. Alan Turing');
    assert.strictEqual(result.subjects.length, 1);
    assert.strictEqual(result.subjects[0].subjectName, 'Ciencias de la Computación');
    assert.strictEqual(result.subjects[0].pricePerHour, 40);
    assert.strictEqual(result.createdAt, fixedDate.toISOString());
  });

  it('debe listar tutores aplicando filtros', async () => {
    const repo = new MockTutorRepository();
    const regUseCase = new RegisterTutorUseCase({ tutorRepository: repo });

    await regUseCase.execute({ id: 'tut-math', fullName: 'Math Tutor', subjectName: 'Matemáticas' });
    await regUseCase.execute({ id: 'tut-hist', fullName: 'Hist Tutor', subjectName: 'Historia' });

    const listUseCase = new GetTutorsListUseCase({ tutorRepository: repo });
    const all = await listUseCase.execute();
    assert.strictEqual(all.length, 2);

    const mathOnly = await listUseCase.execute({ search: 'Matemáticas' });
    assert.ok(mathOnly);
  });

  it('debe obtener un tutor por ID o lanzar NotFoundError', async () => {
    const repo = new MockTutorRepository();
    const regUseCase = new RegisterTutorUseCase({ tutorRepository: repo });
    const created = await regUseCase.execute({ id: 'tut-search', fullName: 'Marie Curie', subjectName: 'Química' });

    const getByIdUseCase = new GetTutorByIdUseCase({ tutorRepository: repo });
    const found = await getByIdUseCase.execute('tut-search');
    assert.strictEqual(found.fullName, 'Marie Curie');

    await assert.rejects(async () => {
      await getByIdUseCase.execute('tut-unknown');
    }, NotFoundError);
  });

  it('debe permitir añadir una nueva materia al perfil del tutor', async () => {
    const repo = new MockTutorRepository();
    const regUseCase = new RegisterTutorUseCase({ tutorRepository: repo });
    const created = await regUseCase.execute({ id: 'tut-poly', fullName: 'Polímata', subjectName: 'Filosofía' });

    const addSubjectUseCase = new AddTutorSubjectUseCase({ tutorRepository: repo });
    const updated = await addSubjectUseCase.execute({
      tutorId: created.id,
      subjectName: 'Lógica Simbólica',
      category: 'otro',
      pricePerHour: 35,
    });

    assert.strictEqual(updated.subjects.length, 2);
    assert.ok(updated.subjects.some((s) => s.subjectName === 'Lógica Simbólica'));
  });
});
