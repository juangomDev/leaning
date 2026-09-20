import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tutorBookingService, TutorBooking } from '../services/tutorBookingService';
import { BookingActionModal } from '../components/BookingActionModal';

export const TutorBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<TutorBooking[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'>('ALL');
  const [loading, setLoading] = useState(true);

  // Action modal
  const [selectedBooking, setSelectedBooking] = useState<TutorBooking | null>(null);
  const [actionType, setActionType] = useState<'ACCEPT' | 'REJECT' | 'COMPLETE'>('ACCEPT');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await tutorBookingService.getBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openAction = (booking: TutorBooking, type: 'ACCEPT' | 'REJECT' | 'COMPLETE') => {
    setSelectedBooking(booking);
    setActionType(type);
    setIsModalOpen(true);
  };

  const filteredBookings = bookings.filter(b => {
    if (filter === 'ALL') return true;
    return b.status === filter;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Gestión de Reservas y Clases</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Aprueba solicitudes, accede al aula virtual y finaliza clases para liberar tus fondos
          </p>
        </div>
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
          onClick={() => setFilter('PENDING')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'PENDING'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Pendientes ({bookings.filter(b => b.status === 'PENDING').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('CONFIRMED')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
            filter === 'CONFIRMED'
              ? 'bg-purple-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Confirmadas ({bookings.filter(b => b.status === 'CONFIRMED').length})
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
          Finalizadas ({bookings.filter(b => b.status === 'COMPLETED').length})
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
          <i className="fa-solid fa-circle-notch fa-spin text-3xl text-purple-600 mb-3"></i>
          <p className="text-sm font-medium text-slate-600">Cargando reservas...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="py-16 px-4 text-center bg-white rounded-3xl border border-slate-200/80">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-calendar-xmark text-2xl"></i>
          </div>
          <h3 className="text-base font-bold text-slate-800">No hay reservas en este estado</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Todas las solicitudes y clases de tus estudiantes aparecerán listadas aquí con sus acciones correspondientes.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredBookings.map((b) => {
            const isPending = b.status === 'PENDING';
            const isConfirmed = b.status === 'CONFIRMED';
            const isCompleted = b.status === 'COMPLETED';
            const isCancelled = b.status === 'CANCELLED';

            return (
              <div
                key={b.id}
                className={`bg-white rounded-3xl p-5 border transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5 ${
                  isPending ? 'border-amber-300 shadow-sm ring-2 ring-amber-50' : 'border-slate-200/80 shadow-xs hover:border-slate-300'
                }`}
              >
                {/* Student info and class details */}
                <div className="flex items-start sm:items-center gap-4">
                  <img
                    src={b.studentAvatar}
                    alt={b.studentName}
                    className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900">{b.studentName}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isPending ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        isConfirmed ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        isCompleted ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}>
                        {isPending ? 'Solicitud Pendiente' : isConfirmed ? 'Confirmada' : isCompleted ? 'Completada' : 'Cancelada'}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-purple-700">{b.subjectName}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                      <span><i className="fa-regular fa-calendar mr-1 text-slate-400"></i>{b.scheduledDate}</span>
                      <span><i className="fa-regular fa-clock mr-1 text-slate-400"></i>{b.scheduledTime} ({b.durationMinutes} min)</span>
                      <span><i className="fa-solid fa-coins mr-1 text-amber-500"></i>Neto: <strong>${b.netEarnings.toFixed(2)} USD</strong></span>
                    </div>

                    {b.notes && (
                      <p className="text-[11px] text-slate-500 italic line-clamp-1 mt-1 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                        "{b.notes}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 shrink-0">
                  <Link
                    to={`/tutor/bookings/${b.id}`}
                    className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Ver Ficha
                  </Link>

                  {isPending && (
                    <>
                      <button
                        onClick={() => openAction(b, 'ACCEPT')}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <i className="fa-solid fa-check"></i>
                        <span>Aceptar</span>
                      </button>
                      <button
                        onClick={() => openAction(b, 'REJECT')}
                        className="px-3 py-2 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-100 text-rose-700 font-bold text-xs transition-colors"
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
                        <span>Iniciar Clase</span>
                      </Link>
                      <button
                        onClick={() => openAction(b, 'COMPLETE')}
                        className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
                      >
                        Finalizar y Cobrar
                      </button>
                    </>
                  )}

                  {isCompleted && (
                    <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-xs flex items-center gap-1.5">
                      <i className="fa-solid fa-circle-check text-emerald-600"></i>
                      <span>Fondos Acreditados</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Action Modal */}
      {selectedBooking && (
        <BookingActionModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBooking(null);
          }}
          booking={selectedBooking}
          actionType={actionType}
          onSuccess={fetchBookings}
        />
      )}
    </div>
  );
};
