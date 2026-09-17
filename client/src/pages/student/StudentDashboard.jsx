import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { bookingsService } from '../../services/bookingsService';

export const StudentDashboard = () => {
  const { profile, user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentName = profile?.full_name || user?.email?.split('@')[0] || 'Alejandro';

  useEffect(() => {
    bookingsService.getBookings().then((data) => {
      setBookings(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '80rem', margin: '0 auto' }}>
      {/* Welcome Banner */}
      <div className="dashboard-welcome-banner">
        <div className="banner-content">
          <div className="banner-badge">
            <i className="fa-solid fa-graduation-cap"></i> Portal del Alumno
          </div>
          <h1 className="banner-title">
            ¡Bienvenido de vuelta, {studentName}! 👋
          </h1>
          <p className="banner-subtitle">
            Tu próxima clase en vivo de <strong>Algoritmos & Programación Python</strong> comienza en 15 minutos.
          </p>
        </div>

        <div className="banner-actions">
          <Link
            to="/aula-virtual"
            className="btn-banner-primary"
          >
            <i className="fa-solid fa-video" style={{ color: '#ef4444' }}></i> Entrar al Aula Virtual
          </Link>
          <Link
            to="/dashboard/clases"
            className="btn-banner-secondary"
          >
            Ver Mi Agenda
          </Link>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-icon-container" style={{ backgroundColor: 'var(--color-brand-50)', color: 'var(--color-brand-600)' }}>
            <i className="fa-solid fa-clock"></i>
          </div>
          <div className="kpi-details">
            <span className="kpi-title">Próxima Clase</span>
            <p className="kpi-number" style={{ fontSize: '1.25rem', marginTop: '2px' }}>Hoy, 4:00 PM</p>
            <p className="kpi-trend-note" style={{ color: 'var(--color-brand-600)' }}>
              <i className="fa-solid fa-laptop"></i> Con Carlos Mendoza
            </p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-container" style={{ backgroundColor: '#ecfdf5', color: '#059669' }}>
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <div className="kpi-details">
            <span className="kpi-title">Horas Tomadas</span>
            <p className="kpi-number" style={{ fontSize: '1.25rem', marginTop: '2px' }}>18.5 hrs</p>
            <p className="kpi-trend-note">
              <i className="fa-solid fa-arrow-trend-up"></i> +4 hrs este mes
            </p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-container" style={{ backgroundColor: '#faf5ff', color: '#9333ea' }}>
            <i className="fa-solid fa-user-tie"></i>
          </div>
          <div className="kpi-details">
            <span className="kpi-title">Tutores Activos</span>
            <p className="kpi-number" style={{ fontSize: '1.25rem', marginTop: '2px' }}>3 Tutores</p>
            <p style={{ fontSize: '10px', color: 'var(--color-slate-400)', margin: '2px 0 0 0' }}>Matemáticas, Inglés, Python</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon-container" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
            <i className="fa-solid fa-wallet"></i>
          </div>
          <div className="kpi-details">
            <span className="kpi-title">Saldo Disponible</span>
            <p className="kpi-number" style={{ fontSize: '1.25rem', marginTop: '2px' }}>$85.00 <span style={{ fontSize: '11px', color: 'var(--color-slate-400)' }}>USD</span></p>
            <Link to="/dashboard/finanzas" style={{ fontSize: '11px', color: 'var(--color-brand-600)', fontWeight: 700, textDecoration: 'none', display: 'block', marginTop: '2px' }}>
              Recargar Saldo →
            </Link>
          </div>
        </div>
      </div>

      <div className="dashboard-grid-2col">
        {/* Upcoming Classes List */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <div>
              <h2 className="dashboard-card-title">Tus Próximas Clases</h2>
              <p className="dashboard-card-subtitle">Sesiones agendadas para los próximos 7 días</p>
            </div>
            <Link to="/dashboard/clases" className="dashboard-card-link">
              Ver todas ({bookings.length || 3}) →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {/* Class 1 (Imminent) */}
            <div className="upcoming-class-card imminent">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80"
                  alt="Carlos Mendoza"
                  style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-xl)', objectFit: 'cover', border: '1px solid var(--color-brand-200)' }}
                />
                <div>
                  <span className="badge badge-amber" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
                    En 15 minutos
                  </span>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: '4px 0 0 0' }}>Programación Python & Lógica</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', margin: '2px 0 0 0' }}>Ing. Carlos Mendoza · 1 hora de duración</p>
                </div>
              </div>
              <div>
                <Link
                  to="/aula-virtual"
                  className="btn btn-primary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <i className="fa-solid fa-video" style={{ fontSize: '10px' }}></i> Unirme Ahora
                </Link>
              </div>
            </div>

            {/* Class 2 */}
            <div className="upcoming-class-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"
                  alt="Elena Rostova"
                  style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-xl)', objectFit: 'cover', border: '1px solid var(--color-slate-200)' }}
                />
                <div>
                  <span className="badge badge-slate">
                    Mañana · 10:00 AM
                  </span>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: '4px 0 0 0' }}>Cálculo Integral & Series</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', margin: '2px 0 0 0' }}>Dra. Elena Rostova · Modalidad Online</p>
                </div>
              </div>
              <div>
                <Link
                  to="/dashboard/clases"
                  className="btn btn-secondary btn-sm"
                >
                  Detalles
                </Link>
              </div>
            </div>

            {/* Class 3 */}
            <div className="upcoming-class-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80"
                  alt="Sarah Jenkins"
                  style={{ width: '3rem', height: '3rem', borderRadius: 'var(--radius-xl)', objectFit: 'cover', border: '1px solid var(--color-slate-200)' }}
                />
                <div>
                  <span className="badge badge-slate">
                    Jueves 25 · 05:00 PM
                  </span>
                  <h3 style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: '4px 0 0 0' }}>Inglés TOEFL & Conversación</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', margin: '2px 0 0 0' }}>Sarah Jenkins · Modalidad Online</p>
                </div>
              </div>
              <div>
                <Link
                  to="/dashboard/clases"
                  className="btn btn-secondary btn-sm"
                >
                  Detalles
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Recommended tutors */}
        <div className="dashboard-card">
          <div className="dashboard-card-header">
            <h2 className="dashboard-card-title">Tutores para ti</h2>
            <Link to="/explorar" className="dashboard-card-link">
              Explorar →
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&q=80"
                alt="Miguel Ángel"
                style={{ width: '2.75rem', height: '2.75rem', borderRadius: 'var(--radius-xl)', objectFit: 'cover', border: '1px solid var(--color-slate-200)' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Prof. Miguel Ángel</h4>
                <p style={{ fontSize: '11px', color: 'var(--color-slate-500)', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Física Cuántica & Álgebra</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '11px', color: '#f59e0b', marginTop: '2px' }}>
                  <i className="fa-solid fa-star"></i> 4.9 <span style={{ color: 'var(--color-slate-400)' }}>($20/h)</span>
                </div>
              </div>
              <Link
                to="/tutores/4"
                className="btn btn-secondary btn-sm"
              >
                Ver
              </Link>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <img
                src="https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=100&q=80"
                alt="Valeria Gómez"
                style={{ width: '2.75rem', height: '2.75rem', borderRadius: 'var(--radius-xl)', objectFit: 'cover', border: '1px solid var(--color-slate-200)' }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Valeria Gómez</h4>
                <p style={{ fontSize: '11px', color: 'var(--color-slate-500)', margin: '2px 0 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Bases de Datos & SQL</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '11px', color: '#f59e0b', marginTop: '2px' }}>
                  <i className="fa-solid fa-star"></i> 4.7 <span style={{ color: 'var(--color-slate-400)' }}>($28/h)</span>
                </div>
              </div>
              <Link
                to="/tutores/5"
                className="btn btn-secondary btn-sm"
              >
                Ver
              </Link>
            </div>
          </div>

          <div style={{ padding: '1rem', backgroundColor: 'var(--color-brand-50)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-brand-100)', textAlign: 'center' }}>
            <i className="fa-solid fa-shield-halved" style={{ fontSize: '1.5rem', color: 'var(--color-brand-600)', marginBottom: '0.25rem', display: 'block' }}></i>
            <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-brand-900)', margin: 0 }}>Garantía EduConnect</p>
            <p style={{ fontSize: '11px', color: 'var(--color-brand-700)', marginTop: '2px', lineHeight: 1.4, margin: 0 }}>
              Si tu primera sesión no cumple tus expectativas, te reasignamos un tutor sin costo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
