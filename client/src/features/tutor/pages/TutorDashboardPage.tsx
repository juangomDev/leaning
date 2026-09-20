import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { tutorBookingService, TutorBooking } from '../services/tutorBookingService';
import { tutorWalletService, TutorWalletSummary } from '../services/tutorWalletService';
import { tutorService, TutorProfileData } from '../services/tutorService';
import { BookingActionModal } from '../components/BookingActionModal';

export const TutorDashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [tutorProfile, setTutorProfile] = useState<TutorProfileData | null>(null);
  const [walletSummary, setWalletSummary] = useState<TutorWalletSummary | null>(null);
  const [bookings, setBookings] = useState<TutorBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal actions
  const [selectedBooking, setSelectedBooking] = useState<TutorBooking | null>(null);
  const [actionType, setActionType] = useState<'ACCEPT' | 'REJECT' | 'COMPLETE'>('ACCEPT');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);

  const tutorName = tutorProfile?.full_name || profile?.full_name || user?.email?.split('@')[0] || 'Prof. Carlos Mendoza';

  const loadData = async () => {
    try {
      setLoading(true);
      const [profData, walletData, bookingsData] = await Promise.all([
        tutorService.getProfile(),
        tutorWalletService.getWalletSummary(),
        tutorBookingService.getBookings(),
      ]);
      setTutorProfile(profData);
      setWalletSummary(walletData);
      setBookings(bookingsData);
    } catch (err) {
      console.error('Error loading tutor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const pendingBookings = bookings.filter(b => b.status === 'PENDING');
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED');
  const completedBookings = bookings.filter(b => b.status === 'COMPLETED');

  const openAction = (booking: TutorBooking, type: 'ACCEPT' | 'REJECT' | 'COMPLETE') => {
    setSelectedBooking(booking);
    setActionType(type);
    setIsActionModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 z-10 max-w-xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/15 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Docente Certificado
            </span>
            <span className="text-xs text-purple-200 font-semibold">
              EduConnect Tutor Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            ¡Hola, {tutorName}! 🎓
          </h1>
          <p className="text-xs sm:text-sm text-purple-100/90 leading-relaxed">
            {pendingBookings.length > 0
              ? `Tienes ${pendingBookings.length} nueva(s) solicitud(es) de alumnos esperando tu confirmación.`
              : 'Tu agenda está al día. Revisa tus próximas clases o actualiza tu disponibilidad semanal.'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 z-10">
          <Link
            to="/tutor/schedule"
            className="px-4 py-2.5 rounded-2xl bg-white text-purple-900 font-bold text-xs hover:bg-purple-50 transition-colors shadow-sm flex items-center gap-2"
          >
            <i className="fa-solid fa-calendar-days text-purple-600"></i>
            <span>Mi Agenda</span>
          </Link>
          <Link
            to="/aula-virtual"
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/20 flex items-center gap-2"
          >
            <i className="fa-solid fa-video text-rose-400"></i>
            <span>Aula Virtual</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {/* KPI 1: Ingresos del Mes */}
        <div className="kpi-card">
          <div className="kpi-icon-container bg-emerald-50 text-emerald-600">
            <i className="fa-solid fa-hand-holding-dollar"></i>
          </div>
          <div className="kpi-details">
            <div className="kpi-title">Ingresos Este Mes</div>
            <div className="kpi-number">${walletSummary?.thisMonthEarnings.toFixed(2) || '0.00'}</div>
            <div className="kpi-trend-note text-emerald-600">
              <i className="fa-solid fa-arrow-up"></i>
              <span>+18% vs mes anterior</span>
            </div>
          </div>
        </div>

        {/* KPI 2: Clases Confirmadas */}
        <div className="kpi-card">
          <div className="kpi-icon-container bg-purple-50 text-purple-600">
            <i className="fa-solid fa-calendar-check"></i>
          </div>
          <div className="kpi-details">
            <div className="kpi-title">Clases Programadas</div>
            <div className="kpi-number">{confirmedBookings.length}</div>
            <div className="kpi-trend-note text-purple-600">
              <i className="fa-solid fa-clock"></i>
              <span>Activas esta semana</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Solicitudes Pendientes */}
        <div className="kpi-card">
          <div className="kpi-icon-container bg-amber-50 text-amber-600">
            <i className="fa-solid fa-hourglass-half"></i>
          </div>
          <div className="kpi-details">
            <div className="kpi-title">Solicitudes Pendientes</div>
            <div className="kpi-number text-amber-600">{pendingBookings.length}</div>
            <div className="kpi-trend-note text-amber-600">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{pendingBookings.length > 0 ? 'Requiere respuesta' : 'Todo respondido'}</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Calificación */}
        <div className="kpi-card">
          <div className="kpi-icon-container bg-indigo-50 text-indigo-600">
            <i className="fa-solid fa-star"></i>
          </div>
          <div className="kpi-details">
            <div className="kpi-title">Calificación Promedio</div>
            <div className="kpi-number">4.9 / 5.0</div>
            <div className="kpi-trend-note text-slate-500">
              <i className="fa-solid fa-thumbs-up text-indigo-600"></i>
              <span>84 reseñas verificadas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section */}
      <div className="dashboard-grid-2col">
        {/* Left Column: Solicitudes Pendientes + Clases Confirmadas */}
        <div className="space-y-6">
          {/* Pending Booking Requests (Priority Alert) */}
          {pendingBookings.length > 0 && (
            <div className="bg-white rounded-3xl p-6 border-2 border-amber-300 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-amber-100">
                <div className="flex items-center gap-2.5">
                  <span className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></span>
                  <h2 className="text-base font-black text-slate-900">Solicitudes de Alumnos por Confirmar</h2>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                  {pendingBookings.length} pendiente(s)
                </span>
              </div>

              <div className="space-y-3">
                {pendingBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={b.studentAvatar}
                        alt={b.studentName}
                        className="w-12 h-12 rounded-2xl object-cover border border-amber-200"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{b.studentName}</h3>
                        <p className="text-xs text-purple-700 font-semibold">{b.subjectName}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-2">
                          <span><i className="fa-regular fa-calendar mr-1"></i>{b.scheduledDate}</span>
                          <span><i className="fa-regular fa-clock mr-1"></i>{b.scheduledTime} ({b.durationMinutes} min)</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => openAction(b, 'ACCEPT')}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
                      >
                        Aceptar
                      </button>
                      <button
                        onClick={() => openAction(b, 'REJECT')}
                        className="px-3 py-2 rounded-xl border border-rose-200 bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs transition-colors"
                      >
                        Rechazar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confirmed Classes Schedule */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <div>
                <h2 className="dashboard-card-title">Próximas Clases Confirmadas</h2>
                <p className="dashboard-card-subtitle">Sesiones listas para dictar en el Aula Virtual</p>
              </div>
              <Link to="/tutor/bookings" className="dashboard-card-link">
                Ver todas ({bookings.length})
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl text-purple-600 mb-2"></i>
                <p className="text-sm">Cargando clases...</p>
              </div>
            ) : confirmedBookings.length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <i className="fa-solid fa-calendar-xmark text-xl"></i>
                </div>
                <p className="font-semibold text-slate-700">No tienes clases confirmadas próximas</p>
                <p className="text-xs text-slate-400 mt-1">
                  Revisa tu disponibilidad en la agenda para que los alumnos puedan encontrarte.
                </p>
                <Link
                  to="/tutor/schedule"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-bold hover:bg-purple-700 transition-colors"
                >
                  <i className="fa-solid fa-clock"></i>
                  Configurar Horarios
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {confirmedBookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={b.studentAvatar}
                        alt={b.studentName}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-900">{b.studentName}</h4>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                            Confirmada
                          </span>
                        </div>
                        <p className="text-xs text-purple-700 font-semibold">{b.subjectName}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          <i className="fa-regular fa-calendar mr-1"></i>{b.scheduledDate} a las {b.scheduledTime} ({b.durationMinutes} min)
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        to="/aula-virtual"
                        className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <i className="fa-solid fa-video text-rose-300"></i>
                        <span>Entrar</span>
                      </Link>
                      <button
                        onClick={() => openAction(b, 'COMPLETE')}
                        className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                        title="Marcar como finalizada para liberar fondos"
                      >
                        Finalizar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Accesos Rápidos, Billetera y Perfil Preview */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Acciones Rápidas</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/tutor/schedule"
                className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-purple-50/50 hover:border-purple-200 transition-all flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-calendar-week"></i>
                </div>
                <span className="text-xs font-bold text-slate-800">Mi Agenda</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Disponibilidad</span>
              </Link>

              <Link
                to="/tutor/profile"
                className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-brand-50/50 hover:border-brand-200 transition-all flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-book-bookmark"></i>
                </div>
                <span className="text-xs font-bold text-slate-800">Mis Materias</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Tarifas y bio</span>
              </Link>

              <Link
                to="/tutor/wallet"
                className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-money-bill-transfer"></i>
                </div>
                <span className="text-xs font-bold text-slate-800">Retirar Saldo</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Billetera</span>
              </Link>

              <Link
                to="/tutor/students"
                className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-users"></i>
                </div>
                <span className="text-xs font-bold text-slate-800">Mis Alumnos</span>
                <span className="text-[10px] text-slate-400 mt-0.5">CRM docente</span>
              </Link>
            </div>
          </div>

          {/* Quick Balance Summary Box */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-6 rounded-3xl text-white shadow-md space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Saldo para Retiro</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                Al día
              </span>
            </div>
            <div>
              <span className="text-3xl font-black text-white">${walletSummary?.availableBalance.toFixed(2) || '480.00'}</span>
              <span className="text-xs text-slate-400 ml-1">USD</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Fondos retenidos en custodia de clases activas: <strong>${walletSummary?.pendingEscrow.toFixed(2) || '56.25'} USD</strong>.
            </p>
            <Link
              to="/tutor/wallet"
              className="block w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs text-center transition-colors shadow-xs"
            >
              Ir a Finanzas y Retiros
            </Link>
          </div>
        </div>
      </div>

      {/* Action Modal */}
      {selectedBooking && (
        <BookingActionModal
          isOpen={isActionModalOpen}
          onClose={() => {
            setIsActionModalOpen(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
          actionType={actionType}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};
