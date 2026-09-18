import React from 'react';
import { Link } from 'react-router-dom';

interface EnrolledTutor {
  id: number;
  name: string;
  avatar: string;
  subject: string;
  classesCount: number;
  lastClass: string;
  rate: number;
  rating: number;
}

export const MisTutores: React.FC = () => {
  const tutors: EnrolledTutor[] = [
    {
      id: 1,
      name: 'Dra. Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      subject: 'Matemáticas & Cálculo',
      classesCount: 8,
      lastClass: '12 Sep 2026',
      rate: 25,
      rating: 4.9,
    },
    {
      id: 2,
      name: 'Ing. Carlos Mendoza',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      subject: 'Programación Python & Lógica',
      classesCount: 6,
      lastClass: 'Hoy (Pendiente)',
      rate: 30,
      rating: 5.0,
    },
    {
      id: 3,
      name: 'Sarah Jenkins',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      subject: 'Inglés Nativo & TOEFL',
      classesCount: 4,
      lastClass: '28 Ago 2026',
      rate: 22,
      rating: 4.8,
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Mis Tutores</h1>
          <p className="text-slate-500 text-sm mt-1">Profesores con los que has tomado clases o tienes agendadas sesiones</p>
        </div>
        <Link
          to="/explorar"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <i className="fa-solid fa-magnifying-glass text-xs"></i> Explorar Más Tutores
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {tutors.map((t) => (
          <div
            key={t.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-brand-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-100"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 text-base truncate">{t.name}</h3>
                  <p className="text-xs font-semibold text-brand-600 mt-0.5 truncate">{t.subject}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-amber-500">
                    <i className="fa-solid fa-star"></i>
                    <span className="font-bold text-slate-800">{t.rating}</span>
                    <span className="text-slate-400">· ${t.rate}/h</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs mb-4">
                <div className="flex justify-between text-slate-600">
                  <span>Clases tomadas:</span>
                  <span className="font-bold text-slate-900">{t.classesCount} sesiones</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Última sesión:</span>
                  <span className="font-bold text-slate-900">{t.lastClass}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => alert(`Iniciando chat con ${t.name}...`)}
                className="flex-1 py-2 border border-slate-200 hover:border-brand-300 text-slate-700 font-bold rounded-xl text-xs transition-colors"
              >
                <i className="fa-regular fa-comment-dots mr-1"></i> Mensaje
              </button>
              <Link
                to={`/tutores/${t.id}`}
                className="flex-1 py-2 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs text-center shadow-sm transition-all"
              >
                Agendar Clase
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
