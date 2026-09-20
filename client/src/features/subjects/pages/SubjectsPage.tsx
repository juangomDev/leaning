import React from 'react';
import { Link } from 'react-router-dom';

export interface SubjectCategoryInfo {
  slug: string;
  name: string;
  description: string;
  tutorCount: number;
  icon: string;
  color: string;
  subtopics: string[];
}

export const SUBJECTS_DATA: SubjectCategoryInfo[] = [
  {
    slug: 'matematicas',
    name: 'Matemáticas',
    description: 'Domina los números, el cálculo y el razonamiento analítico para secundaria y universidad.',
    tutorCount: 320,
    icon: 'fa-calculator',
    color: 'text-blue-600 bg-blue-50 border-blue-200',
    subtopics: ['Álgebra Lineal', 'Cálculo Diferencial e Integral', 'Geometría Analítica', 'Estadística y Probabilidad'],
  },
  {
    slug: 'programacion',
    name: 'Programación & TI',
    description: 'Aprende a programar, construir aplicaciones web y dominar algoritmos con profesionales senior.',
    tutorCount: 210,
    icon: 'fa-code',
    color: 'text-purple-600 bg-purple-50 border-purple-200',
    subtopics: ['Python para Principiantes', 'JavaScript & React', 'Bases de Datos SQL', 'Estructuras de Datos'],
  },
  {
    slug: 'idiomas',
    name: 'Idiomas',
    description: 'Fluidez comunicativa, preparación para exámenes internacionales y conversación profesional.',
    tutorCount: 450,
    icon: 'fa-language',
    color: 'text-amber-600 bg-amber-50 border-amber-200',
    subtopics: ['Inglés Conversacional', 'Preparación TOEFL/IELTS', 'Francés Básico a Avanzado', 'Alemán'],
  },
  {
    slug: 'ciencias',
    name: 'Ciencias Naturales',
    description: 'Comprende el universo material y los fenómenos físicos, químicos y biológicos fundamentales.',
    tutorCount: 180,
    icon: 'fa-atom',
    color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    subtopics: ['Física Mecánica y Óptica', 'Química General y Orgánica', 'Biología Celular', 'Termodinámica'],
  },
  {
    slug: 'musica',
    name: 'Música & Arte',
    description: 'Desarrolla tu oído, técnica instrumental y teoría musical con músicos experimentados.',
    tutorCount: 140,
    icon: 'fa-music',
    color: 'text-rose-600 bg-rose-50 border-rose-200',
    subtopics: ['Piano y Teclado', 'Guitarra Clásica y Eléctrica', 'Teoría y Armonía Musical', 'Canto y Técnica Vocal'],
  },
  {
    slug: 'humanidades',
    name: 'Humanidades & Redacción',
    description: 'Potencia tu redacción académica, análisis histórico, filosofía y habilidades de comunicación.',
    tutorCount: 120,
    icon: 'fa-book',
    color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
    subtopics: ['Redacción de Tesis y Ensayos', 'Historia Universal', 'Filosofía y Lógica', 'Literatura'],
  },
];

export const SubjectsPage: React.FC = () => {
  return (
    <div className="bg-slate-50 min-h-screen py-12 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-600 text-xs font-extrabold uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
            Catálogo Académico
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Explora todas las materias
          </h1>
          <p className="mt-3 text-slate-600 text-lg">
            Encuentra tutores especializados en más de 60 áreas académicas para todos los niveles educativos.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {SUBJECTS_DATA.map((subject) => (
            <div
              key={subject.slug}
              className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-brand-300 transition-all group"
            >
              <div>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border ${subject.color}`}>
                  <i className={`fa-solid ${subject.icon} text-2xl`}></i>
                </div>

                <div className="flex items-center justify-between gap-2 mb-2">
                  <h2 className="text-xl font-extrabold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {subject.name}
                  </h2>
                  <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {subject.tutorCount}+ tutores
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-6">
                  {subject.description}
                </p>

                <div className="space-y-2 mb-6">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Temas más solicitados:</p>
                  <div className="flex flex-wrap gap-1.5">
                    {subject.subtopics.map((sub, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-50 border border-slate-200/70 text-slate-700 px-2.5 py-1 rounded-lg"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  to={`/subjects/${subject.slug}`}
                  className="text-xs font-bold text-brand-600 hover:text-brand-800 flex items-center gap-1.5"
                >
                  Ver materia y tutores <i className="fa-solid fa-arrow-right text-[10px]"></i>
                </Link>

                <Link
                  to={`/tutors?categoria=${subject.slug}`}
                  className="text-xs text-slate-400 hover:text-slate-600"
                >
                  Filtrar catálogo
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Need Help finding Subject CTA */}
        <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-md text-center max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold">¿No encuentras la materia o examen específico?</h2>
          <p className="text-slate-400 text-sm mt-2 max-w-xl mx-auto">
            Tenemos una red activa de más de 1,500 docentes. Cuéntanos qué necesitas aprender y te recomendaremos al profesor ideal.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/contact"
              className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl transition-all shadow"
            >
              Solicitar materia a medida
            </Link>
            <Link
              to="/tutors"
              className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all"
            >
              Explorar todos los profesores
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
