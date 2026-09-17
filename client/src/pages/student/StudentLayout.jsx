import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const StudentLayout = ({ title = 'Dashboard Estudiante' }) => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const studentName = profile?.full_name || user?.email?.split('@')[0] || 'Alejandro Silva';
  const studentAvatar = profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="dashboard-layout">
      {/* ================= SIDEBAR ================= */}
      <aside
        id="sidebar"
        className={`dashboard-sidebar ${sidebarOpen ? 'open' : ''}`}
      >
        {/* Logo */}
        <div className="dashboard-sidebar-header">
          <Link to="/" className="navbar-brand">
            <div className="navbar-brand-icon">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
            <span className="navbar-brand-text">
              Edu<span className="navbar-brand-accent">Connect</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="navbar-mobile-toggle"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Student Profile Mini Card */}
        <div className="sidebar-profile-card">
          <div className="sidebar-profile-box">
            <img
              src={studentAvatar}
              alt={studentName}
              className="sidebar-profile-avatar"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{studentName}</h4>
              <p style={{ fontSize: '11px', color: 'var(--color-brand-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', margin: '2px 0 0 0' }}>
                <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: 9999, backgroundColor: '#10b981' }}></span> Estudiante Activo
              </p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="sidebar-nav-container">
          <p className="sidebar-section-title">
            Mi Portal
          </p>

          <NavLink
            to="/dashboard"
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `sidebar-nav-link ${isActive ? 'active' : ''}`
            }
          >
            <i className="fa-solid fa-chart-pie" style={{ color: 'var(--color-brand-600)', width: '1rem' }}></i> Dashboard
          </NavLink>

          <Link
            to="/aula-virtual"
            onClick={() => setSidebarOpen(false)}
            className="sidebar-nav-link"
            style={{ justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <i className="fa-solid fa-video" style={{ color: 'var(--color-slate-400)', width: '1rem' }}></i>{' '}
              Aula Virtual
            </span>
            <span style={{ padding: '0.125rem 0.5rem', fontSize: '10px', fontWeight: 800, backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: 9999 }}>
              EN VIVO
            </span>
          </Link>

          <NavLink
            to="/dashboard/clases"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `sidebar-nav-link ${isActive ? 'active' : ''}`
            }
          >
            <i className="fa-solid fa-calendar-days" style={{ color: 'var(--color-brand-600)', width: '1rem' }}></i> Mis Clases
          </NavLink>

          <NavLink
            to="/dashboard/tutores"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `sidebar-nav-link ${isActive ? 'active' : ''}`
            }
          >
            <i className="fa-solid fa-user-tie" style={{ color: 'var(--color-brand-600)', width: '1rem' }}></i> Mis Tutores
          </NavLink>

          <NavLink
            to="/dashboard/finanzas"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `sidebar-nav-link ${isActive ? 'active' : ''}`
            }
          >
            <i className="fa-solid fa-receipt" style={{ color: 'var(--color-brand-600)', width: '1rem' }}></i> Finanzas & Recibos
          </NavLink>

          <div style={{ paddingTop: '1rem', marginTop: '1rem', borderTop: '1px solid var(--color-slate-100)' }}>
            <p className="sidebar-section-title">
              Comunidad
            </p>
            <Link
              to="/explorar"
              onClick={() => setSidebarOpen(false)}
              className="sidebar-nav-link"
            >
              <i className="fa-solid fa-compass" style={{ color: 'var(--color-slate-400)', width: '1rem' }}></i>{' '}
              Buscar Nuevos Tutores
            </Link>
          </div>
        </nav>

        {/* Bottom Session Logout */}
        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="sidebar-logout-btn"
          >
            <i className="fa-solid fa-arrow-right-from-bracket" style={{ width: '1rem' }}></i> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.5)', backdropFilter: 'blur(4px)', zIndex: 40 }}
        ></div>
      )}

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div className="dashboard-workspace">
        {/* Header */}
        <header className="dashboard-topbar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button
              onClick={() => setSidebarOpen(true)}
              className="navbar-mobile-toggle"
            >
              <i className="fa-solid fa-bars" style={{ fontSize: '1.125rem' }}></i>
            </button>
            <div>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: 0 }}>{title}</h2>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-400)', margin: '2px 0 0 0' }}>Panel de control de tu aprendizaje</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Link
              to="/explorar"
              className="btn btn-secondary btn-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}
            >
              <i className="fa-solid fa-plus" style={{ fontSize: '0.75rem' }}></i> Reservar Nueva Clase
            </Link>
            <button className="tutor-icon-btn" style={{ position: 'relative' }}>
              <i className="fa-regular fa-bell" style={{ fontSize: '0.875rem' }}></i>
              <span style={{ position: 'absolute', top: 6, right: 6, width: 8, height: 8, backgroundColor: '#ef4444', borderRadius: 9999 }}></span>
            </button>
            <Link to="/aula-virtual" className="btn btn-primary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem' }}>
              <i className="fa-solid fa-video" style={{ fontSize: '0.75rem' }}></i> Aula Virtual
            </Link>
          </div>
        </header>

        {/* Scrollable Sub-Page Outlet */}
        <main className="dashboard-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
