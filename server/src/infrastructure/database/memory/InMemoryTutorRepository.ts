import { ITutorRepository } from '../../../domain/tutor/TutorRepository.js';
import { Tutor, TutorFilterOptions } from '../../../domain/tutor/Tutor.js';
import { TutorSubject } from '../../../domain/tutor/TutorSubject.js';

export class InMemoryTutorRepository implements ITutorRepository {
  private tutors: Tutor[];

  constructor() {
    const now = new Date();
    this.tutors = [
      new Tutor({
        id: '1',
        userId: 'usr-tutor-1',
        fullName: 'Dra. Elena Rostova',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        bio: 'Doctora en Ciencias Matemáticas por la UAM. Más de 10 años preparando alumnos para exámenes de admisión, cálculo multivariable y álgebra lineal.',
        modality: 'online',
        rating: 4.9,
        reviewsCount: 84,
        badges: ['Tutor Top', 'Verificada'],
        isAvailable: true,
        subjects: [
          new TutorSubject({
            id: 'subj-1',
            tutorId: '1',
            subjectName: 'Matemáticas & Cálculo',
            category: 'matematicas',
            pricePerHour: 25,
            description: 'Cálculo diferencial e integral para niveles universitario y preuniversitario',
            isActive: true,
            createdAt: now,
          }),
        ],
        createdAt: now,
      }),
      new Tutor({
        id: '2',
        userId: 'usr-tutor-2',
        fullName: 'Ing. Carlos Mendoza',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        bio: 'Ingeniero de Software Senior con especialidad en Python, React, FastAPI y arquitectura en la nube. Clases prácticas orientadas a proyectos.',
        modality: 'presencial',
        rating: 5.0,
        reviewsCount: 112,
        badges: ['Respuesta Rápida', 'Verificado'],
        isAvailable: true,
        subjects: [
          new TutorSubject({
            id: 'subj-2',
            tutorId: '2',
            subjectName: 'Programación Python & Web',
            category: 'programacion',
            pricePerHour: 30,
            description: 'Desarrollo web fullstack moderno con Python y frameworks frontend',
            isActive: true,
            createdAt: now,
          }),
        ],
        createdAt: now,
      }),
      new Tutor({
        id: '3',
        userId: 'usr-tutor-3',
        fullName: 'Lic. Sarah Jenkins',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        bio: 'Certificada por Cambridge CELTA. Enfoque conversacional para negocios, entrevistas de trabajo en tecnología y exámenes TOEFL / IELTS.',
        modality: 'online',
        rating: 4.8,
        reviewsCount: 63,
        badges: ['Nativo', 'Certificado'],
        isAvailable: true,
        subjects: [
          new TutorSubject({
            id: 'subj-3',
            tutorId: '3',
            subjectName: 'Inglés Avanzado & Business',
            category: 'ingles',
            pricePerHour: 28,
            description: 'Inglés profesional, técnico y preparación IELTS / TOEFL',
            isActive: true,
            createdAt: now,
          }),
        ],
        createdAt: now,
      }),
    ];
  }

  async findById(id: string): Promise<Tutor | null> {
    const tutor = this.tutors.find((t) => t.id === id);
    return tutor || null;
  }

  async findAll(filters: TutorFilterOptions = {}): Promise<Tutor[]> {
    return this.tutors.filter((tutor) => tutor.matchesFilters(filters));
  }

  async create(tutor: Tutor): Promise<Tutor> {
    this.tutors.push(tutor);
    return tutor;
  }

  async update(id: string, tutor: Tutor): Promise<Tutor> {
    const index = this.tutors.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Tutor no encontrado');
    this.tutors[index] = tutor;
    return tutor;
  }
}
