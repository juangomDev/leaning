import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { studentBookingService, StudentBooking } from '../services/studentBookingService';
import { BookingCard } from '../components/BookingCard';
import { CancelBookingModal } from '../components/CancelBookingModal';
import { RescheduleBookingModal } from '../components/RescheduleBookingModal';
import { ReviewModal } from '../components/ReviewModal';

export const StudentBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<StudentBooking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filter, setFilter] = useState<'ALL' | 'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('ALL');

  // Modals state
  const [selectedBooking, setSelectedBooking] = useState<StudentBooking | null>(null);
  const [isCancelOpen, setIsCancelOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await studentBookingService.getBookings();
      setBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filteredBookings = bookings.filter(b => {
    if (filter === 'UPCOMING') return b.status === 'CONFIRMED' || b.status === 'PENDING';
    if (filter === 'COMPLETED') return b.status === 'COMPLETED';
    if (filter === 'CANCELLED') return b.status === 'CANCELLED';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mis Clases y Tutorías</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Gestiona tus sesiones agendadas, reprogramaciones y valoraciones
          </p>
        </div>
        <Link
          to="/student/bookings/new"
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition-colors shadow-sm shrink-0"
        >
          <i className="fa-solid fa-plus"></i>
          <span>Agendar Nueva Clase</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Todas ({bookings.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('UPCOMING')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'UPCOMING'
              ? 'bg-brand-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Próximas ({bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('COMPLETED')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'COMPLETED'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Completadas ({bookings.filter(b => b.status === 'COMPLETED').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('CANCELLED')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'CANCELLED'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Canceladas ({bookings.filter(b => b.status === 'CANCELLED').length})
        </button>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80">
          <i className="fa-solid fa-circle-notch fa-spin text-3xl text-brand-600 mb-3"></i>
          <p className="text-sm font-medium text-slate-600">Cargando tus clases...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="py-16 px-4 text-center bg-white rounded-3xl border border-slate-200/80">
          <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-calendar-xmark text-2xl"></i>
          </div>
          <h3 className="text-base font-bold text-slate-800">No hay clases en esta categoría</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            {filter === 'ALL'
              ? 'Aún no has programado ninguna tutoría. Busca a tu profesor y agenda tu primera sesión.'
              : 'No se encontraron clases que coincidan con este filtro.'}
          </p>
          <Link
            to="/student/bookings/new"
            className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors shadow-sm"
          >
            <i className="fa-solid fa-calendar-plus"></i>
            Agendar Clase
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredBookings.map(booking => (
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

      {/* Interactive Modals */}
      {selectedBooking && (
        <>
          <CancelBookingModal
            isOpen={isCancelOpen}
            onClose={() => {
              setIsCancelOpen(false);
              setSelectedBooking(null);
            }}
            booking={selectedBooking}
            onSuccess={fetchBookings}
          />
          <RescheduleBookingModal
            isOpen={isRescheduleOpen}
            onClose={() => {
              setIsRescheduleOpen(false);
              setSelectedBooking(null);
            }}
            booking={selectedBooking}
            onSuccess={fetchBookings}
          />
          <ReviewModal
            isOpen={isReviewOpen}
            onClose={() => {
              setIsReviewOpen(false);
              setSelectedBooking(null);
            }}
            booking={selectedBooking}
            onSuccess={fetchBookings}
          />
        </>
      )}
    </div>
  );
};
