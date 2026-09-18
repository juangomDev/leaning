import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Video, MapPin, CheckCircle2, Award } from 'lucide-react';
import { BookingModal } from './BookingModal';
import { Tutor } from '../../types';

interface TutorCardProps {
  tutor: Tutor;
  onBookingSuccess?: () => void;
}

export const TutorCard: React.FC<TutorCardProps> = ({ tutor, onBookingSuccess }) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <>
      <div className="tutor-card">
        <div className="tutor-card-body">
          {/* Header with Avatar & Rating */}
          <div className="tutor-header">
            <div className="avatar-wrapper">
              <img
                src={tutor.avatar_url}
                alt={tutor.full_name}
              />
              {tutor.is_available && <span className="online-dot" title="Disponible hoy"></span>}
            </div>

            <div className="tutor-info" style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0 }}>
                  <Link to={`/tutores/${tutor.id}`}>{tutor.full_name}</Link>
                </h3>
                <CheckCircle2 size={16} color="var(--primary)" />
              </div>

              <div className="tutor-subject">{tutor.subject_name}</div>

              <div className="tutor-rating-row">
                <div style={{ display: 'flex', alignItems: 'center', color: '#f59e0b', fontWeight: 700 }}>
                  <Star size={13} fill="#f59e0b" style={{ marginRight: 3 }} />
                  <span>{tutor.rating}</span>
                </div>
                <span>·</span>
                <span>({tutor.reviews_count} opiniones)</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <p className="tutor-bio">{tutor.bio}</p>

          {/* Tags & Badges */}
          <div className="tutor-tags">
            <span className="badge badge-slate">
              {tutor.modality === 'online' ? (
                <>
                  <Video size={12} color="var(--primary)" /> Online
                </>
              ) : (
                <>
                  <MapPin size={12} color="#6366f1" /> Presencial
                </>
              )}
            </span>

            {tutor.badges?.map((badge, idx) => (
              <span key={idx} className="badge badge-blue">
                <Award size={12} color="var(--primary)" />
                {badge}
              </span>
            ))}
          </div>
        </div>

        {/* Footer / Price & Actions */}
        <div className="tutor-card-footer">
          <div className="price-box">
            <span className="price-label">Tarifa por hora</span>
            <div className="price-amount">
              ${tutor.price_per_hour} <span>USD</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Link to={`/tutores/${tutor.id}`} className="btn btn-secondary btn-sm">
              Ver Perfil
            </Link>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn btn-primary btn-sm"
            >
              Reservar
            </button>
          </div>
        </div>
      </div>

      <BookingModal
        tutor={tutor}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onBookingSuccess={onBookingSuccess}
      />
    </>
  );
};
