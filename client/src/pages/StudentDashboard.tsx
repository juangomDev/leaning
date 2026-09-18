import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingsService } from '../services/bookingsService';
import { Booking } from '../types';
import { 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  BookOpen, 
  Compass, 
  ArrowRight 
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const { user, profile } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      bookingsService.getBookings(user.id, 'student').then(data => {
        setBookings(data);
        setLoading(false);
      });
    }
  }, [user]);

  const handleCancel = async (id: string) => {
    if (window.confirm('¿Seguro que deseas cancelar esta tutoría?')) {
      await bookingsService.updateBookingStatus(id, 'cancelled');
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: 'cancelled' } : b));
    }
  };

  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <div className="container" style={{ paddingTop: 36, paddingBottom: 60, display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Banner */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary), #4338ca)', borderRadius: 'var(--radius-xl)', padding: 32, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img
            src={profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
            alt="avatar"
            style={{ width: 68, height: 68, borderRadius: 'var(--radius-lg)', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.7)' }}
          />
          <div>
            <span className="badge badge-slate" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: 4 }}>
              Panel de Estudiante
            </span>
            <h1 style={{ fontSize: 26, fontWeight: 800 }}>¡Hola, {profile?.full_name || 'Estudiante'}!</h1>
            <p style={{ fontSize: 13, color: '#e0effe', marginTop: 2 }}>
              Gestiona tus clases privadas, horarios y comunicación con profesores.
            </p>
          </div>
        </div>

        <Link to="/tutores" className="btn btn-secondary btn-sm" style={{ background: '#fff', color: 'var(--primary)', fontWeight: 800 }}>
          <Compass size={16} />
          <span>Explorar Nuevos Tutores</span>
        </Link>
      </div>

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-light)', display: 'block', marginBottom: 4 }}>
            Clases Confirmadas
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--emerald)' }}>{confirmedCount}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>listas para iniciar</span>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-light)', display: 'block', marginBottom: 4 }}>
            Solicitudes Pendientes
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--amber)' }}>{pendingCount}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>por confirmar</span>
          </div>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <span style={{ fontSize: 11, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-light)', display: 'block', marginBottom: 4 }}>
            Total de Tutorías
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontSize: 32, fontWeight: 900, color: 'var(--primary)' }}>{bookings.length}</span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>en tu historial</span>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Calendar size={20} color="var(--primary)" />
          <span>Mis Tutorías Programadas</span>
        </h2>

        {loading ? (
          <p>Cargando reservas...</p>
        ) : bookings.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {bookings.map((booking) => {
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
                      src={booking.tutor_avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150'}
                      alt={booking.tutor_name}
                      style={{ width: 56, height: 56, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <h3 style={{ fontSize: 16, fontWeight: 800 }}>{booking.tutor_name}</h3>
                        
                        {booking.status === 'confirmed' && (
                          <span className="badge badge-emerald">
                            <CheckCircle2 size={12} /> Confirmada
                          </span>
                        )}
                        {booking.status === 'pending' && (
                          <span className="badge badge-amber">
                            <Clock size={12} /> Pendiente
                          </span>
                        )}
                        {booking.status === 'cancelled' && (
                          <span className="badge badge-red">
                            <XCircle size={12} /> Cancelada
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>
                        {booking.subject}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                        <span style={{ textTransform: 'capitalize' }}>{formattedDate}</span>
                        <span>·</span>
                        <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{formattedTime} ({booking.duration_hours}h)</span>
                        <span>·</span>
                        <span>{booking.modality === 'online' ? 'Online' : 'Presencial'}</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-light)', display: 'block' }}>Total</span>
                      <span style={{ fontSize: 18, fontWeight: 900 }}>${booking.total_price} USD</span>
                    </div>

                    {booking.status !== 'cancelled' && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        className="btn btn-danger-outline btn-sm"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card" style={{ padding: 48, textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
              <BookOpen size={32} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Aún no tienes tutorías agendadas</h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, marginBottom: 20 }}>
              Encuentra a un profesor especializado en tu materia y agenda tu primera sesión.
            </p>
            <Link to="/tutores" className="btn btn-primary btn-sm">
              <span>Explorar Tutores Disponibles</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
