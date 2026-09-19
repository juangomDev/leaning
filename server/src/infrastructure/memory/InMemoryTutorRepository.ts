import { ITutorRepository } from '../../domain/tutor/TutorRepository.js';
import { Tutor, TutorFilterOptions } from '../../domain/tutor/Tutor.js';
import { TutorSubject } from '../../domain/tutor/TutorSubject.js';

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
        fullName: 'Sarah Jenkins',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        bio: 'Profesora nativa certificada CELTA de Cambridge. Clases personalizadas de conversación fluida para negocios, entrevistas y TOEFL.',
        modality: 'online',
        rating: 4.8,
        reviewsCount: 65,
        badges: ['Nativa', 'Verificada'],
        isAvailable: true,
        subjects: [
          new TutorSubject({
            id: 'subj-3',
            tutorId: '3',
            subjectName: 'Inglés Nativo & TOEFL',
            category: 'ingles',
            pricePerHour: 22,
            description: 'Preparación para exámenes internacionales y conversación fluida',
            isActive: true,
            createdAt: now,
          }),
        ],
        createdAt: now,
      }),
      new Tutor({
        id: '4',
        userId: 'usr-tutor-4',
        fullName: 'Prof. Miguel Ángel',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        bio: 'Licenciado en Física aplicada. Especialista en ayudar a alumnos de secundaria y bachillerato a dominar conceptos complejos.',
        modality: 'presencial',
        rating: 4.9,
        reviewsCount: 43,
        badges: ['Paciencia Garantizada'],
        isAvailable: true,
        subjects: [
          new TutorSubject({
            id: 'subj-4',
            tutorId: '4',
            subjectName: 'Álgebra y Física Básica',
            category: 'matematicas',
            pricePerHour: 20,
            description: 'Refuerzo escolar en física y matemática aplicada',
            isActive: true,
            createdAt: now,
          }),
        ],
        createdAt: now,
      }),
      new Tutor({
        id: '5',
        userId: 'usr-tutor-5',
        fullName: 'Valeria Gómez',
        avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
        bio: 'Arquitecta de bases de datos relacionales y NoSQL. Domina SQL, PostgreSQL, modelado entidad-relación y consultas analíticas.',
        modality: 'online',
        rating: 4.7,
        reviewsCount: 29,
        badges: ['Verificada'],
        isAvailable: true,
        subjects: [
          new TutorSubject({
            id: 'subj-5',
            tutorId: '5',
            subjectName: 'Bases de Datos & SQL',
            category: 'programacion',
            pricePerHour: 28,
            description: 'Diseño de modelos relacionales y optimización de consultas SQL',
            isActive: true,
            createdAt: now,
          }),
        ],
        createdAt: now,
      }),
      new Tutor({
        id: '6',
        userId: 'usr-tutor-6',
        fullName: 'David Smith',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
        bio: 'Profesor bilingüe con enfoque en fluidez, pronunciación y reducción de acento para profesionales de tecnología y negocios.',
        modality: 'online',
        rating: 4.9,
        reviewsCount: 91,
        badges: ['Tutor Top'],
        isAvailable: true,
        subjects: [
          new TutorSubject({
            id: 'subj-6',
            tutorId: '6',
            subjectName: 'Inglés Conversacional',
            category: 'ingles',
            pricePerHour: 24,
            description: 'Inglés de negocios y conversación profesional',
            isActive: true,
            createdAt: now,
          }),
        ],
        createdAt: now,
      }),
    ];
  }

  async findAll(filters: TutorFilterOptions = {}): Promise<Tutor[]> {
    return this.tutors.filter((tutor) => tutor.matchesFilters(filters));
  }

  async findById(id: string): Promise<Tutor | null> {
    return (
      this.tutors.find((t) => t.id === id || String(t.id).startsWith(String(id))) ||
      this.tutors[parseInt(id, 10) - 1] ||
      null
    );
  }

  async create(tutor: Tutor): Promise<Tutor> {
    this.tutors.push(tutor);
    return tutor;
  }

  async update(id: string, updates: Partial<Tutor>): Promise<Tutor> {
    const index = this.tutors.findIndex((t) => t.id === id);
    if (index === -1) throw new Error('Tutor no encontrado');
    Object.assign(this.tutors[index], updates);
    return this.tutors[index];
  }
}
