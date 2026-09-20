import React, { useState } from 'react';
import { tutorScheduleService } from '../services/tutorScheduleService';

interface AvailabilitySlotModalProps {
  dayId: number;
  dayName: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AvailabilitySlotModal: React.FC<AvailabilitySlotModalProps> = ({
  dayId,
  dayName,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [startTime, setStartTime] = useState('14:00');
  const [endTime, setEndTime] = useState('18:00');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await tutorScheduleService.addSlot(dayId, startTime, endTime);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-sm bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-2xl space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center text-lg shrink-0">
            <i className="fa-solid fa-calendar-plus"></i>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div>
          <h3 className="text-base font-black text-slate-900">Agregar Bloque: {dayName}</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Configura un horario disponible para recibir reservas
          </p>
        </div>

        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hora Inicio *</label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Hora Fin *</label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {loading ? 'Guardando...' : 'Guardar Bloque'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
