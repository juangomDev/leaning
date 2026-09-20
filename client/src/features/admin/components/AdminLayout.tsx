import React, { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export const AdminLayout: React.FC = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const navGroups = [
    {
      title: 'Resumen & Control',
      items: [
        { to: '/admin', label: 'Dashboard General', icon: 'fa-chart-pie', end: true },
        { to: '/admin/metrics', label: 'Métricas Avanzadas', icon: 'fa-chart-line', end: false },
        { to: '/admin/reports', label: 'Centro de Reportes', icon: 'fa-file-invoice-dollar', end: false },
      ],
    },
    {
      title: 'Comunidad & Usuarios',
      items: [
        { to: '/admin/users', label: 'Todos los Usuarios', icon: 'fa-users', end: false },
        { to: '/admin/tutors', label: 'Tutores & Verificación', icon: 'fa-chalkboard-user', end: false, badge: '1' },
        { to: '/admin/students', label: 'Estudiantes', icon: 'fa-user-graduate', end: false },
      ],
    },
    {
      title: 'Operaciones de Clase',
      items: [
        { to: '/admin/bookings', label: 'Reservas y Disputas', icon: 'fa-calendar-check', end: false, badge: '1' },
        { to: '/admin/reviews', label: 'Moderación de Reseñas', icon: 'fa-star-half-stroke', end: false },
        { to: '/admin/subjects', label: 'Catálogo de Materias', icon: 'fa-book-bookmark', end: false },
      ],
    },
    {
      title: 'Finanzas & Billeteras',
      items: [
        { to: '/admin/wallets', label: 'Billeteras y Custodia', icon: 'fa-wallet', end: false },
        { to: '/admin/transactions', label: 'Transacciones Globales', icon: 'fa-money-bill-transfer', end: false },
      ],
    },
    {
      title: 'Plataforma & Seguridad',
      items: [
        { to: '/admin/logs', label: 'Auditoría del Sistema', icon: 'fa-clock-rotate-left', end: false },
        { to: '/admin/settings', label: 'Configuración Global', icon: 'fa-sliders', end: false },
      ],
    },
  ];

  return (
    <div className="dashboard-layout">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* ================= SIDEBAR ================= */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="admin-sidebar-header">
          <Link to="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center font-black text-sm shadow-sm">
              <i className="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <span className="text-base font-black tracking-tight text-white block leading-tight">
                Edu<span className="text-brand-400">Connect</span>
              </span>
              <span className="text-[9px] font-bold tracking-wider text-slate-400 uppercase">
                Panel Administrador
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="flex-1 overflow-y-auto py-3 space-y-3">
          {navGroups.map((group) => (
            <div key={group.title}>
              <p className="admin-nav-group-title">{group.title}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                      `admin-nav-link ${isActive ? 'active' : ''}`
                    }
                  >
                    <span className="flex items-center gap-2.5">
                      <i className={`fa-solid ${item.icon}`} style={{ width: '1.25rem', textAlign: 'center' }}></i>
                      <span>{item.label}</span>
                    </span>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
          >
            <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center"></i>
            <span>Cerrar Sesión Admin</span>
          </button>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WORKSPACE ================= */}
      <div className="dashboard-workspace">
        {/* Topbar */}
        <header className="admin-topbar">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <i className="fa-solid fa-bars text-lg"></i>
            </button>
            <div className="flex items-center gap-2">
              <span className="pulse-dot"></span>
              <span className="text-xs font-bold text-slate-700 hidden sm:inline">Sistema 100% Operativo</span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Direct links to main portals */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/student"
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
                title="Ir al Portal de Estudiante"
              >
                <i className="fa-solid fa-graduation-cap mr-1"></i> Alumno
              </Link>
              <Link
                to="/tutor"
                className="px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors"
                title="Ir al Portal de Tutor"
              >
                <i className="fa-solid fa-chalkboard-user mr-1"></i> Tutor
              </Link>
            </div>

            {/* Quick alert badge */}
            <Link
              to="/admin/bookings"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold hover:bg-rose-100 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
              <span>1 Disputa Abierta</span>
            </Link>

            {/* Admin Profile */}
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <img
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80"
                alt="Admin"
                className="w-8 h-8 rounded-xl object-cover border border-slate-200"
              />
              <div className="hidden sm:block text-left">
                <span className="text-xs font-black text-slate-900 block leading-tight">Admin Principal</span>
                <span className="text-[10px] text-slate-400 font-semibold">Superusuario</span>
              </div>
            </div>
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
