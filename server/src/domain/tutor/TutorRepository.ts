import { Tutor, TutorFilterOptions } from './Tutor.js';

export interface TutorRepository {
  findAll(filters?: TutorFilterOptions): Promise<Tutor[]>;
  findById(id: string): Promise<Tutor | null>;
  create(tutor: Tutor): Promise<Tutor>;
  update(id: string, updates: Partial<Tutor>): Promise<Tutor>;
}

export type ITutorRepository = TutorRepository;
