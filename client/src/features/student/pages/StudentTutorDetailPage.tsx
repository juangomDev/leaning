import React from 'react';
import { useParams, Link } from 'react-router-dom';

interface TutorDetail {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  subjects: string[];
  bio: string;
  education: string;
  experienceYears: number;
  languages: string[];
  reviews: { id: string; student: string; rating: number; date: string; comment: string }[];
}

const TUTORS_MAP: Record<string, TutorDetail> = {
  tut_01: {
    id: 'tut_01',
    name: 'Dra. Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    headline: 'PhD en Física y Matemáticas Puras',
    hourlyRate: 25.0,
    rating: 4.9,
    totalReviews: 84,
    subjects: ['Cálculo Diferencial', 'Física Cuántica', 'Álgebra Lineal', 'Ecuaciones Diferenciales'],
    bio: 'Cuento con más de 8 años de experiencia docente a nivel universitario e investigación científica. Mi método pedagógico se basa en desglosar problemas complejos en conceptos intuitivos y aplicaciones prácticas para que nunca tengas que memorizar sin comprender.',
    education: 'Doctorado en Ciencias Físicas por la Universidad Complutense',
    experienceYears: 8,
    languages: ['Español (Nativo)', 'Inglés (C2)'],
    reviews: [
      { id: 'r1', student: 'Mateo González', rating: 5, date: 'Hace 3 días', comment: 'Elena me salvó el semestre en Cálculo III. Su paciencia y explicaciones visuales son excepcionales.' },
      { id: 'r2', student: 'Camila R.', rating: 5, date: 'Hace 1 semana', comment: 'Excelente tutora. Domina a la perfección los teoremas y se adapta a tu ritmo.' },
    ],
  },
  tut_02: {
    id: 'tut_02',
    name: 'Ing. Carlos Mendoza',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    headline: 'Full-Stack Developer & Ex-Google Lead',
    hourlyRate: 35.0,
    rating: 5.0,
    totalReviews: 120,
    subjects: ['Programación Web', 'Estructuras de Datos', 'Python & IA', 'Arquitectura de Software'],
    bio: 'Ingeniero de Software con 10 años en la industria tech. Te ayudo desde fundamentos de programación y código limpio hasta resolución de algoritmos tipo LeetCode para entrevistas de trabajo.',
    education: 'Ingeniería en Sistemas Computacionales por el Tecnológico de Monterrey',
    experienceYears: 10,
    languages: ['Español (Nativo)', 'Inglés (Fluido)'],
    reviews: [
      { id: 'r3', student: 'Andrés V.', rating: 5, date: 'Hace 5 días', comment: 'Increíble mentor. Revisamos mi proyecto de React y me enseñó patrones que ningún tutorial explica.' },
    ],
  },
  tut_03: {
    id: 'tut_03',
    name: 'Lic. Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    headline: 'Examinadora TOEFL & Especialista en Conversación',
    hourlyRate: 22.0,
    rating: 4.8,
    totalReviews: 65,
    subjects: ['Inglés Conversacional', 'Preparación TOEFL', 'Inglés Corporativo'],
    bio: 'Profesora nativa certificada CELTA de la Universidad de Cambridge. Clases 100% interactivas diseñadas para perder el miedo a hablar en público y perfeccionar la fonética.',
    education: 'BA in English Literature & CELTA Certified',
    experienceYears: 6,
    languages: ['Inglés (Nativo)', 'Español (Intermedio)'],
    reviews: [
      { id: 'r4', student: 'Valeria M.', rating: 5, date: 'Hace 2 semanas', comment: 'Obtuve 108 en mi TOEFL gracias a sus simulacros intensivos. Muy recomendada.' },
    ],
  },
};

export const StudentTutorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const tutor = (id && TUTORS_MAP[id]) ? TUTORS_MAP[id] : TUTORS_MAP['tut_01'];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Breadcrumb */}
      <div>
        <Link
          to="/student/tutors"
          className="text-xs text-brand-600 font-bold hover:underline inline-flex items-center gap-1.5 mb-2"
        >
          <i className="fa-solid fa-arrow-left"></i> Volver a Explorar Tutores
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Tutor Detailed Bio & Reviews */}
        <div className="lg:col-span-2 space-y-6">
          {/* Header Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-start gap-5">
            <img
              src={tutor.avatar}
              alt={tutor.name}
              className="w-24 h-24 rounded-3xl object-cover border-2 border-brand-100 shadow-sm shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900">{tutor.name}</h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                  <i className="fa-solid fa-shield-check"></i> Verificado
                </span>
              </div>
              <p className="text-xs text-brand-600 font-bold mt-0.5">{tutor.headline}</p>

              <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 font-bold text-amber-500">
                  <i className="fa-solid fa-star"></i> {tutor.rating}
                  <span className="text-slate-400 font-normal">({tutor.totalReviews} reseñas)</span>
                </span>
                <span>•</span>
                <span><i className="fa-solid fa-briefcase text-slate-400 mr-1"></i>{tutor.experienceYears} años exp.</span>
                <span>•</span>
                <span><i className="fa-solid fa-language text-slate-400 mr-1"></i>{tutor.languages.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* About Me & Methodology */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Sobre el Profesor</h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {tutor.bio}
            </p>

            <div className="pt-3 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Formación Académica</h3>
              <p className="text-xs text-slate-600 flex items-center gap-2">
                <i className="fa-solid fa-graduation-cap text-brand-600 text-sm"></i>
                {tutor.education}
              </p>
            </div>
          </div>

          {/* Subjects Taught */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Materias y Especialidades</h2>
            <div className="flex flex-wrap gap-2">
              {tutor.subjects.map(s => (
                <span key={s} className="px-3 py-1.5 rounded-xl bg-brand-50 text-brand-700 font-bold text-xs border border-brand-200/80">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Student Reviews */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Reseñas de Alumnos ({tutor.reviews.length})
              </h2>
              <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                <i className="fa-solid fa-star"></i> {tutor.rating} de 5.0
              </span>
            </div>

            <div className="space-y-3 divide-y divide-slate-100">
              {tutor.reviews.map(r => (
                <div key={r.id} className="pt-3 first:pt-0 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800">{r.student}</span>
                    <span className="text-slate-400 text-[11px]">{r.date}</span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-[10px]">
                    {[...Array(r.rating)].map((_, i) => (
                      <i key={i} className="fa-solid fa-star"></i>
                    ))}
                  </div>
                  <p className="text-xs text-slate-600 italic mt-1">"{r.comment}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5 sticky top-6">
            <div className="flex items-baseline justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-500 uppercase">Tarifa por hora:</span>
              <div className="text-right">
                <span className="text-2xl font-black text-brand-700">${tutor.hourlyRate.toFixed(2)}</span>
                <span className="text-xs text-slate-400 font-semibold ml-1">USD</span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-bolt text-amber-500 w-4 text-center"></i>
                <span>Confirmación inmediata garantizada</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-video text-brand-600 w-4 text-center"></i>
                <span>Clases 100% online por Aula Virtual</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-clock-rotate-left text-emerald-600 w-4 text-center"></i>
                <span>Reprogramación gratuita hasta 2h antes</span>
              </div>
            </div>

            <Link
              to={`/student/bookings/new?tutorId=${tutor.id}`}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs text-center transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <i className="fa-solid fa-calendar-check"></i>
              <span>Agendar Clase Ahora</span>
            </Link>

            <p className="text-[10px] text-slate-400 text-center">
              Pago 100% seguro con tu Billetera EduConnect o Tarjeta
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
