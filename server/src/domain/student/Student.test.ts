import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Student } from './Student.js';
import { StudentFactory } from './StudentFactory.js';
import { ValidationError } from '../shared/errors/DomainError.js';

describe('Módulo Student: Entidad y Factory', () => {
  it('debe crear un estudiante con StudentFactory', () => {
    const student = StudentFactory.create({
      userId: 'usr-100',
      educationLevel: 'Secundaria',
      learningGoals: 'Preparación para cálculo',
    });

    assert.ok(student.id);
    assert.strictEqual(student.userId, 'usr-100');
    assert.strictEqual(student.educationLevel, 'Secundaria');
    assert.strictEqual(student.learningGoals, 'Preparación para cálculo');
  });

  it('debe permitir actualizar metas y nivel', () => {
    const student = StudentFactory.create({
      userId: 'usr-101',
      educationLevel: 'Bachillerato',
      learningGoals: 'Física aplicada',
    });

    student.updateGoals('Física y Álgebra');
    student.updateEducationLevel('Universidad');

    assert.strictEqual(student.learningGoals, 'Física y Álgebra');
    assert.strictEqual(student.educationLevel, 'Universidad');
  });

  it('debe validar que las metas o nivel no sean vacíos', () => {
    const student = StudentFactory.create({
      userId: 'usr-102',
      educationLevel: 'Secundaria',
      learningGoals: 'Inglés',
    });

    assert.throws(() => student.updateGoals(''), ValidationError);
    assert.throws(() => student.updateEducationLevel('  '), ValidationError);
  });
});
