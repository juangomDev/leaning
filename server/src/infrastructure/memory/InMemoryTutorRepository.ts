import { ITutorRepository } from '../../domain/repositories/ITutorRepository.js';
import { Tutor, TutorFilterOptions } from '../../domain/entities/Tutor.js';

export class InMemoryTutorRepository implements ITutorRepository {
  private tutors: Tutor[];

  constructor() {
    this.tutors = [
      new Tutor({
        id: '1',
        fullName: 'Dra. Elena Rostova',
        avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
        subjectName: 'Matemáticas & Cálculo',
        subjectCategory: 'matematicas',
        bio: 'Doctora en Ciencias Matemáticas por la UAM. Más de 10 años preparando alumnos para exámenes de admisión, cálculo multivariable y álgebra lineal.',
        pricePerHour: 25,
        modality: 'online',
        rating: 4.9,
        reviewsCount: 84,
        badges: ['Tutor Top', 'Verificada'],
        isAvailable: true,
      }),
      new Tutor({
        id: '2',
        fullName: 'Ing. Carlos Mendoza',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        subjectName: 'Programación Python & Web',
        subjectCategory: 'programacion',
        bio: 'Ingeniero de Software Senior con especialidad en Python, React, FastAPI y arquitectura en la nube. Clases prácticas orientadas a proyectos.',
        pricePerHour: 30,
        modality: 'presencial',
        rating: 5.0,
        reviewsCount: 112,
        badges: ['Respuesta Rápida', 'Verificado'],
        isAvailable: true,
      }),
      new Tutor({
        id: '3',
        fullName: 'Sarah Jenkins',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
        subjectName: 'Inglés Nativo & TOEFL',
        subjectCategory: 'ingles',
        bio: 'Profesora nativa certificada CELTA de Cambridge. Clases personalizadas de conversación fluida para negocios, entrevistas y TOEFL.',
        pricePerHour: 22,
        modality: 'online',
        rating: 4.8,
        reviewsCount: 65,
        badges: ['Nativa', 'Verificada'],
        isAvailable: true,
      }),
      new Tutor({
        id: '4',
        fullName: 'Prof. Miguel Ángel',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
        subjectName: 'Álgebra y Física Básica',
        subjectCategory: 'matematicas',
        bio: 'Licenciado en Física aplicada. Especialista en ayudar a alumnos de secundaria y bachillerato a dominar conceptos complejos.',
        pricePerHour: 20,
        modality: 'presencial',
        rating: 4.9,
        reviewsCount: 43,
        badges: ['Paciencia Garantizada'],
        isAvailable: true,
      }),
      new Tutor({
        id: '5',
        fullName: 'Valeria Gómez',
        avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=300&q=80',
        subjectName: 'Bases de Datos & SQL',
        subjectCategory: 'programacion',
        bio: 'Arquitecta de bases de datos relacionales y NoSQL. Domina SQL, PostgreSQL, modelado entidad-relación y consultas analíticas.',
        pricePerHour: 28,
        modality: 'online',
        rating: 4.7,
        reviewsCount: 29,
        badges: ['Verificada'],
        isAvailable: true,
      }),
      new Tutor({
        id: '6',
        fullName: 'David Smith',
        avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&q=80',
        subjectName: 'Inglés Conversacional',
        subjectCategory: 'ingles',
        bio: 'Profesor bilingüe con enfoque en fluidez, pronunciación y reducción de acento para profesionales de tecnología y negocios.',
        pricePerHour: 24,
        modality: 'online',
        rating: 4.9,
        reviewsCount: 91,
        badges: ['Tutor Top'],
        isAvailable: true,
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
