import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  Video, 
  MapPin, 
  Award, 
  CheckCircle2, 
  Calendar, 
  ArrowLeft, 
  Clock, 
  Shield, 
  MessageSquare 
} from 'lucide-react';
import { tutorsService } from '../services/tutorsService';
import { BookingModal } from '../components/tutors/BookingModal';
import { Tutor } from '../types';

export const TutorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    tutorsService.getTutorById(id).then(data => {
      setTutor(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <p>Cargando información del profesor...</p>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="container" style={{ padding: '80px 0', textAlign: 'center' }}>
        <h2>Tutor no encontrado</h2>
        <p style={{ marginTop: 8, marginBottom: 20 }}>El perfil que buscas no existe o ha sido modificado.</p>
        <Link to="/tutores" className="btn btn-primary btn-sm">
          Volver a Tutores
        </Link>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 64, display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Back link */}
      <Link to="/tutores" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-muted)', fontWeight: 600 }}>
        <ArrowLeft size={16} />
        <span>Volver al directorio de profesores</span>
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, alignItems: 'start' }}>
        {/* Left main info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Main Card */}
          <div className="card" style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24, paddingBottom: 24, borderBottom: '1px solid var(--border-light)' }}>
              <img
                src={tutor.avatar_url}
                alt={tutor.full_name}
                style={{ width: 96, height: 96, borderRadius: 'var(--radius-xl)', objectFit: 'cover', border: '3px solid #ffffff', boxShadow: 'var(--shadow-md)' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--text-main)' }}>{tutor.full_name}</h1>
                  <CheckCircle2 size={20} color="var(--primary)" />
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--primary)', marginTop: 2, marginBottom: 6 }}>
                  {tutor.subject_name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 13, color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', color: '#f59e0b', fontWeight: 700 }}>
                    <Star size={15} fill="#f59e0b" style={{ marginRight: 3 }} />
                    <span>{tutor.rating}</span>
                  </div>
                  <span>·</span>
                  <span>{tutor.reviews_count} reseñas</span>
                  <span>·</span>
                  <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>● Disponible hoy</span>
                </div>
              </div>
            </div>

            {/* Badges */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 18 }}>
              <span className="badge badge-slate" style={{ padding: '6px 12px' }}>
                {tutor.modality === 'online' ? <><Video size={14} color="var(--primary)" /> Clases Online</> : <><MapPin size={14} color="#6366f1" /> Clases Presenciales</>}
              </span>
              {tutor.badges?.map((badge, idx) => (
                <span key={idx} className="badge badge-blue" style={{ padding: '6px 12px' }}>
                  <Award size={14} color="var(--primary)" />
                  {badge}
                </span>
              ))}
            </div>

            {/* Bio */}
            <div style={{ marginTop: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 10 }}>Acerca de {tutor.full_name}</h2>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text-muted)' }}>{tutor.bio}</p>
            </div>

            {/* Methodology */}
            <div style={{ marginTop: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14 }}>Metodología de Enseñanza</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ padding: 18, background: 'var(--bg-muted)', borderRadius: 'var(--radius-lg)', display: 'flex', gap: 12 }}>
                  <Clock size={22} color="var(--primary)" style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: 14, display: 'block', marginBottom: 2 }}>Diagnóstico Inicial</strong>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      Identificamos lagunas de conocimiento en la primera sesión para crear un plan personalizado.
                    </span>
                  </div>
                </div>

                <div style={{ padding: 18, background: 'var(--bg-muted)', borderRadius: 'var(--radius-lg)', display: 'flex', gap: 12 }}>
                  <Shield size={22} color="var(--emerald)" style={{ flexShrink: 0 }} />
                  <div>
                    <strong style={{ fontSize: 14, display: 'block', marginBottom: 2 }}>Ejercicios Prácticos</strong>
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                      Resolución paso a paso de problemas reales y simulaciones de examen con retroalimentación.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews Card */}
          <div className="card" style={{ padding: 32 }}>
            <h2 style={{ fontSize: 18, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
              <MessageSquare size={20} color="var(--primary)" />
              Opiniones de Estudiantes ({tutor.reviews_count})
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: 18, background: 'var(--bg-muted)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong style={{ fontSize: 14 }}>Mariana P.</strong>
                  <div style={{ display: 'flex', color: '#f59e0b' }}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="#f59e0b" />)}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  "Excelente profesora, explica de forma muy clara y con mucha paciencia. Aprobé mi examen de admisión con 95 puntos gracias a sus clases."
                </p>
              </div>

              <div style={{ padding: 18, background: 'var(--bg-muted)', borderRadius: 'var(--radius-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong style={{ fontSize: 14 }}>Juan Gómez</strong>
                  <div style={{ display: 'flex', color: '#f59e0b' }}>
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={14} fill="#f59e0b" />)}
                  </div>
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  "Muy puntual y domina al 100% los temas. El material adicional que comparte es de primer nivel."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Card */}
        <div style={{ position: 'sticky', top: 90 }}>
          <div className="card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20, boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 16, borderBottom: '1px solid var(--border-light)' }}>
              <div>
                <span className="price-label">Tarifa</span>
                <div className="price-amount" style={{ fontSize: 30 }}>
                  ${tutor.price_per_hour} <span>USD / hora</span>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', alignItems: 'center', color: '#f59e0b', fontWeight: 800, justifyContent: 'flex-end' }}>
                  <Star size={16} fill="#f59e0b" style={{ marginRight: 3 }} />
                  <span>{tutor.rating}</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--text-light)' }}>Excelente</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, fontSize: 13, color: 'var(--text-muted)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} color="var(--emerald)" />
                <span>Garantía de reembolso en la 1ª clase</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} color="var(--emerald)" />
                <span>Cancelación gratuita con 24h de anticipación</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CheckCircle2 size={16} color="var(--emerald)" />
                <span>Atención y soporte directo</span>
              </div>
            </div>

            <button
              onClick={() => setModalOpen(true)}
              className="btn btn-primary btn-lg btn-block"
            >
              <Calendar size={18} />
              <span>Solicitar Clase</span>
            </button>

            <span style={{ fontSize: 11, textAlign: 'center', color: 'var(--text-light)' }}>
              No se realiza cobro hasta que el tutor confirme la clase.
            </span>
          </div>
        </div>
      </div>

      <BookingModal
        tutor={tutor}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </div>
  );
};
