import React, { useState } from 'react';
import { adminOperationsService, AdminBooking } from '../services/adminOperationsService';

interface DisputeModalProps {
  booking?: AdminBooking | null;
  bookingId?: string;
  studentName?: string;
  tutorName?: string;
  totalPrice?: number;
  disputeReason?: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onResolved?: () => void;
}

export const DisputeModal: React.FC<DisputeModalProps> = ({
  booking,
  bookingId,
  studentName,
  tutorName,
  totalPrice,
  disputeReason,
  isOpen,
  onClose,
  onSuccess,
  onResolved,
}) => {
  const [resolution, setResolution] = useState<'REFUND_STUDENT' | 'PAY_TUTOR' | 'SPLIT'>('REFUND_STUDENT');
  const [notes, setNotes] = useState('Revisión de logs de conexión confirmó corte técnico. Se procede con el reembolso.');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const targetId = booking?.id || bookingId || '';
  const displayPrice = booking?.totalPrice || booking?.grossAmount || totalPrice || 0;
  const displayReason = booking?.disputeReason || disputeReason || 'Disputa abierta por falta de conformidad en la sesión.';

  const handleResolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim() || !targetId) return;

    setLoading(true);
    try {
      await adminOperationsService.resolveDispute(targetId, resolution, notes);
      onSuccess?.();
      onResolved?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-scale-balanced"></i>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">Resolución de Disputa Arbitral</h3>
          <p className="text-xs text-slate-500 mt-1">
            Reserva #{targetId.slice(0, 8)} • Monto en disputa: <strong>${displayPrice.toFixed(2)} USD</strong>
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
          <p className="font-bold flex items-center gap-1.5">
            <i className="fa-solid fa-triangle-exclamation"></i> Reclamo presentado:
          </p>
          <p className="italic">{displayReason}</p>
        </div>

        <form onSubmit={handleResolve} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">
              Dictamen Arbitral de Fondos *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {[
                { id: 'REFUND_STUDENT', title: 'Reembolsar Alumno', sub: '100% al estudiante' },
                { id: 'PAY_TUTOR', title: 'Liberar al Tutor', sub: '100% al profesor' },
                { id: 'SPLIT', title: 'Reparto 50/50', sub: 'Compromiso equitativo' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setResolution(opt.id as any)}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    resolution === opt.id
                      ? 'border-brand-600 bg-brand-50 text-brand-900 shadow-xs'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <p className="font-bold text-xs">{opt.title}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">{opt.sub}</p>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Fundamentación de la resolución (Auditoría inmutable) *
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
              rows={3}
              placeholder="Explica los hallazgos tras revisar logs y chats..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors shadow-sm"
            >
              {loading ? 'Aplicando dictamen...' : 'Emitir Dictamen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
