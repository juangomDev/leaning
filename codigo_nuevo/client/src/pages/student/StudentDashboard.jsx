import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingsService } from '../../services/bookingsService';

export const StudentDashboard = () => {
  const { profile, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentName = profile?.full_name || user?.email?.split('@')[0] || 'Alejandro';

  useEffect(() => {
    bookingsService.getBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
            <i className="fa-solid fa-graduation-cap"></i> Portal del Alumno
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            ¡Bienvenido de vuelta, {studentName}! 👋
          </h1>
          <p className="text-brand-100 text-sm leading-relaxed">
            Tu próxima clase en vivo de <strong>Algoritmos & Programación Python</strong> comienza en 15 minutos.
          </p>
        </div>

        <div className="z-10 flex flex-wrap gap-3">
          <Link
            to="/aula-virtual"
            className="px-5 py-3 bg-white text-brand-700 hover:bg-brand-50 font-extrabold rounded-2xl text-xs shadow-lg transition-all flex items-center gap-2"
          >
            <i className="fa-solid fa-video text-red-500 animate-pulse"></i> Entrar al Aula Virtual
          </Link>
          <Link
            to="/dashboard/clases"
            className="px-5 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold rounded-2xl text-xs backdrop-blur transition-all"
          >
            Ver Mi Agenda
          </Link>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Próxima Clase</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center text-sm">
              <i className="fa-solid fa-clock"></i>
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">Hoy, 4:00 PM</p>
          <p className="text-xs text-brand-600 font-semibold mt-1 flex items-center gap-1">
            <i className="fa-solid fa-laptop text-[10px]"></i> Con Carlos Mendoza
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Horas Tomadas</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-sm">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">18.5 hrs</p>
          <p className="text-xs text-emerald-600 font-semibold mt-1">
            <i className="fa-solid fa-arrow-trend-up text-[10px]"></i> +4 hrs este mes
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Tutores Activos</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center text-sm">
              <i className="fa-solid fa-user-tie"></i>
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">3 Tutores</p>
          <p className="text-xs text-slate-400 mt-1">Matemáticas, Inglés, Python</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Saldo Disponible</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-sm">
              <i className="fa-solid fa-wallet"></i>
            </div>
          </div>
          <p className="text-2xl font-extrabold text-slate-900">$85.00 <span className="text-xs text-slate-400">USD</span></p>
          <Link to="/dashboard/finanzas" className="text-xs text-brand-600 font-bold hover:underline mt-1 block">
            Recargar Saldo →
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Upcoming Classes List */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">Tus Próximas Clases</h2>
              <p className="text-xs text-slate-400">Sesiones agendadas para los próximos 7 días</p>
            </div>
            <Link to="/dashboard/clases" className="text-xs font-bold text-brand-600 hover:text-brand-800">
              Ver todas ({bookings.length || 3}) →
            </Link>
          </div>

          <div className="space-y-3">
            {/* Class 1 (Imminent) */}
            <div className="p-4 rounded-2xl border-2 border-brand-500/30 bg-brand-50/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Carlos Mendoza"
                  className="w-12 h-12 rounded-xl object-cover border border-brand-200"
                />
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-extrabold uppercase animate-pulse">
                    En 15 minutos
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">Programación Python & Lógica</h3>
                  <p className="text-xs text-slate-500">Ing. Carlos Mendoza · 1 hora de duración</p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to="/aula-virtual"
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs shadow-md transition-all text-center flex items-center justify-center gap-1.5"
                >
                  <i className="fa-solid fa-video text-[10px]"></i> Unirme Ahora
                </Link>
              </div>
            </div>

            {/* Class 2 */}
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                  alt="Elena Rostova"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                    Mañana · 10:00 AM
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">Cálculo Integral & Series</h3>
                  <p className="text-xs text-slate-500">Dra. Elena Rostova · Modalidad Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to="/dashboard/clases"
                  className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl text-xs text-center transition-all"
                >
                  Detalles
                </Link>
              </div>
            </div>

            {/* Class 3 */}
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80"
                  alt="Sarah Jenkins"
                  className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                    Jueves 25 · 05:00 PM
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-0.5">Inglés TOEFL & Conversación</h3>
                  <p className="text-xs text-slate-500">Sarah Jenkins · Modalidad Online</p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to="/dashboard/clases"
                  className="flex-1 sm:flex-none px-4 py-2 border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold rounded-xl text-xs text-center transition-all"
                >
                  Detalles
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Recommended tutors */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-base font-extrabold text-slate-900">Tutores para ti</h2>
            <Link to="/explorar" className="text-xs font-bold text-brand-600 hover:text-brand-800">
              Explorar →
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                alt="Miguel Ángel"
                className="w-11 h-11 rounded-xl object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">Prof. Miguel Ángel</h4>
                <p className="text-[11px] text-slate-500 truncate">Física Cuántica & Álgebra</p>
                <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-0.5">
                  <i className="fa-solid fa-star"></i> 4.9 <span className="text-slate-400">($20/h)</span>
                </div>
              </div>
              <Link
                to="/tutores/4"
                className="px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold rounded-lg text-xs transition-colors"
              >
                Ver
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=100&q=80"
                alt="Valeria Gómez"
                className="w-11 h-11 rounded-xl object-cover border border-slate-200"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-slate-900 truncate">Valeria Gómez</h4>
                <p className="text-[11px] text-slate-500 truncate">Bases de Datos & SQL</p>
                <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-0.5">
                  <i className="fa-solid fa-star"></i> 4.7 <span className="text-slate-400">($28/h)</span>
                </div>
              </div>
              <Link
                to="/tutores/5"
                className="px-3 py-1.5 bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold rounded-lg text-xs transition-colors"
              >
                Ver
              </Link>
            </div>
          </div>

          <div className="p-4 bg-brand-50 rounded-2xl border border-brand-100 text-center">
            <i className="fa-solid fa-shield-halved text-2xl text-brand-600 mb-1 block"></i>
            <p className="text-xs font-bold text-brand-900">Garantía EduConnect</p>
            <p className="text-[11px] text-brand-700 mt-0.5 leading-relaxed">
              Si tu primera sesión no cumple tus expectativas, te reasignamos un tutor sin costo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
