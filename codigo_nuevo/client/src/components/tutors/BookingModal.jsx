import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingsService } from '../../services/bookingsService';
import { 
  X, 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  CheckCircle,
  AlertCircle 
} from 'lucide-react';

export const BookingModal = ({ tutor, isOpen, onClose, onBookingSuccess }) => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [time, setTime] = useState('10:00');
  const [duration, setDuration] = useState(1);
  const [modality, setModality] = useState(tutor?.modality === 'presencial' ? 'presencial' : 'online');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !tutor) return null;

  const totalPrice = (Number(tutor.price_per_hour) * Number(duration)).toFixed(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      const scheduledAt = new Date(`${date}T${time}:00`).toISOString();

      await bookingsService.createBooking({
        student_id: user.id,
        student_name: profile?.full_name || 'Estudiante',
        student_avatar: profile?.avatar_url,
        tutor_id: tutor.id,
        tutor_name: tutor.full_name,
        tutor_avatar: tutor.avatar_url,
        subject: tutor.subject_name,
        scheduled_at: scheduledAt,
        duration_hours: Number(duration),
        modality,
        total_price: Number(totalPrice),
        notes,
      });

      setSuccess(true);
      if (onBookingSuccess) onBookingSuccess();
      setTimeout(() => {
        setSuccess(false);
        onClose();
        navigate('/dashboard');
      }, 1500);
    } catch (err) {
      console.error(err);
      setError('Ocurrió un error al agendar la clase. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <button onClick={onClose} className="modal-header-close">
            <X size={16} />
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <img
              src={tutor.avatar_url}
              alt={tutor.full_name}
              style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.8)' }}
            />
            <div>
              <span className="badge badge-slate" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: 4 }}>
                Agendar Tutoría
              </span>
              <h3 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>{tutor.full_name}</h3>
              <p style={{ fontSize: 12, color: '#e0effe', margin: 0 }}>{tutor.subject_name}</p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {success ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ width: 64, height: 64, background: 'var(--emerald-light)', color: 'var(--emerald)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <CheckCircle size={40} />
              </div>
              <h4 style={{ fontSize: 18, fontWeight: 800 }}>¡Reserva Solicitada con Éxito!</h4>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>
                El tutor recibirá la solicitud. Te estamos redirigiendo a tu Dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {error && (
                <div className="alert alert-error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                </div>
              )}

              {!user && (
                <div className="alert alert-warning" style={{ justifyContent: 'space-between' }}>
                  <span>Debes iniciar sesión para confirmar la reserva.</span>
                  <button
                    type="button"
                    onClick={() => navigate('/login?redirect=' + encodeURIComponent(window.location.pathname))}
                    style={{ fontWeight: 800, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Iniciar Sesión
                  </button>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Calendar size={13} color="var(--primary)" />
                    Fecha
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setDate(e.target.value)}
                    className="input-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={13} color="var(--primary)" />
                    Hora
                  </label>
                  <select
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="input-control"
                  >
                    <option value="08:00">08:00 AM</option>
                    <option value="09:00">09:00 AM</option>
                    <option value="10:00">10:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="15:00">03:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
                    <option value="18:00">06:00 PM</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="form-group">
                  <label className="form-label">Duración</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="input-control"
                  >
                    <option value={1}>1 Hora</option>
                    <option value={1.5}>1.5 Horas</option>
                    <option value={2}>2 Horas</option>
                    <option value={3}>3 Horas</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Modalidad</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, background: 'var(--bg-muted)', padding: 4, borderRadius: 10 }}>
                    <button
                      type="button"
                      onClick={() => setModality('online')}
                      className={`btn btn-sm ${modality === 'online' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '6px 8px', fontSize: 11 }}
                    >
                      <Video size={12} /> Online
                    </button>
                    <button
                      type="button"
                      onClick={() => setModality('presencial')}
                      className={`btn btn-sm ${modality === 'presencial' ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ padding: '6px 8px', fontSize: 11 }}
                    >
                      <MapPin size={12} /> Presencial
                    </button>
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">¿Qué temas necesitas repasar? (Opcional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Tengo dudas sobre integrales por partes..."
                  className="input-control"
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>

              {/* Price summary */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'var(--bg-muted)', borderRadius: 12 }}>
                <div>
                  <span style={{ fontSize: 11, color: 'var(--text-light)', display: 'block' }}>
                    Tarifa: ${tutor.price_per_hour}/hr × {duration}h
                  </span>
                  <strong style={{ fontSize: 14, color: 'var(--text-main)' }}>Total Estimado</strong>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--primary)', display: 'block' }}>
                    ${totalPrice}
                  </span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>USD</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn btn-primary btn-block btn-lg"
              >
                {isSubmitting ? 'Procesando...' : 'Confirmar Solicitud de Clase'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
