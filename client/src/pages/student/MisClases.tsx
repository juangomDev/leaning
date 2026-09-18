import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface ClassSession {
  id: number;
  tutorName: string;
  tutorAvatar: string;
  subject: string;
  date: string;
  time: string;
  modality: 'online' | 'presencial';
  price: number;
  status: 'imminent' | 'confirmed' | 'completed' | 'cancelled';
}

export const MisClases: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'proximas' | 'completadas' | 'canceladas'>('proximas');

  const upcomingClasses: ClassSession[] = [
    {
      id: 1,
      tutorName: 'Ing. Carlos Mendoza',
      tutorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
      subject: 'Programación Python & Lógica Algorítmica',
      date: 'Hoy, 16 Sep 2026',
      time: '04:00 PM — 05:00 PM',
      modality: 'online',
      price: 30,
      status: 'imminent',
    },
    {
      id: 2,
      tutorName: 'Dra. Elena Rostova',
      tutorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
      subject: 'Cálculo Integral & Series de Fourier',
      date: 'Mañana, 17 Sep 2026',
      time: '10:00 AM — 11:00 AM',
      modality: 'online',
      price: 25,
      status: 'confirmed',
    },
    {
      id: 3,
      tutorName: 'Sarah Jenkins',
      tutorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
      subject: 'Inglés TOEFL Speaking & Vocabulario Técnico',
      date: 'Jueves, 25 Sep 2026',
      time: '05:00 PM — 06:00 PM',
      modality: 'online',
      price: 22,
      status: 'confirmed',
    },
  ];

  const completedClasses: ClassSession[] = [
    {
      id: 4,
      tutorName: 'Prof. Miguel Ángel',
      tutorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80',
      subject: 'Álgebra Lineal & Espacios Vectoriales',
      date: '10 Sep 2026',
      time: '11:00 AM — 12:00 PM',
      modality: 'presencial',
      price: 20,
      status: 'completed',
    },
    {
      id: 5,
      tutorName: 'Valeria Gómez',
      tutorAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=120&q=80',
      subject: 'Modelado Relacional de Bases de Datos SQL',
      date: '03 Sep 2026',
      time: '03:00 PM — 04:00 PM',
      modality: 'online',
      price: 28,
      status: 'completed',
    },
  ];

  const canceledClasses: ClassSession[] = [];

  const getList = (): ClassSession[] => {
    if (activeTab === 'proximas') return upcomingClasses;
    if (activeTab === 'completadas') return completedClasses;
    return canceledClasses;
  };

  const list = getList();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Mis Clases</h1>
          <p className="text-slate-500 text-sm mt-1">Gestiona tu agenda de tutorías y conéctate a tus sesiones</p>
        </div>
        <Link
          to="/explorar"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <i className="fa-solid fa-plus text-xs"></i> Reservar Nueva Clase
        </Link>
      </div>

      {/* Tabs Switcher */}
      <div className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-sm flex max-w-md">
        <button
          onClick={() => setActiveTab('proximas')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'proximas'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Próximas ({upcomingClasses.length})
        </button>
        <button
          onClick={() => setActiveTab('completadas')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'completadas'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Historial ({completedClasses.length})
        </button>
        <button
          onClick={() => setActiveTab('canceladas')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'canceladas'
              ? 'bg-brand-600 text-white shadow-md'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Canceladas (0)
        </button>
      </div>

      {/* Classes List */}
      <div className="space-y-4">
        {list.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center text-slate-400">
            <i className="fa-solid fa-calendar-xmark text-4xl mb-3 block text-slate-300"></i>
            <h3 className="font-bold text-slate-700 text-base">No tienes clases en esta sección</h3>
            <p className="text-xs text-slate-500 mt-1">Explora tutores disponibles para programar tu próxima clase.</p>
            <Link
              to="/explorar"
              className="mt-4 inline-block px-5 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-xs shadow-sm hover:bg-brand-700 transition-colors"
            >
              Explorar Tutores
            </Link>
          </div>
        ) : (
          list.map((c) => (
            <div
              key={c.id}
              className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 ${
                c.status === 'imminent'
                  ? 'border-brand-500 ring-2 ring-brand-100'
                  : 'border-slate-200/80 hover:border-brand-200'
              }`}
            >
              <div className="flex items-start gap-4 min-w-0">
                <img
                  src={c.tutorAvatar}
                  alt={c.tutorName}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-100 shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    {c.status === 'imminent' && (
                      <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-extrabold uppercase animate-pulse">
                        En 15 minutos
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                      <i className={`fa-solid ${c.modality === 'online' ? 'fa-laptop' : 'fa-location-dot'} mr-1`}></i>
                      {c.modality === 'online' ? 'Aula Virtual' : 'Presencial'}
                    </span>
                    <span className="text-xs font-bold text-slate-900">${c.price} USD</span>
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 truncate">{c.subject}</h3>
                  <p className="text-xs text-brand-600 font-bold mt-0.5">{c.tutorName}</p>

                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1.5">
                      <i className="fa-solid fa-calendar text-slate-400"></i> {c.date}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <i className="fa-solid fa-clock text-slate-400"></i> {c.time}
                    </span>
                  </div>
                </div>
              </div>

              {/* Class Actions */}
              <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                {activeTab === 'proximas' ? (
                  <>
                    <button
                      onClick={() => alert('Para reprogramar tu sesión, coordina con tu tutor o soporte.')}
                      className="flex-1 md:flex-none px-4 py-2.5 border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold rounded-xl text-xs transition-colors"
                    >
                      Reprogramar
                    </button>
                    <Link
                      to="/aula-virtual"
                      className="flex-1 md:flex-none px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <i className="fa-solid fa-video text-xs"></i> Entrar al Aula
                    </Link>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => alert('¡Gracias! Tu reseña ha sido enviada al tutor.')}
                      className="flex-1 md:flex-none px-4 py-2.5 border border-slate-200 hover:border-brand-400 text-slate-700 font-bold rounded-xl text-xs transition-colors"
                    >
                      Dejar Reseña
                    </button>
                    <Link
                      to="/explorar"
                      className="flex-1 md:flex-none px-4 py-2.5 bg-brand-600 text-white font-bold rounded-xl text-xs shadow-sm hover:bg-brand-700 transition-colors"
                    >
                      Volver a Reservar
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
