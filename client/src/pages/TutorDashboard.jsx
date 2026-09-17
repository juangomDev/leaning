import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { bookingsService } from '../services/bookingsService';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Check, 
  X 
} from 'lucide-react';

export const TutorDashboard = () => {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' | 'confirmed' | 'all'

  useEffect(() => {
    if (user) {
      bookingsService.getBookings(user.id, 'tutor').then(data => {
        setBookings(data);
        setLoading(false);
      });
    }
  }, [user]);

  const handleUpdateStatus = async (id, newStatus) => {
    await bookingsService.updateBookingStatus(id, newStatus);
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status: newStatus } : b));
  };

  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed');
  const totalEarnings = confirmedBookings.reduce((acc, b) => acc + Number(b.total_price || 0), 0);

  const displayedBookings = activeTab === 'pending'
    ? pendingBookings
    : activeTab === 'confirmed'
      ? confirmedBookings
      : bookings;

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 60, display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Tutor Profile Header */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e1b4b, #0f172a)', borderRadius: 'var(--radius-xl)', padding: 32, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, boxShadow: 'var(--shadow-xl)', border: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img
            src={profile?.avatar_url || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'}
            alt="avatar"
            style={{ width: 68, height: 68, borderRadius: 'var(--radius-lg)', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.7)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span className="badge badge-emerald" style={{ background: 'rgba(16,185,129,0.2)', color: '#34d399', border: '1px solid rgba(16,185,129,0.3)' }}>
                Panel del Profesor
              </span>
              <span style={{ fontSize: 12, color: '#cbd5e1' }}>· Tarifa: <strong>$30 USD / hr</strong></span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800 }}>{profile?.full_name || 'Profesor'}</h1>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>
              Gestiona tus solicitudes de clases y mantén organizada tu agenda de estudiantes.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.06)', padding: '10px 16px', borderRadius: 'var(--radius-lg)', border: '1px solid rgba(255,255,255,0.1)', fontSize: 12, color: '#e2e8f0' }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }}></span>
          <span>Disponible para nuevas reservas</span>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-light)', display: 'block', marginBottom: 4 }}>
            Ingresos Confirmados
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--emerald)' }}>${totalEarnings}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>USD</span>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-light)', display: 'block', marginBottom: 4 }}>
            Solicitudes Por Responder
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--amber)' }}>{pendingBookings.length}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>requieren tu acción</span>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-light)', display: 'block', marginBottom: 4 }}>
            Clases Agendadas
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--primary)' }}>{confirmedBookings.length}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>próximas sesiones</span>
          </div>
        </div>
      </div>

      {/* Booking Tabs & List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 8, borderBottom: '1px solid var(--border-light)', paddingBottom: 12 }}>
          <button
            onClick={() => setActiveTab('pending')}
            className={`btn btn-sm ${activeTab === 'pending' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Pendientes ({pendingBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('confirmed')}
            className={`btn btn-sm ${activeTab === 'confirmed' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Confirmadas ({confirmedBookings.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`btn btn-sm ${activeTab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          >
            Todas ({bookings.length})
          </button>
        </div>

        {loading ? (
          <p>Cargando solicitudes...</p>
        ) : displayedBookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {displayedBookings.map((booking) => {
              const dateObj = new Date(booking.scheduled_at);
              const formattedDate = dateObj.toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              const formattedTime = dateObj.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit'
              });

              return (
                <div
                  key={booking.id}
                  className="card"
                  style={{ padding: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <img
                      src={booking.student_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                      alt={booking.student_name}
                      style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 800 }}>{booking.student_name}</h3>
                        
                        {booking.status === 'confirmed' && (
                          <span className="badge badge-emerald">
                            <CheckCircle2 size={12} /> Confirmada
                          </span>
                        )}
                        {booking.status === 'pending' && (
                          <span className="badge badge-amber">
                            <Clock size={12} /> Requiere Respuesta
                          </span>
                        )}
                        {booking.status === 'cancelled' && (
                          <span className="badge badge-red">
                            <XCircle size={12} /> Rechazada / Cancelada
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>
                        Materia: {booking.subject}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                        <span style={{ textTransform: 'capitalize' }}>{formattedDate}</span>
                        <span>·</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{formattedTime} ({booking.duration_hours}h)</span>
                        <span>·</span>
                        <span>{booking.modality === 'online' ? 'Online' : 'Presencial'}</span>
                      </div>

                      {booking.notes && (
                        <p style={{ marginTop: 8, fontSize: 12, fontStyle: 'italic', background: 'var(--bg-muted)', padding: '6px 10px', borderRadius: 'var(--radius-sm)' }}>
                          "{booking.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Price */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-light)', display: 'block' }}>Monto</span>
                      <span style={{ fontSize: 18, fontWeight: 900 }}>${booking.total_price} USD</span>
                    </div>

                    {booking.status === 'pending' ? (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'confirmed')}
                          className="btn btn-success btn-sm"
                        >
                          <Check size={14} />
                          <span>Aceptar</span>
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                          className="btn btn-outline btn-sm"
                        >
                          <X size={14} />
                          <span>Rechazar</span>
                        </button>
                      </div>
                    ) : booking.status === 'confirmed' ? (
                      <button
                        onClick={() => handleUpdateStatus(booking.id, 'cancelled')}
                        style={{ fontSize: 12, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                      >
                        Cancelar clase
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ padding: 40, textAlign: 'center', maxWidth: 450, margin: '0 auto' }}>
            <h3 style={{ fontSize: 16, fontWeight: 800 }}>No hay tutorías en esta pestaña</h3>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
              Cuando los estudiantes agenden clases contigo, aparecerán aquí.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
