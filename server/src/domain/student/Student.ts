import { ValidationError } from '../shared/errors/DomainError.js';

export interface StudentProps {
  id: string;
  userId: string;
  educationLevel: string;
  learningGoals: string;
  createdAt: Date;
  updatedAt: Date;
}

export class Student {
  public readonly id: string;
  public readonly userId: string;
  public educationLevel: string;
  public learningGoals: string;
  public readonly createdAt: Date;
  public updatedAt: Date;

  constructor({
    id,
    userId,
    educationLevel,
    learningGoals,
    createdAt,
    updatedAt,
  }: StudentProps) {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new ValidationError('El id del estudiante es requerido');
    }
    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      throw new ValidationError('El userId vinculado al perfil de estudiante es requerido');
    }
    if (!educationLevel || typeof educationLevel !== 'string' || educationLevel.trim() === '') {
      throw new ValidationError('El nivel educativo (educationLevel) es requerido');
    }
    if (!learningGoals || typeof learningGoals !== 'string' || learningGoals.trim() === '') {
      throw new ValidationError('Las metas de aprendizaje (learningGoals) son requeridas');
    }
    if (!createdAt || !(createdAt instanceof Date) || isNaN(createdAt.getTime())) {
      throw new ValidationError('La fecha de creación createdAt es requerida y debe ser válida');
    }
    if (!updatedAt || !(updatedAt instanceof Date) || isNaN(updatedAt.getTime())) {
      throw new ValidationError('La fecha de actualización updatedAt es requerida y debe ser válida');
    }

    this.id = id.trim();
    this.userId = userId.trim();
    this.educationLevel = educationLevel.trim();
    this.learningGoals = learningGoals.trim();
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  public updateGoals(goals: string): void {
    if (!goals || typeof goals !== 'string' || goals.trim() === '') {
      throw new ValidationError('Las metas de aprendizaje no pueden estar vacías');
    }
    this.learningGoals = goals.trim();
    this.updatedAt = new Date();
  }

  public updateEducationLevel(level: string): void {
    if (!level || typeof level !== 'string' || level.trim() === '') {
      throw new ValidationError('El nivel educativo no puede estar vacío');
    }
    this.educationLevel = level.trim();
    this.updatedAt = new Date();
  }
}
