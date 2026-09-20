import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { RoleSwitcher } from '../../roles/components/RoleSwitcher';
import { studentWalletService } from '../services/studentWalletService';

export const StudentLayout: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);

  const studentName = profile?.full_name || user?.email?.split('@')[0] || 'Estudiante';
  const studentAvatar = profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';

  useEffect(() => {
    // Cargar balance de billetera
    studentWalletService.getBalance()
      .then(res => setBalance(res.balance))
      .catch(() => setBalance(0));
  }, [location.pathname]);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { to: '/student', label: 'Dashboard', icon: 'fa-chart-pie', end: true },
    { to: '/student/bookings', label: 'Mis Clases', icon: 'fa-calendar-days', end: false },
    { to: '/student/wallet', label: 'Billetera', icon: 'fa-wallet', end: false },
    { to: '/student/tutors', label: 'Explorar Tutores', icon: 'fa-magnifying-glass', end: false },
    { to: '/student/profile', label: 'Mi Perfil', icon: 'fa-user-graduate', end: false },
    { to: '/student/settings', label: 'Configuración', icon: 'fa-gear', end: false },
  ];

  return (
    <div className="dashboard-layout">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside
        id="student-sidebar"
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
            className="lg:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
            aria-label="Cerrar menú"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Student Profile Card */}
        <div className="sidebar-profile-card">
          <div className="sidebar-profile-box">
            <img
              src={studentAvatar}
              alt={studentName}
              className="sidebar-profile-avatar"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {studentName}
              </h4>
              <p style={{ fontSize: '11px', color: 'var(--color-brand-600)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', margin: '2px 0 0 0' }}>
                <span style={{ width: '0.4rem', height: '0.4rem', borderRadius: 9999, backgroundColor: '#10b981' }}></span> Portal Alumno
              </p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="sidebar-nav-container">
          <p className="sidebar-section-title">
            Panel de Estudio
          </p>

          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? 'active' : ''}`
              }
            >
              <i className={`fa-solid ${item.icon}`} style={{ width: '1.25rem', textAlign: 'center' }}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}

          <div className="pt-2 pb-1">
            <div className="h-px bg-slate-100 my-1"></div>
            <p className="sidebar-section-title">
              En Vivo
            </p>
          </div>

          <Link
            to="/aula-virtual"
            onClick={() => setSidebarOpen(false)}
            className="sidebar-nav-link"
            style={{ justifyContent: 'space-between' }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <i className="fa-solid fa-video text-rose-500" style={{ width: '1.25rem', textAlign: 'center' }}></i>
              <span>Aula Virtual</span>
            </span>
            <span style={{ padding: '0.125rem 0.5rem', fontSize: '10px', fontWeight: 800, backgroundColor: '#fee2e2', color: '#dc2626', borderRadius: 9999 }}>
              EN VIVO
            </span>
          </Link>

          {/* Quick switch roles in sidebar */}
          <div className="mt-4 pt-3 border-t border-slate-100">
            <div className="px-2 py-1 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Modo de Cuenta</span>
            </div>
            <div className="px-2">
              <RoleSwitcher />
            </div>
          </div>
        </nav>

        {/* Sidebar Footer with Logout */}
        <div className="sidebar-footer">
          <button
            onClick={handleLogout}
            className="sidebar-logout-btn"
          >
            <i className="fa-solid fa-arrow-right-from-bracket" style={{ width: '1.25rem' }}></i>
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* ================= WORKSPACE ================= */}
      <div className="dashboard-workspace">
        {/* Topbar */}
        <header className="dashboard-topbar">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Abrir menú"
            >
              <i className="fa-solid fa-bars text-lg"></i>
            </button>
            <div className="hidden sm:block">
              <span className="text-xs font-semibold text-slate-400">Área de Aprendizaje</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Quick Role Switcher */}
            <div className="hidden md:flex items-center">
              <RoleSwitcher />
            </div>

            {/* Wallet Balance Pill */}
            <Link
              to="/student/wallet"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
              title="Tu saldo disponible. Haz clic para recargar."
            >
              <i className="fa-solid fa-wallet text-emerald-600"></i>
              <span>${Number(balance || 0).toFixed(2)} USD</span>
            </Link>

            {/* Notification Bell */}
            <button
              className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              title="Notificaciones"
              aria-label="Notificaciones"
            >
              <i className="fa-solid fa-bell"></i>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-600"></span>
            </button>

            {/* Avatar link to profile */}
            <Link to="/student/profile" className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={studentAvatar}
                alt={studentName}
                className="w-8 h-8 rounded-xl object-cover border border-slate-200"
              />
            </Link>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="dashboard-content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
