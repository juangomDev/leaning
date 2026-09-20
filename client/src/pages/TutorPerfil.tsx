import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tutorsService } from '../services/tutorsService';
import { bookingsService } from '../services/bookingsService';
import { useAuth } from '../context/AuthContext';
import { Tutor } from '../types';

export const TutorPerfil: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'sobre' | 'curriculum' | 'resenas'>('sobre');
  const [isLiked, setIsLiked] = useState<boolean>(false);

  // Booking Widget State
  const [selectedModality, setSelectedModality] = useState<string>('online');
  const [selectedDay, setSelectedDay] = useState<number>(0); // index of day
  const [selectedTime, setSelectedTime] = useState<string>('10:00 AM');
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);
  const [isBooking, setIsBooking] = useState<boolean>(false);

  const days = [
    { day: 'Lun', num: '22', date: '2026-09-22' },
    { day: 'Mar', num: '23', date: '2026-09-23' },
    { day: 'Mié', num: '24', date: '2026-09-24' },
    { day: 'Jue', num: '25', date: '2026-09-25' },
    { day: 'Vie', num: '26', date: '2026-09-26' },
    { day: 'Sáb', num: '27', date: '2026-09-27' },
  ];

  const timeSlots = [
    { time: '09:00 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '11:30 AM', available: false },
    { time: '03:00 PM', available: true },
    { time: '04:30 PM', available: true },
    { time: '06:00 PM', available: false },
  ];

  useEffect(() => {
    tutorsService.getTutorById(id || '1').then((data) => {
      setTutor(data);
      setLoading(false);
    });
  }, [id]);

  const handleBooking = async () => {
    if (!tutor) return;
    if (!user) {
      navigate('/login-registro?redirect=booking');
      return;
    }

    setIsBooking(true);
    try {
      await bookingsService.createBooking({
        student_id: user.id,
        student_name: user.profile?.full_name || user.email?.split('@')[0],
        student_avatar: user.profile?.avatar_url,
        tutor_id: tutor.id,
        tutor_name: tutor.full_name,
        tutor_avatar: tutor.avatar_url,
        subject: tutor.subject_name || 'Tutoría',
        scheduled_at: `${days[selectedDay].date}T10:00:00.000Z`,
        duration_hours: 1,
        modality: selectedModality,
        total_price: (tutor as any).price_per_hour || (tutor as any).hourly_rate || 25,
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        navigate('/dashboard/clases');
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-slate-50)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '2.5rem', height: '2.5rem', border: '4px solid var(--color-brand-600)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 0.75rem auto' }}></div>
          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-slate-600)' }}>Cargando perfil del tutor...</p>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--color-slate-50)' }}>
        <div style={{ textAlign: 'center', padding: '2rem', backgroundColor: '#fff', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-slate-200)', maxWidth: '28rem' }}>
          <i className="fa-solid fa-user-xmark" style={{ fontSize: '2.5rem', color: 'var(--color-slate-400)', marginBottom: '0.75rem', display: 'block' }}></i>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-slate-900)' }}>Tutor no encontrado</h2>
          <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', marginTop: '0.25rem', marginBottom: '1.25rem' }}>El perfil solicitado no existe o fue desactivado.</p>
          <Link to="/explorar" className="btn btn-primary">
            Volver a Explorar
          </Link>
        </div>
      </div>
    );
  }

  const tutorName = tutor.full_name || (tutor as any).name || 'Dra. Elena Rostova';
  const tutorHeadline = (tutor as any).headline || tutor.subject_name || (tutor as any).subject || 'Matemáticas & Cálculo';
  const tutorAvatar = tutor.avatar_url || (tutor as any).avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80';
  const tutorPrice = tutor.price_per_hour || (tutor as any).hourly_rate || (tutor as any).price || 25;
  const tutorRating = tutor.rating || 4.9;
  const tutorReviews = tutor.reviews_count || (tutor as any).reviews || 84;

  return (
    <div className="tutor-profile-page">
      {/* Breadcrumb */}
      <div className="tutor-breadcrumb-bar">
        <nav className="tutor-breadcrumb-nav">
          <Link to="/" className="tutor-breadcrumb-link">Inicio</Link>
          <i className="fa-solid fa-chevron-right" style={{ fontSize: '9px' }}></i>
          <Link to="/explorar" className="tutor-breadcrumb-link">Explorar</Link>
          <i className="fa-solid fa-chevron-right" style={{ fontSize: '9px' }}></i>
          <span style={{ color: 'var(--color-slate-700)', fontWeight: 600 }}>{tutorName}</span>
        </nav>
      </div>

      <div className="tutor-profile-container">
        <div className="tutor-profile-grid">
          {/* ======= LEFT / MAIN COLUMN ======= */}
          <div className="tutor-profile-main">
            {/* Profile Header Card */}
            <div className="tutor-profile-card">
              <div className="tutor-profile-header">
                <div className="tutor-hero-avatar-box">
                  <img
                    src={tutorAvatar}
                    alt={tutorName}
                    className="tutor-hero-avatar"
                  />
                  <span className="tutor-hero-status">
                    <span className="pulse-dot"></span> Disponible
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                        <span className="badge badge-blue">
                          Tutor Verificado
                        </span>
                        <span className="badge badge-amber">
                          Tutor Top
                        </span>
                      </div>
                      <h1 className="tutor-profile-headline">{tutorName}</h1>
                      <p className="tutor-profile-sub">{tutorHeadline}</p>
                    </div>
                    <div className="tutor-action-btn-group">
                      <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`tutor-icon-btn ${isLiked ? 'liked' : ''}`}
                        title="Guardar como favorito"
                      >
                        <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`}></i>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          alert('¡Enlace del perfil copiado al portapapeles!');
                        }}
                        className="tutor-icon-btn"
                        title="Compartir perfil"
                      >
                        <i className="fa-solid fa-share-nodes"></i>
                      </button>
                    </div>
                  </div>

                  {/* Fast Specs Row */}
                  <div className="tutor-specs-bar">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <div style={{ display: 'flex', color: '#fbbf24', fontSize: '0.75rem', gap: '2px' }}>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star-half-stroke"></i>
                      </div>
                      <strong style={{ color: 'var(--color-slate-900)' }}>{tutorRating}</strong>
                      <span style={{ color: 'var(--color-slate-400)', fontSize: '0.75rem' }}>({tutorReviews} reseñas)</span>
                    </div>
                    <div style={{ width: 1, height: 16, backgroundColor: 'var(--color-slate-200)' }}></div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-600)', display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 500 }}>
                      <i className="fa-solid fa-laptop" style={{ color: 'var(--color-brand-600)' }}></i> Online & Presencial
                    </span>
                    <div style={{ width: 1, height: 16, backgroundColor: 'var(--color-slate-200)' }}></div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-600)', display: 'flex', alignItems: 'center', gap: '0.375rem', fontWeight: 500 }}>
                      <i className="fa-solid fa-shield-check" style={{ color: '#10b981' }}></i> Documentos Validados
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation Card */}
            <div className="profile-tabs-card">
              <div className="profile-tabs-header">
                <button
                  onClick={() => setActiveTab('sobre')}
                  className={`profile-tab-btn ${activeTab === 'sobre' ? 'active' : ''}`}
                >
                  Sobre mí
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`profile-tab-btn ${activeTab === 'curriculum' ? 'active' : ''}`}
                >
                  Currículum
                </button>
                <button
                  onClick={() => setActiveTab('resenas')}
                  className={`profile-tab-btn ${activeTab === 'resenas' ? 'active' : ''}`}
                >
                  Reseñas ({tutorReviews})
                </button>
              </div>

              {/* Tab 1: Sobre mí */}
              {activeTab === 'sobre' && (
                <div className="profile-tab-body">
                  <div>
                    <h2 style={{ fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '0.75rem', fontSize: '1rem' }}>Presentación & Metodología</h2>
                    <p style={{ color: 'var(--color-slate-600)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                      {tutor.bio || 'Docente con amplia experiencia pedagógica. Mi objetivo es que cada estudiante entienda los conceptos fundamentales y los aplique con seguridad, adaptando las explicaciones al ritmo y necesidades individuales.'}
                    </p>
                    <p style={{ color: 'var(--color-slate-600)', fontSize: '0.875rem', lineHeight: 1.6 }}>
                      Utilizo pizarra digital colaborativa, guías de ejercicios resueltos paso a paso y simulacros periódicos para medir tu progreso real clase a clase.
                    </p>
                  </div>

                  <div>
                    <h3 style={{ fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '0.75rem', fontSize: '0.9375rem' }}>Especialidades</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span className="badge badge-slate">Cálculo Diferencial</span>
                      <span className="badge badge-slate">Álgebra Lineal</span>
                      <span className="badge badge-slate">Ecuaciones Diferenciales</span>
                      <span className="badge badge-slate">Estadística y Probabilidades</span>
                      <span className="badge badge-slate">Física Mecánica</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Currículum */}
              {activeTab === 'curriculum' && (
                <div className="profile-tab-body">
                  <div>
                    <h3 style={{ fontWeight: 700, color: 'var(--color-slate-900)', marginBottom: '0.75rem', fontSize: '0.9375rem' }}>Formación Académica</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <i className="fa-solid fa-graduation-cap" style={{ color: 'var(--color-brand-600)', marginTop: 4 }}></i>
                        <div>
                          <strong style={{ fontSize: '0.875rem', color: 'var(--color-slate-900)' }}>Doctorado en Ciencias Matemáticas</strong>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', margin: 0 }}>Universidad Nacional de Ingeniería · 2018 - 2022</p>
                        </div>
                      </li>
                      <li style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                        <i className="fa-solid fa-graduation-cap" style={{ color: 'var(--color-brand-600)', marginTop: 4 }}></i>
                        <div>
                          <strong style={{ fontSize: '0.875rem', color: 'var(--color-slate-900)' }}>Licenciatura en Educación Matemática</strong>
                          <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', margin: 0 }}>Universidad Pedagógica · 2013 - 2017</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Tab 3: Reseñas */}
              {activeTab === 'resenas' && (
                <div className="profile-tab-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-slate-100)', backgroundColor: '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: 'var(--color-brand-100)', color: 'var(--color-brand-700)', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            MC
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: 0 }}>Matías Colmenares</h4>
                            <p style={{ fontSize: '0.625rem', color: 'var(--color-slate-400)', margin: 0 }}>Hace 3 días · Cálculo Multivariable</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', color: '#fbbf24', fontSize: '0.75rem', gap: '2px' }}>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-600)', lineHeight: 1.5, margin: 0 }}>
                        Excelente docente. Gracias a ella pude aprobar mi parcial de integrales dobles con la nota más alta del curso. Muy paciente y clara.
                      </p>
                    </div>

                    <div style={{ padding: '1rem', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-slate-100)', backgroundColor: '#fff' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                          <div style={{ width: '2rem', height: '2rem', borderRadius: '50%', backgroundColor: '#f3e8ff', color: '#7e22ce', fontWeight: 700, fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            AV
                          </div>
                          <div>
                            <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: 0 }}>Ana Valeria Soto</h4>
                            <p style={{ fontSize: '0.625rem', color: 'var(--color-slate-400)', margin: 0 }}>Hace 1 semana · Álgebra Lineal</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', color: '#fbbf24', fontSize: '0.75rem', gap: '2px' }}>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-600)', lineHeight: 1.5, margin: 0 }}>
                        Muy recomendada. Explica con diagramas visuales y te envía notas en PDF al terminar la sesión.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ======= RIGHT / BOOKING SIDEBAR ======= */}
          <div className="tutor-profile-sidebar">
            <div className="booking-widget-card">
              <div className="booking-rate-header">
                <div>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-400)', margin: 0 }}>Tarifa de sesión</p>
                  <p className="booking-rate-val">
                    ${tutorPrice} <span className="booking-rate-unit">USD / hora</span>
                  </p>
                </div>
                <span className="badge badge-emerald">
                  Garantía 100%
                </span>
              </div>

              {/* Modality Selector */}
              <div className="filter-group">
                <label className="filter-label">
                  Modalidad
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <button
                    onClick={() => setSelectedModality('online')}
                    className={`filter-modality-btn ${selectedModality === 'online' ? 'active' : ''}`}
                    style={{ padding: '0.625rem' }}
                  >
                    <i className="fa-solid fa-laptop"></i> En Línea
                  </button>
                  <button
                    onClick={() => setSelectedModality('presencial')}
                    className={`filter-modality-btn ${selectedModality === 'presencial' ? 'active' : ''}`}
                    style={{ padding: '0.625rem' }}
                  >
                    <i className="fa-solid fa-location-dot"></i> Presencial
                  </button>
                </div>
              </div>

              {/* Day Selector */}
              <div className="filter-group">
                <label className="filter-label">
                  Selecciona Fecha
                </label>
                <div className="booking-dates-grid">
                  {days.map((d, index) => (
                    <button
                      key={d.num}
                      onClick={() => setSelectedDay(index)}
                      className={`booking-day-btn ${selectedDay === index ? 'active' : ''}`}
                    >
                      <span style={{ display: 'block', fontSize: '10px', textTransform: 'uppercase', fontWeight: 600 }}>{d.day}</span>
                      <span style={{ display: 'block', fontSize: '0.875rem', fontWeight: 800 }}>{d.num}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div className="filter-group">
                <label className="filter-label">
                  Horario Disponible
                </label>
                <div className="booking-times-grid">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`booking-time-btn ${selectedTime === slot.time ? 'active' : ''}`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking Action Button */}
              {bookingSuccess ? (
                <div className="alert alert-success" style={{ textAlign: 'center', padding: '1rem', flexDirection: 'column' }}>
                  <i className="fa-solid fa-circle-check" style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}></i>
                  <p style={{ fontSize: '0.75rem', fontWeight: 700, margin: 0 }}>¡Clase agendada con éxito!</p>
                  <p style={{ fontSize: '0.625rem', margin: 0 }}>Redirigiendo a tu aula...</p>
                </div>
              ) : (
                <button
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="btn btn-primary btn-block btn-lg"
                >
                  {isBooking ? (
                    'Procesando...'
                  ) : (
                    <>
                      <i className="fa-solid fa-calendar-check" style={{ marginRight: '0.5rem' }}></i>
                      Reservar Sesión Rápida
                    </>
                  )}
                </button>
              )}

              <Link
                to={`/tutors/${tutor.id}/book`}
                className="btn btn-outline btn-block text-xs"
                style={{ textAlign: 'center', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <i className="fa-solid fa-sliders" style={{ marginRight: '0.5rem' }}></i>
                Configurar y Desglose Completo
              </Link>

              <p style={{ fontSize: '0.625rem', color: 'var(--color-slate-400)', textAlign: 'center', margin: 0 }}>
                Cancelación gratuita hasta 12 horas antes de la sesión.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
