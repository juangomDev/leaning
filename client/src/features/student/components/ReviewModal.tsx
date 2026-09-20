import React, { useState } from 'react';
import { studentBookingService, BookingItem } from '../services/studentBookingService';
import { extractErrorMessage } from '../../../api/apiClient';

interface ReviewModalProps {
  booking: BookingItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  booking,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment) {
      setErrorMsg('Por favor escribe un breve comentario sobre tu experiencia.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await studentBookingService.submitReview({
        tutorId: booking.tutorId || booking.tutor_id || '',
        bookingId: booking.id,
        rating,
        comment,
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Error al enviar la calificación.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-500 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-star"></i>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div>
          <h3 className="text-xl font-extrabold text-slate-900">Califica tu clase</h3>
          <p className="text-xs text-slate-500 mt-1">
            ¿Cómo fue tu sesión de <strong>{booking.subject}</strong> con {booking.tutorName}?
          </p>
        </div>

        {/* Stars Selector */}
        <div className="flex flex-col items-center justify-center py-2 space-y-2">
          <div className="flex items-center gap-2 text-2xl cursor-pointer">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="text-amber-400 hover:scale-125 transition-transform focus:outline-none"
              >
                <i
                  className={`fa-${(hoverRating || rating) >= star ? 'solid' : 'regular'} fa-star`}
                ></i>
              </button>
            ))}
          </div>
          <span className="text-xs font-bold text-slate-600">
            {rating === 5 && '¡Excelente tutoría!'}
            {rating === 4 && 'Muy buena clase'}
            {rating === 3 && 'Buena / Aceptable'}
            {rating === 2 && 'Puede mejorar'}
            {rating === 1 && 'Mala experiencia'}
          </span>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Comentario u Opinión *
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Explica qué te pareció la explicación, la puntualidad o los ejercicios resueltos..."
              className="w-full p-3.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 bg-slate-50 resize-none"
            />
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
              {loading ? 'Publicando...' : 'Publicar Reseña'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
