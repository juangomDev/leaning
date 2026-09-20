import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  adminOperationsService, 
  AdminBooking 
} from '../services/adminOperationsService';
import { DisputeModal } from '../components/DisputeModal';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  AlertCircle, 
  Video, 
  Shield 
} from 'lucide-react';

export const AdminBookingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [booking, setBooking] = useState<AdminBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDisputeModal, setShowDisputeModal] = useState(false);

  const fetchBooking = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await adminOperationsService.getBookingById(id);
      setBooking(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-xs font-semibold">Cargando expediente de la reserva...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-rose-500 mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Reserva no encontrada</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">No existe ninguna clase registrada con este identificador.</p>
        <Link to="/admin/bookings" className="btn btn-primary text-xs">
          Volver a Reservas
        </Link>
      </div>
    );
  }

  const price = booking.totalPrice || booking.grossAmount || 0;
  const commission = booking.platformCommission || price * 0.15;
  const tutorEarnings = price - commission;
  const startTimeStr = booking.startTime || `${booking.scheduledDate}T${booking.scheduledTime || '16:00'}:00`;
  const endTimeStr = booking.endTime || `${booking.scheduledDate}T17:00:00`;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <Link 
        to="/admin/bookings" 
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al listado de reservas
      </Link>

      {/* Header Banner */}
      <div className="admin-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Reserva #{booking.id.substring(0, 8)}
              </h1>
              {booking.status === 'CONFIRMED' && (
                <span className="admin-badge admin-badge-active">Confirmada</span>
              )}
              {booking.status === 'COMPLETED' && (
                <span className="admin-badge admin-badge-completed">Completada</span>
              )}
              {booking.status === 'PENDING' && (
                <span className="admin-badge admin-badge-pending">Pendiente</span>
              )}
              {booking.status === 'CANCELLED' && (
                <span className="admin-badge admin-badge-banned">Cancelada</span>
              )}
              {booking.status === 'DISPUTED' && (
                <span className="admin-badge admin-badge-disputed animate-pulse">
                  <AlertCircle className="w-3 h-3" /> En Disputa
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Materia programada: <strong className="text-slate-800">{booking.subjectName}</strong>
            </p>
          </div>

          {booking.status === 'DISPUTED' && (
            <button
              onClick={() => setShowDisputeModal(true)}
              className="btn btn-primary bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold inline-flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Emitir Laudo Arbitral
            </button>
          )}
        </div>

        {/* If Disputed, callout banner */}
        {booking.status === 'DISPUTED' && (
          <div className="mt-6 p-4 rounded-xl bg-rose-50 border border-rose-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider">
                  Incidencia / Reclamación en Mediación
                </h3>
                <p className="text-xs text-rose-700 mt-1">
                  <strong>Causa alegada:</strong> {booking.disputeReason || 'El alumno manifestó inasistencia del docente o problemas técnicos de conexión.'}
                </p>
                <p className="text-[11px] text-rose-600 mt-1">
                  El pago de ${price.toFixed(2)} USD permanece congelado en la bóveda de custodia hasta tu dictamen.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Participants & Meeting Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Parties involved */}
        <div className="admin-card space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Partes Involucradas</h2>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                EST
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Estudiante</span>
                <span className="text-sm font-bold text-slate-900">{booking.studentName}</span>
              </div>
            </div>
            <Link
              to={`/admin/users/${booking.studentId}`}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Ver perfil →
            </Link>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                DOC
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Tutor Docente</span>
                <span className="text-sm font-bold text-slate-900">{booking.tutorName}</span>
              </div>
            </div>
            <Link
              to={`/admin/tutors/${booking.tutorId}`}
              className="text-xs font-bold text-blue-600 hover:text-blue-800"
            >
              Ver ficha →
            </Link>
          </div>
        </div>

        {/* Schedule and Session info */}
        <div className="admin-card space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cronograma & Sala Virtual</h2>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Fecha Inicio:</span>
              <span className="font-mono font-bold text-slate-800">{new Date(startTimeStr).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Fecha Fin:</span>
              <span className="font-mono font-bold text-slate-800">{new Date(endTimeStr).toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
              <span className="text-slate-500 flex items-center gap-1.5"><Video className="w-3.5 h-3.5" /> Enlace Aula:</span>
              {booking.meetingLink ? (
                <a href={booking.meetingLink} target="_blank" rel="noreferrer" className="text-blue-600 font-mono underline text-xs">
                  {booking.meetingLink}
                </a>
              ) : (
                <span className="text-slate-400 italic">No asignado</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Financial Settlement Breakdown */}
      <div className="admin-card">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
          Desglose Financiero & Comisión del Sistema
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-medium block">Total Pagado por Alumno</span>
            <p className="text-xl font-black text-slate-900 font-mono mt-1">${price.toFixed(2)} USD</p>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200">
            <span className="text-[11px] text-emerald-700 font-medium block">Comisión Plataforma (15%)</span>
            <p className="text-xl font-black text-emerald-700 font-mono mt-1">${commission.toFixed(2)} USD</p>
          </div>
          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200">
            <span className="text-[11px] text-blue-700 font-medium block">Liquidación Neta Tutor</span>
            <p className="text-xl font-black text-blue-700 font-mono mt-1">${tutorEarnings.toFixed(2)} USD</p>
          </div>
        </div>
      </div>

      {/* Dispute Modal */}
      {showDisputeModal && (
        <DisputeModal
          isOpen={true}
          onClose={() => setShowDisputeModal(false)}
          bookingId={booking.id}
          studentName={booking.studentName}
          tutorName={booking.tutorName}
          totalPrice={price}
          disputeReason={booking.disputeReason}
          onResolved={() => {
            setShowDisputeModal(false);
            fetchBooking();
          }}
        />
      )}
    </div>
  );
};
