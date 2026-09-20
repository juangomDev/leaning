import React, { useState } from 'react';
import { studentBookingService, BookingItem } from '../services/studentBookingService';
import { extractErrorMessage } from '../../../api/apiClient';

interface RescheduleBookingModalProps {
  booking: BookingItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const RescheduleBookingModal: React.FC<RescheduleBookingModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [newDate, setNewDate] = useState<string>('');
  const [newTime, setNewTime] = useState<string>('16:00');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDate || !newTime) {
      setErrorMsg('Por favor selecciona la nueva fecha y hora.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const scheduledAt = new Date(`${newDate}T${newTime}:00`).toISOString();
      await studentBookingService.rescheduleBooking(booking.id, scheduledAt);
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Error al reprogramar la clase.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-clock-rotate-left"></i>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Reprogramar Tutoría</h3>
          <p className="text-xs text-slate-500 mt-1">
            Materia: <strong>{booking.subject}</strong> con {booking.tutorName}
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleConfirm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Nueva Fecha *
            </label>
            <input
              type="date"
              required
              min={new Date().toISOString().split('T')[0]}
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 bg-slate-50"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Nueva Hora *
            </label>
            <input
              type="time"
              required
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 bg-slate-50"
            />
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-500">
            El profesor recibirá una notificación inmediata con la nueva fecha propuesta.
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-500/20"
            >
              {loading ? 'Guardando...' : 'Confirmar Cambio'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
