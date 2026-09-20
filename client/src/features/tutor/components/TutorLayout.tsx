import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { RoleSwitcher } from '../../roles/components/RoleSwitcher';
import { tutorService } from '../services/tutorService';
import { tutorWalletService } from '../services/tutorWalletService';

export const TutorLayout: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(480.0);
  const [isAvailable, setIsAvailable] = useState<boolean>(true);

  const tutorName = profile?.full_name || user?.email?.split('@')[0] || 'Prof. Carlos Mendoza';
  const tutorAvatar = profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';

  useEffect(() => {
    tutorWalletService.getWalletSummary()
      .then(res => setBalance(res.availableBalance))
      .catch(() => setBalance(480.0));

    tutorService.getProfile()
      .then(p => setIsAvailable(p.isAvailable))
      .catch(() => setIsAvailable(true));
  }, [location.pathname]);

  const handleToggleAvailability = async () => {
    const nextState = await tutorService.toggleAvailability();
    setIsAvailable(nextState);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const navLinks = [
    { to: '/tutor', label: 'Dashboard', icon: 'fa-chart-pie', end: true },
    { to: '/tutor/schedule', label: 'Agenda y Horarios', icon: 'fa-calendar-week', end: false },
    { to: '/tutor/bookings', label: 'Reservas y Clases', icon: 'fa-book-open-reader', end: false },
    { to: '/tutor/profile', label: 'Perfil y Materias', icon: 'fa-user-tie', end: false },
    { to: '/tutor/wallet', label: 'Finanzas y Retiros', icon: 'fa-wallet', end: false },
    { to: '/tutor/students', label: 'Mis Alumnos', icon: 'fa-users', end: false },
    { to: '/tutor/reviews', label: 'Reseñas de Alumnos', icon: 'fa-star', end: false },
    { to: '/tutor/settings', label: 'Ajustes y Verificación', icon: 'fa-gear', end: false },
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
        id="tutor-sidebar"
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

        {/* Tutor Profile Mini Card */}
        <div className="sidebar-profile-card">
          <div className="sidebar-profile-box">
            <img
              src={tutorAvatar}
              alt={tutorName}
              className="sidebar-profile-avatar border-purple-300"
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-slate-900)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {tutorName}
              </h4>
              <p style={{ fontSize: '11px', color: '#7c3aed', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem', margin: '2px 0 0 0' }}>
                <span style={{ width: '0.4rem', height: '0.4rem', borderRadius: 9999, backgroundColor: isAvailable ? '#10b981' : '#f59e0b' }}></span>
                {isAvailable ? 'Docente Activo' : 'En Pausa'}
              </p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="sidebar-nav-container">
          <p className="sidebar-section-title">
            Gestión Docente
          </p>

          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `sidebar-nav-link ${isActive ? 'active text-purple-700 bg-purple-50' : ''}`
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
              <span className="text-xs font-semibold text-slate-400">Área de Tutoría Profesional</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Availability Toggle */}
            <button
              onClick={handleToggleAvailability}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                isAvailable
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
              }`}
              title="Cambia tu visibilidad para recibir nuevas reservas"
            >
              <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
              <span>{isAvailable ? 'Disponible' : 'En Pausa'}</span>
            </button>

            {/* Role Switcher */}
            <div className="hidden md:flex items-center">
              <RoleSwitcher />
            </div>

            {/* Wallet Balance Pill */}
            <Link
              to="/tutor/wallet"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-200 text-purple-800 text-xs font-bold hover:bg-purple-100 transition-colors"
              title="Tus ganancias acumuladas. Haz clic para ver detalles y retirar."
            >
              <i className="fa-solid fa-wallet text-purple-600"></i>
              <span>${Number(balance || 0).toFixed(2)} USD</span>
            </Link>

            {/* Notification Bell */}
            <button
              className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors"
              title="Notificaciones de alumnos"
              aria-label="Notificaciones"
            >
              <i className="fa-solid fa-bell"></i>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-600"></span>
            </button>

            {/* Avatar link to profile */}
            <Link to="/tutor/profile" className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <img
                src={tutorAvatar}
                alt={tutorName}
                className="w-8 h-8 rounded-xl object-cover border border-purple-200"
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
