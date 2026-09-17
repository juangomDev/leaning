import { Tutor, TutorFilterOptions } from '../entities/Tutor.js';

export interface ITutorRepository {
  findAll(filters?: TutorFilterOptions): Promise<Tutor[]>;
  findById(id: string): Promise<Tutor | null>;
  create(tutor: Tutor): Promise<Tutor>;
  update(id: string, updates: Partial<Tutor>): Promise<Tutor>;
}
