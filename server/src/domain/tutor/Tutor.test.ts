import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Tutor } from './Tutor.js';
import { TutorSubject } from './TutorSubject.js';
import { TutorFactory } from './TutorFactory.js';
import { SubjectCategory } from './value-objects/SubjectCategory.js';
import { ValidationError } from '../shared/errors/DomainError.js';

describe('Módulo Tutor: Entidades, Factory y Value Objects', () => {
  it('debe crear un tutor con su materia inicial usando TutorFactory', () => {
    const tutor = TutorFactory.create({
      userId: 'usr-tut-1',
      fullName: 'Dra. Elena Rostova',
      subjectName: 'Cálculo Multivariable',
      subjectCategory: 'matematicas',
      pricePerHour: 28,
    });

    assert.ok(tutor.id);
    assert.strictEqual(tutor.fullName, 'Dra. Elena Rostova');
    assert.strictEqual(tutor.subjects.length, 1);
    assert.strictEqual(tutor.subjectName, 'Cálculo Multivariable');
    assert.strictEqual(tutor.subjectCategory, 'matematicas');
    assert.strictEqual(tutor.pricePerHour, 28);
  });

  it('debe validar la categoría mediante el Value Object SubjectCategory', () => {
    const cat = SubjectCategory.create('Programacion');
    assert.strictEqual(cat.value, 'programacion');

    assert.throws(
      () => SubjectCategory.create('categoria-fantasma'),
      (err: any) => err instanceof ValidationError && err.message.includes('Categoría de materia inválida')
    );
  });

  it('debe permitir añadir materias adicionales y recalcular el rating', () => {
    const tutor = TutorFactory.create({
      userId: 'usr-tut-2',
      fullName: 'Ing. Carlos',
    });

    const extraSubject = new TutorSubject({
      id: 'subj-react',
      tutorId: tutor.id,
      subjectName: 'React y Next.js',
      category: 'programacion',
      pricePerHour: 35,
      description: 'Frontend moderno',
      isActive: true,
      createdAt: new Date(),
    });

    tutor.addSubject(extraSubject);
    assert.strictEqual(tutor.subjects.length, 2);

    tutor.addReviewRating(4);
    assert.strictEqual(tutor.rating, 4.0);
    assert.strictEqual(tutor.reviewsCount, 1);
  });
});
