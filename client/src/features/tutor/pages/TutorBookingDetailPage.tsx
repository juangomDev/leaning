import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tutorBookingService, TutorBooking } from '../services/tutorBookingService';
import { BookingActionModal } from '../components/BookingActionModal';

export const TutorBookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<TutorBooking | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal
  const [actionType, setActionType] = useState<'ACCEPT' | 'REJECT' | 'COMPLETE'>('ACCEPT');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDetail = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await tutorBookingService.getBookingById(id);
      setBooking(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80">
        <i className="fa-solid fa-circle-notch fa-spin text-3xl text-purple-600 mb-3"></i>
        <p className="text-sm font-medium text-slate-600">Cargando ficha de la reserva...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 max-w-md mx-auto p-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <i className="fa-solid fa-circle-exclamation text-2xl"></i>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Reserva no encontrada</h2>
        <p className="text-xs text-slate-500 mb-6">La clase no existe o fue eliminada de los registros.</p>
        <Link
          to="/tutor/bookings"
          className="px-5 py-2.5 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors"
        >
          Volver a Reservas
        </Link>
      </div>
    );
  }

  const isPending = booking.status === 'PENDING';
  const isConfirmed = booking.status === 'CONFIRMED';
  const isCompleted = booking.status === 'COMPLETED';

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link
            to="/tutor/bookings"
            className="text-xs text-purple-700 font-bold hover:underline inline-flex items-center gap-1.5 mb-2"
          >
            <i className="fa-solid fa-arrow-left"></i> Volver al listado de reservas
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Ficha de Clase #{booking.id.slice(0, 8)}
            </h1>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              isPending ? 'bg-amber-100 text-amber-800' :
              isConfirmed ? 'bg-emerald-100 text-emerald-800' :
              isCompleted ? 'bg-blue-100 text-blue-800' : 'bg-rose-100 text-rose-800'
            }`}>
              {booking.status}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {isPending && (
            <>
              <button
                onClick={() => {
                  setActionType('ACCEPT');
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                Aceptar Reserva
              </button>
              <button
                onClick={() => {
                  setActionType('REJECT');
                  setIsModalOpen(true);
                }}
                className="px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors"
              >
                Rechazar
              </button>
            </>
          )}

          {isConfirmed && (
            <>
              <Link
                to="/aula-virtual"
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
              >
                <i className="fa-solid fa-video text-rose-300"></i>
                <span>Abrir Aula Virtual</span>
              </Link>
              <button
                onClick={() => {
                  setActionType('COMPLETE');
                  setIsModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
              >
                Marcar como Finalizada
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Session details and notes */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider bg-purple-50 px-2 py-0.5 rounded-md">
                Materia Agendada
              </span>
              <h2 className="text-xl font-black text-slate-900 mt-1">{booking.subjectName}</h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fecha</span>
                <p className="font-bold text-slate-800 mt-0.5">{booking.scheduledDate}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Hora</span>
                <p className="font-bold text-slate-800 mt-0.5">{booking.scheduledTime}</p>
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Duración</span>
                <p className="font-bold text-slate-800 mt-0.5">{booking.durationMinutes} minutos</p>
              </div>
            </div>

            {/* Virtual Room Box */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold mb-1">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
                  Aula Virtual Integrada
                </div>
                <h3 className="text-sm font-bold text-white">Sala de Videollamada y Pizarra</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Audio HD, video bidireccional y pizarra colaborativa en tiempo real.
                </p>
              </div>
              <Link
                to="/aula-virtual"
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shrink-0 text-center flex items-center justify-center gap-2"
              >
                <i className="fa-solid fa-arrow-up-right-from-square"></i>
                <span>Ingresar al Aula</span>
              </Link>
            </div>

            {/* Student Syllabus Notes */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Notas y Objetivos compartidos por el alumno
              </h4>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                {booking.notes || 'El estudiante no ha adjuntado notas específicas para esta clase.'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Student CRM Card & Accounting */}
        <div className="space-y-6">
          {/* Student Profile Info */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Estudiante Registrado
            </h3>
            <div className="flex items-center gap-3">
              <img
                src={booking.studentAvatar}
                alt={booking.studentName}
                className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900">{booking.studentName}</h4>
                <p className="text-xs text-slate-500">{booking.studentEmail}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold">
                  Alumno Verificado
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <Link
                to={`/tutor/students/${booking.studentId}`}
                className="block w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center transition-colors"
              >
                Ver Ficha en Mis Alumnos
              </Link>
            </div>
          </div>

          {/* Accounting Breakdown */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Desglose de Honorarios
            </h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Tarifa Bruta de la Sesión:</span>
                <span className="font-bold text-slate-800">${booking.grossAmount.toFixed(2)} USD</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Comisión de Servicio (10%):</span>
                <span className="font-semibold text-rose-600">-${booking.platformFee.toFixed(2)} USD</span>
              </div>
              <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900">
                <span>Neto a Acreditar:</span>
                <span className="text-emerald-600">${booking.netEarnings.toFixed(2)} USD</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-400">
              {isCompleted ? 'Los fondos ya han sido acreditados a tu saldo disponible.' : 'Los fondos permanecen en custodia hasta que finalices la clase.'}
            </p>
          </div>
        </div>
      </div>

      {/* Modal */}
      <BookingActionModal
        booking={booking}
        actionType={actionType}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDetail}
      />
    </div>
  );
};
