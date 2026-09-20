import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface Tutor {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  subjects: string[];
  bio: string;
  isVerified: boolean;
}

const TUTORS_CATALOG: Tutor[] = [
  {
    id: 'tut_01',
    name: 'Dra. Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    headline: 'PhD en Física y Matemáticas Puras',
    hourlyRate: 25.0,
    rating: 4.9,
    totalReviews: 84,
    subjects: ['Cálculo', 'Física Cuántica', 'Álgebra Lineal'],
    bio: 'Más de 8 años enseñando cálculo diferencial, ecuaciones diferenciales y física para estudiantes de ingeniería y ciencias.',
    isVerified: true,
  },
  {
    id: 'tut_02',
    name: 'Ing. Carlos Mendoza',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    headline: 'Full-Stack Developer & Ex-Google Lead',
    hourlyRate: 35.0,
    rating: 5.0,
    totalReviews: 120,
    subjects: ['Programación Web', 'Estructuras de Datos', 'Python'],
    bio: 'Mentor de código para desarrolladores junior y universitarios. Especialista en JavaScript, Python y algoritmos.',
    isVerified: true,
  },
  {
    id: 'tut_03',
    name: 'Lic. Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    headline: 'Examinadora TOEFL & Especialista en Conversación',
    hourlyRate: 22.0,
    rating: 4.8,
    totalReviews: 65,
    subjects: ['Inglés', 'Preparación TOEFL', 'Negocios'],
    bio: 'Nativa británica enfocada en fluidez, pronunciación y preparación para entrevistas en empresas internacionales.',
    isVerified: true,
  },
  {
    id: 'tut_04',
    name: 'Dr. Alejandro Peña',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    headline: 'Catedrático de Química Orgánica y Bioquímica',
    hourlyRate: 28.0,
    rating: 4.7,
    totalReviews: 42,
    subjects: ['Química Orgánica', 'Bioquímica', 'Biología Celular'],
    bio: 'Ayudo a estudiantes de medicina y farmacia a comprender las rutas metabólicas y síntesis orgánicas con metodología interactiva.',
    isVerified: true,
  },
];

const CATEGORIES = ['Todas', 'Matemáticas', 'Física', 'Programación', 'Inglés', 'Química'];

export const StudentTutorsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [maxPrice, setMaxPrice] = useState<number>(50);

  const filteredTutors = TUTORS_CATALOG.filter(tutor => {
    const matchesSearch =
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.headline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.subjects.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'Todas' ||
      tutor.subjects.some(s => s.toLowerCase().includes(selectedCategory.toLowerCase()));

    const matchesPrice = tutor.hourlyRate <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Explorar Tutores Verificados</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Conecta con expertos en tus materias y agenda clases individuales a tu propio ritmo
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        {/* Search input and category pills */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por profesor, tema o tecnología..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Max price slider */}
          <div className="flex items-center gap-3 px-3 py-1.5 bg-slate-50 rounded-xl border border-slate-200/80 text-xs">
            <span className="text-slate-500 font-semibold whitespace-nowrap">Máx: ${maxPrice}/h</span>
            <input
              type="range"
              min="15"
              max="60"
              step="5"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 accent-brand-600"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase mr-1">Materias:</span>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat
                  ? 'bg-brand-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Tutors Grid */}
      {filteredTutors.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80">
          <i className="fa-solid fa-user-xmark text-3xl text-slate-300 mb-2"></i>
          <p className="text-sm font-bold text-slate-700">No se encontraron tutores con esos filtros</p>
          <p className="text-xs text-slate-400 mt-1">Prueba ajustando el precio máximo o cambiando la materia.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredTutors.map(tutor => (
            <div
              key={tutor.id}
              className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={tutor.avatar}
                      alt={tutor.name}
                      className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-sm font-bold text-slate-900">{tutor.name}</h3>
                        {tutor.isVerified && (
                          <i className="fa-solid fa-circle-check text-brand-600 text-xs" title="Tutor Verificado"></i>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-1">{tutor.headline}</p>
                      <div className="flex items-center gap-2 mt-1 text-xs">
                        <span className="text-amber-500 font-bold flex items-center gap-1">
                          <i className="fa-solid fa-star text-[10px]"></i> {tutor.rating}
                        </span>
                        <span className="text-slate-400 text-[11px]">({tutor.totalReviews} reseñas)</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-lg font-black text-brand-700">${tutor.hourlyRate}</span>
                    <span className="text-[10px] text-slate-400 block font-semibold">/ hora</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mb-3 line-clamp-2 leading-relaxed">
                  {tutor.bio}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tutor.subjects.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                <Link
                  to={`/student/tutors/${tutor.id}`}
                  className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs text-center transition-colors"
                >
                  Ver Perfil
                </Link>
                <Link
                  to={`/student/bookings/new?tutorId=${tutor.id}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs text-center transition-colors shadow-xs"
                >
                  Agendar Clase
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
