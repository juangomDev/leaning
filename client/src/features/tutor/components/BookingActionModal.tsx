import React, { useState } from 'react';
import { tutorBookingService, TutorBooking } from '../services/tutorBookingService';

interface BookingActionModalProps {
  booking: TutorBooking;
  actionType: 'ACCEPT' | 'REJECT' | 'COMPLETE';
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BookingActionModal: React.FC<BookingActionModalProps> = ({
  booking,
  actionType,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (actionType === 'ACCEPT') {
        await tutorBookingService.acceptBooking(booking.id);
      } else if (actionType === 'REJECT') {
        await tutorBookingService.rejectBooking(booking.id, reason || 'El profesor no tiene disponibilidad en este horario.');
      } else if (actionType === 'COMPLETE') {
        await tutorBookingService.completeBooking(booking.id);
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const titles = {
    ACCEPT: 'Aceptar Solicitud de Clase',
    REJECT: 'Rechazar Solicitud de Reserva',
    COMPLETE: 'Finalizar Clase y Liberar Fondos',
  };

  const icons = {
    ACCEPT: 'fa-calendar-check text-emerald-600 bg-emerald-100',
    REJECT: 'fa-calendar-xmark text-rose-600 bg-rose-100',
    COMPLETE: 'fa-circle-check text-brand-600 bg-brand-100',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shrink-0 ${icons[actionType]}`}>
            <i className={`fa-solid ${actionType === 'ACCEPT' ? 'fa-check' : actionType === 'REJECT' ? 'fa-xmark' : 'fa-award'}`}></i>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">{titles[actionType]}</h3>
          <p className="text-xs text-slate-500 mt-1">
            Alumno: <span className="font-bold text-slate-800">{booking.studentName}</span> • Materia: <span className="font-bold text-slate-800">{booking.subjectName}</span>
          </p>
        </div>

        <form onSubmit={handleConfirm} className="space-y-4">
          {actionType === 'ACCEPT' && (
            <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs space-y-2 border border-emerald-200">
              <p className="font-bold flex items-center gap-1.5">
                <i className="fa-solid fa-circle-info"></i> Confirmación de sesión
              </p>
              <p>
                Al aceptar, se notificará al alumno de inmediato y se habilitará el acceso al Aula Virtual el día <strong>{booking.scheduledDate} a las {booking.scheduledTime}</strong>.
              </p>
            </div>
          )}

          {actionType === 'REJECT' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Motivo del rechazo para el estudiante *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
                rows={3}
                placeholder="Indica al alumno por qué no puedes tomar la clase o sugiérele otro horario disponible..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          )}

          {actionType === 'COMPLETE' && (
            <div className="p-4 rounded-2xl bg-indigo-50 text-indigo-900 text-xs space-y-2 border border-indigo-200">
              <p className="font-bold flex items-center gap-1.5">
                <i className="fa-solid fa-coins text-amber-500"></i> Liberación de fondos en custodia
              </p>
              <p>
                Se acreditarán <strong>${booking.netEarnings.toFixed(2)} USD</strong> netos a tu Billetera EduConnect (después del 10% de comisión de servicio).
              </p>
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Atrás
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2.5 rounded-xl text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-1.5 ${
                actionType === 'ACCEPT' ? 'bg-emerald-600 hover:bg-emerald-700' :
                actionType === 'REJECT' ? 'bg-rose-600 hover:bg-rose-700' :
                'bg-brand-600 hover:bg-brand-700'
              }`}
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-check"></i>
                  <span>Confirmar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
