import React from 'react';
import { Link } from 'react-router-dom';
import { BookingItem } from '../services/studentBookingService';

interface BookingCardProps {
  booking: BookingItem;
  onCancel?: (booking: BookingItem) => void;
  onReschedule?: (booking: BookingItem) => void;
  onReview?: (booking: BookingItem) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onCancel,
  onReschedule,
  onReview,
}) => {
  const status = (booking.status || '').toLowerCase();
  const isConfirmed = status === 'confirmed';
  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';

  const dateSource = booking.scheduledAt || (booking.scheduled_date ? `${booking.scheduled_date}T${booking.scheduled_time || '12:00'}:00` : new Date().toISOString());
  const formattedDate = new Date(dateSource).toLocaleDateString('es-ES', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
      <div className="space-y-3">
        {/* Top bar with status & price */}
        <div className="flex items-center justify-between">
          <span
            className={`px-2.5 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${
              isConfirmed
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                : isCompleted
                ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {isConfirmed && 'Confirmada'}
            {isCompleted && 'Completada'}
            {isCancelled && 'Cancelada'}
          </span>

          <span className="font-extrabold text-slate-900 text-sm">
            ${booking.totalPrice} USD
          </span>
        </div>

        {/* Subject & Tutor */}
        <div>
          <h4 className="font-extrabold text-base text-slate-900 leading-snug">
            {booking.subject}
          </h4>
          <div className="flex items-center gap-2.5 mt-2">
            <img
              src={booking.tutorAvatar}
              alt={booking.tutorName}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            <span className="text-xs font-semibold text-slate-600">{booking.tutorName}</span>
          </div>
        </div>

        {/* Info pills */}
        <div className="flex flex-wrap gap-2 text-xs text-slate-500 pt-1">
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <i className="fa-regular fa-calendar text-slate-400"></i>
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <i className="fa-regular fa-clock text-slate-400"></i>
            <span>{booking.durationHours}h</span>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
            <i className={`fa-solid ${booking.modality === 'online' ? 'fa-laptop' : 'fa-location-dot'} text-slate-400`}></i>
            <span className="capitalize">{booking.modality}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 mt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
        <Link
          to={`/student/bookings/${booking.id}`}
          className="text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors flex items-center gap-1"
        >
          <span>Ficha Técnica</span>
          <i className="fa-solid fa-arrow-right text-[10px]"></i>
        </Link>

        <div className="flex items-center gap-1.5">
          {isConfirmed && (
            <>
              <Link
                to="/aula-virtual"
                className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
              >
                <i className="fa-solid fa-video text-[10px]"></i>
                <span>Aula</span>
              </Link>
              {onReschedule && (
                <button
                  type="button"
                  onClick={() => onReschedule(booking)}
                  className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg transition-colors"
                  title="Reprogramar clase"
                >
                  <i className="fa-solid fa-clock-rotate-left text-xs"></i>
                </button>
              )}
              {onCancel && (
                <button
                  type="button"
                  onClick={() => onCancel(booking)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition-colors"
                  title="Cancelar clase"
                >
                  <i className="fa-solid fa-xmark text-xs"></i>
                </button>
              )}
            </>
          )}

          {isCompleted && onReview && (
            <button
              type="button"
              onClick={() => onReview(booking)}
              className="px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200/80 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <i className="fa-solid fa-star text-[10px] text-amber-500"></i>
              <span>Calificar</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
