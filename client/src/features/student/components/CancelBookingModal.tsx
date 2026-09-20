import React, { useState } from 'react';
import { studentBookingService, BookingItem } from '../services/studentBookingService';
import { extractErrorMessage } from '../../../api/apiClient';

interface CancelBookingModalProps {
  booking: BookingItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CancelBookingModal: React.FC<CancelBookingModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState<string>('Conflicto de horario imprevisto');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await studentBookingService.cancelBooking(booking.id, reason);
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'No se pudo cancelar la clase.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-calendar-xmark"></i>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-slate-900">¿Deseas cancelar esta tutoría?</h3>
          <p className="text-xs text-slate-500 mt-1">
            Clase de <strong>{booking.subject}</strong> con {booking.tutorName}.
          </p>
        </div>

        <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/80 text-xs text-amber-800 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <i className="fa-solid fa-shield-halved text-amber-600"></i>
            Política de Reembolso Total
          </p>
          <p className="text-[11px] text-amber-700">
            Al cancelar, el importe de <strong>${booking.totalPrice} USD</strong> se reintegrará inmediatamente a tu billetera EduConnect.
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
              Motivo de la cancelación *
            </label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 bg-slate-50"
            >
              <option value="Conflicto de horario imprevisto">Conflicto de horario imprevisto</option>
              <option value="Motivos de salud o urgencia personal">Motivos de salud o urgencia personal</option>
              <option value="Ya resolví las dudas por mi cuenta">Ya resolví las dudas por mi cuenta</option>
              <option value="Deseo agendar con otro tutor">Deseo agendar con otro tutor</option>
              <option value="Otro motivo">Otro motivo</option>
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Mantener Clase
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-red-500/20"
            >
              {loading ? 'Cancelando...' : 'Confirmar Cancelación'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
