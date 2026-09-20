import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { studentBookingService, StudentBooking } from '../services/studentBookingService';
import { studentWalletService } from '../services/studentWalletService';
import { BookingCard } from '../components/BookingCard';
import { CancelBookingModal } from '../components/CancelBookingModal';
import { RescheduleBookingModal } from '../components/RescheduleBookingModal';
import { ReviewModal } from '../components/ReviewModal';
import { RechargeWalletModal } from '../components/RechargeWalletModal';

export const StudentDashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<StudentBooking[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Modal states
  const [selectedBooking, setSelectedBooking] = useState<StudentBooking | null>(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);

  const studentName = profile?.full_name || user?.email?.split('@')[0] || 'Estudiante';

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsData, walletData] = await Promise.all([
        studentBookingService.getBookings(),
        studentWalletService.getBalance().catch(() => ({ balance: 0 })),
      ]);
      setBookings(bookingsData);
      setBalance(walletData.balance);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const upcomingBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const nextClass = upcomingBookings[0] || null;
  const completedClassesCount = bookings.filter(b => b.status === 'COMPLETED').length;
  const totalHoursStudied = completedClassesCount * 1.5; // Approx average

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="dashboard-welcome-banner">
        <div className="banner-content">
          <span className="banner-badge">
            <i className="fa-solid fa-sparkles text-amber-300"></i> Portal del Alumno
          </span>
          <h1 className="banner-title">
            ¡Hola de nuevo, {studentName}! 👋
          </h1>
          <p className="banner-subtitle">
            {nextClass 
              ? `Tu próxima clase de ${nextClass.subject_name} comienza pronto. Prepárate para seguir aprendiendo.`
              : '¿Listo para dominar un nuevo tema hoy? Encuentra al tutor perfecto y agenda tu sesión.'}
          </p>
        </div>
        <div className="banner-actions">
          <Link to="/student/tutors" className="btn-banner-primary">
            <i className="fa-solid fa-magnifying-glass"></i>
            Buscar Tutores
          </Link>
          <Link to="/student/bookings" className="btn-banner-secondary">
            <i className="fa-solid fa-calendar"></i>
            Mis Clases
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {/* Card 1: Próximas Clases */}
        <div className="kpi-card">
          <div className="kpi-icon-container bg-brand-50 text-brand-600">
            <i className="fa-solid fa-calendar-check"></i>
          </div>
          <div className="kpi-details">
            <div className="kpi-title">Clases Programadas</div>
            <div className="kpi-number">{upcomingBookings.length}</div>
            <div className="kpi-trend-note">
              <i className="fa-solid fa-arrow-up"></i>
              <span>{upcomingBookings.length > 0 ? 'Activas' : 'Sin clases'}</span>
            </div>
          </div>
        </div>

        {/* Card 2: Clases Completadas */}
        <div className="kpi-card">
          <div className="kpi-icon-container bg-emerald-50 text-emerald-600">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div className="kpi-details">
            <div className="kpi-title">Clases Completadas</div>
            <div className="kpi-number">{completedClassesCount}</div>
            <div className="kpi-trend-note text-emerald-600">
              <i className="fa-solid fa-award"></i>
              <span>Progreso continuo</span>
            </div>
          </div>
        </div>

        {/* Card 3: Horas de Estudio */}
        <div className="kpi-card">
          <div className="kpi-icon-container bg-amber-50 text-amber-600">
            <i className="fa-solid fa-clock"></i>
          </div>
          <div className="kpi-details">
            <div className="kpi-title">Horas de Estudio</div>
            <div className="kpi-number">{totalHoursStudied.toFixed(1)}h</div>
            <div className="kpi-trend-note text-amber-600">
              <i className="fa-solid fa-graduation-cap"></i>
              <span>Tiempo total</span>
            </div>
          </div>
        </div>

        {/* Card 4: Saldo Billetera */}
        <div className="kpi-card">
          <div className="kpi-icon-container bg-indigo-50 text-indigo-600">
            <i className="fa-solid fa-wallet"></i>
          </div>
          <div className="kpi-details">
            <div className="kpi-title">Saldo Disponible</div>
            <div className="kpi-number">${balance.toFixed(2)}</div>
            <button
              onClick={() => setIsRechargeOpen(true)}
              className="text-xs text-brand-600 hover:text-brand-800 font-bold inline-flex items-center gap-1 mt-0.5"
            >
              <i className="fa-solid fa-plus-circle"></i> Recargar saldo
            </button>
          </div>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="dashboard-grid-2col">
        {/* Left Column: Próxima clase destacada + Clases recientes */}
        <div className="space-y-6">
          {/* Next Class Highlight */}
          {nextClass && (
            <div className="bg-gradient-to-r from-brand-600 to-indigo-700 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Próxima Sesión
                </span>
                <span className="text-xs text-brand-100 font-semibold">
                  ID: #{nextClass.id.slice(0, 8)}
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={nextClass.tutor_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                    alt={nextClass.tutor_name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white/40 shadow-sm"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-white">{nextClass.subject_name}</h3>
                    <p className="text-sm text-brand-100">Prof. {nextClass.tutor_name}</p>
                    <p className="text-xs text-white/80 mt-1 flex items-center gap-2">
                      <span><i className="fa-regular fa-calendar mr-1"></i>{nextClass.scheduled_date}</span>
                      <span><i className="fa-regular fa-clock mr-1"></i>{nextClass.scheduled_time} ({nextClass.duration_minutes} min)</span>
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 shrink-0">
                  <Link
                    to="/aula-virtual"
                    className="px-4 py-2.5 rounded-xl bg-white text-brand-700 font-bold text-xs hover:bg-brand-50 transition-colors shadow-sm flex items-center justify-center gap-1.5"
                  >
                    <i className="fa-solid fa-video text-rose-500"></i>
                    Entrar al Aula
                  </Link>
                  <Link
                    to={`/student/bookings/${nextClass.id}`}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors border border-white/20 text-center"
                  >
                    Ver detalles
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming / Active Bookings List */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <div>
                <h2 className="dashboard-card-title">Tus Próximas Clases</h2>
                <p className="dashboard-card-subtitle">Sesiones programadas con tus profesores</p>
              </div>
              <Link to="/student/bookings" className="dashboard-card-link">
                Ver todas ({bookings.length})
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400">
                <i className="fa-solid fa-circle-notch fa-spin text-2xl mb-2 text-brand-600"></i>
                <p className="text-sm">Cargando tus clases...</p>
              </div>
            ) : upcomingBookings.length === 0 ? (
              <div className="py-10 text-center text-slate-500">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <i className="fa-solid fa-calendar-plus text-xl"></i>
                </div>
                <p className="font-semibold text-slate-700">No tienes clases programadas</p>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Explora nuestros tutores calificados y agenda tu primera sesión en pocos pasos.
                </p>
                <Link
                  to="/student/tutors"
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors"
                >
                  <i className="fa-solid fa-magnifying-glass"></i>
                  Explorar Tutores
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.slice(0, 3).map(booking => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    onCancel={(b) => {
                      setSelectedBooking(b);
                      setIsCancelOpen(true);
                    }}
                    onReschedule={(b) => {
                      setSelectedBooking(b);
                      setIsRescheduleOpen(true);
                    }}
                    onReview={(b) => {
                      setSelectedBooking(b);
                      setIsReviewOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Accesos Rápidos & Recomendados */}
        <div className="space-y-6">
          {/* Quick Actions Card */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Acciones Rápidas</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Link
                to="/student/tutors"
                className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-brand-50/50 hover:border-brand-200 transition-all flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-magnifying-glass"></i>
                </div>
                <span className="text-xs font-bold text-slate-800">Buscar Tutor</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Por materia o nivel</span>
              </Link>

              <Link
                to="/student/bookings/new"
                className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-emerald-50/50 hover:border-emerald-200 transition-all flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-calendar-plus"></i>
                </div>
                <span className="text-xs font-bold text-slate-800">Agendar Clase</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Reserva directa</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsRechargeOpen(true)}
                className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-indigo-50/50 hover:border-indigo-200 transition-all flex flex-col items-center text-center group cursor-pointer"
              >
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-credit-card"></i>
                </div>
                <span className="text-xs font-bold text-slate-800">Recargar Saldo</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Billetera única</span>
              </button>

              <Link
                to="/aula-virtual"
                className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-rose-50/50 hover:border-rose-200 transition-all flex flex-col items-center text-center group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  <i className="fa-solid fa-video"></i>
                </div>
                <span className="text-xs font-bold text-slate-800">Aula Virtual</span>
                <span className="text-[10px] text-slate-400 mt-0.5">Pizarra y video</span>
              </Link>
            </div>
          </div>

          {/* Tutor Recomendado Card */}
          <div className="dashboard-card">
            <div className="dashboard-card-header">
              <h3 className="dashboard-card-title">Tutor Destacado de la Semana</h3>
            </div>
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                alt="Prof. Dra. Elena Rostova"
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div className="flex-1 min-width-0">
                <h4 className="text-sm font-bold text-slate-800">Dra. Elena Rostova</h4>
                <p className="text-xs text-brand-600 font-semibold">Cálculo & Física Cuántica</p>
                <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-500">
                  <span className="text-amber-500 font-bold flex items-center gap-1">
                    <i className="fa-solid fa-star text-[10px]"></i> 4.9
                  </span>
                  <span>•</span>
                  <span>$25/h</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Especialista en preparación de exámenes universitarios y cálculo multivariable con más de 8 años de experiencia.
            </p>
            <Link
              to="/student/tutors"
              className="w-full text-center py-2 px-3 rounded-xl border border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold text-xs transition-colors"
            >
              Ver perfil y disponibilidad
            </Link>
          </div>
        </div>
      </div>

      {/* Modales Compartidos */}
      {selectedBooking && (
        <>
          <CancelBookingModal
            isOpen={isCancelOpen}
            onClose={() => {
              setIsCancelOpen(false);
              setSelectedBooking(null);
            }}
            booking={selectedBooking}
            onSuccess={loadData}
          />
          <RescheduleBookingModal
            isOpen={isRescheduleOpen}
            onClose={() => {
              setIsRescheduleOpen(false);
              setSelectedBooking(null);
            }}
            booking={selectedBooking}
            onSuccess={loadData}
          />
          <ReviewModal
            isOpen={isReviewOpen}
            onClose={() => {
              setIsReviewOpen(false);
              setSelectedBooking(null);
            }}
            booking={selectedBooking}
            onSuccess={loadData}
          />
        </>
      )}

      {/* Modal de Recarga */}
      <RechargeWalletModal
        isOpen={isRechargeOpen}
        onClose={() => setIsRechargeOpen(false)}
        onSuccess={(newBalance) => {
          if (typeof newBalance === 'number') {
            setBalance(newBalance);
          } else {
            loadData();
          }
        }}
      />
    </div>
  );
};
