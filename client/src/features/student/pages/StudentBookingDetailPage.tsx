import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { studentBookingService, StudentBooking } from '../services/studentBookingService';
import { CancelBookingModal } from '../components/CancelBookingModal';
import { RescheduleBookingModal } from '../components/RescheduleBookingModal';
import { ReviewModal } from '../components/ReviewModal';

export const StudentBookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [booking, setBooking] = useState<StudentBooking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const fetchBookingDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await studentBookingService.getBookingById(id);
      if (!data) {
        setError('No se encontró la reserva solicitada.');
      } else {
        setBooking(data);
      }
    } catch (err) {
      console.error(err);
      setError('Error al cargar la información de la clase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookingDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80">
        <i className="fa-solid fa-circle-notch fa-spin text-3xl text-brand-600 mb-3"></i>
        <p className="text-sm font-medium text-slate-600">Cargando detalles de la clase...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 max-w-xl mx-auto p-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <i className="fa-solid fa-circle-exclamation text-2xl"></i>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Clase no encontrada</h2>
        <p className="text-xs text-slate-500 mb-6">{error || 'La sesión no existe o fue eliminada.'}</p>
        <Link
          to="/student/bookings"
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors"
        >
          Volver a Mis Clases
        </Link>
      </div>
    );
  }

  const isUpcoming = booking.status === 'CONFIRMED' || booking.status === 'PENDING';
  const isCompleted = booking.status === 'COMPLETED';
  const isCancelled = booking.status === 'CANCELLED';

  const statusBadges = {
    CONFIRMED: { label: 'Confirmada', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    PENDING: { label: 'Pendiente', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    COMPLETED: { label: 'Completada', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    CANCELLED: { label: 'Cancelada', color: 'bg-rose-50 text-rose-700 border-rose-200' },
  };

  const badge = (statusBadges as Record<string, { label: string; color: string }>)[booking.status] || statusBadges.CONFIRMED;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Bar with back link & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to="/student/bookings"
            className="text-xs text-brand-600 font-bold hover:underline inline-flex items-center gap-1.5 mb-2"
          >
            <i className="fa-solid fa-arrow-left"></i> Volver a Mis Clases
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Clase #{booking.id.slice(0, 8)}
            </h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${badge.color}`}>
              {badge.label}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {isUpcoming && (
            <>
              <Link
                to="/aula-virtual"
                className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <i className="fa-solid fa-video text-rose-300"></i>
                <span>Entrar al Aula</span>
              </Link>
              <button
                type="button"
                onClick={() => setIsRescheduleOpen(true)}
                className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
              >
                <i className="fa-solid fa-clock-rotate-left mr-1"></i>
                Reprogramar
              </button>
              <button
                type="button"
                onClick={() => setIsCancelOpen(true)}
                className="px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/50 text-rose-700 font-bold text-xs hover:bg-rose-100 transition-colors"
              >
                <i className="fa-solid fa-ban mr-1"></i>
                Cancelar
              </button>
            </>
          )}

          {isCompleted && (
            <button
              type="button"
              onClick={() => setIsReviewOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-xs hover:bg-amber-600 transition-colors shadow-sm flex items-center gap-1.5"
            >
              <i className="fa-solid fa-star"></i>
              <span>Dejar Reseña</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Technical Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Class Overview Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-2 py-0.5 rounded-md">
                  Materia Especializada
                </span>
                <h2 className="text-xl font-black text-slate-900 mt-1">{booking.subject_name}</h2>
              </div>
            </div>

            {/* Schedule Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fecha</span>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <i className="fa-regular fa-calendar text-brand-600"></i>
                  {booking.scheduled_date}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Horario</span>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <i className="fa-regular fa-clock text-brand-600"></i>
                  {booking.scheduled_time}
                </p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Duración</span>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                  <i className="fa-solid fa-hourglass-half text-brand-600"></i>
                  {booking.duration_minutes} minutos
                </p>
              </div>
            </div>

            {/* Virtual Classroom Direct Access Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  Aula Virtual Integrada
                </div>
                <h3 className="text-sm font-bold text-white">Sala de Videollamada y Pizarra</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Conexión directa punto a punto con audio HD y pantalla compartida.
                </p>
              </div>
              <Link
                to="/aula-virtual"
                className="px-4 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-colors shrink-0 text-center flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                <span>Ingresar al Aula</span>
              </Link>
            </div>

            {/* Instructions */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Recomendaciones para tu clase
              </h4>
              <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
                <li>Conéctate 5 minutos antes del inicio para validar tu micrófono y cámara.</li>
                <li>Ten a mano el material de estudio, ejercicios o apuntes que deseas resolver.</li>
                <li>Si necesitas reprogramar, hazlo con al menos 2 horas de anticipación sin penalidad.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right Column: Tutor & Financial Summary */}
        <div className="space-y-6">
          {/* Tutor Info Sheet */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Profesor Asignado
            </h3>
            <div className="flex items-center gap-3">
              <img
                src={booking.tutor_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'}
                alt={booking.tutor_name}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{booking.tutor_name}</h4>
                <p className="text-xs text-brand-600 font-semibold">{booking.subject_name}</p>
                <div className="flex items-center gap-1 text-xs text-amber-500 mt-0.5">
                  <i className="fa-solid fa-star text-[11px]"></i>
                  <span className="font-bold text-slate-700">4.9</span>
                  <span className="text-slate-400 text-[10px]">(50+ clases)</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <Link
                to={`/student/tutors/${booking.tutor_id}`}
                className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center transition-colors"
              >
                Ver Perfil
              </Link>
            </div>
          </div>

          {/* Financial Breakdown Sheet */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Detalle Financiero
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total pagado:</span>
                <span className="font-bold text-slate-900">${booking.price_paid.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estado de pago:</span>
                <span className="font-bold text-emerald-600">Liquidado / Custodia</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Método:</span>
                <span className="text-slate-800">Billetera EduConnect</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Modals */}
      <CancelBookingModal
        isOpen={isCancelOpen}
        onClose={() => setIsCancelOpen(false)}
        booking={booking}
        onSuccess={() => {
          fetchBookingDetail();
        }}
      />
      <RescheduleBookingModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
        booking={booking}
        onSuccess={() => {
          fetchBookingDetail();
        }}
      />
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        booking={booking}
        onSuccess={() => {
          fetchBookingDetail();
        }}
      />
    </div>
  );
};
