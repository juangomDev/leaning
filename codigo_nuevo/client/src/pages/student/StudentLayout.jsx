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
    <div className="font-sans bg-slate-50 text-slate-800 antialiased selection:bg-brand-500 selection:text-white flex h-screen overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <aside
        id="sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static`}
      >
        {/* Logo */}
        <div className="h-18 px-6 flex items-center justify-between border-b border-slate-100 py-5">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
              <i className="fa-solid fa-graduation-cap text-sm"></i>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Edu<span className="text-brand-600">Connect</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-600"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Student Profile Mini Card */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-2xl border border-slate-200/70">
            <img
              src={studentAvatar}
              alt={studentName}
              className="w-10 h-10 rounded-xl object-cover border border-brand-200"
            />
            <div className="flex-1 min-w-0">
              <h4 className="text-xs font-bold text-slate-900 truncate">{studentName}</h4>
              <p className="text-[11px] text-brand-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Estudiante Activo
              </p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
          <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
            Mi Portal
          </p>

          <NavLink
            to="/dashboard"
            end
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isActive
                  ? 'bg-brand-50 text-brand-700 font-bold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <i className="fa-solid fa-chart-pie text-brand-600 w-4"></i> Dashboard
          </NavLink>

          <Link
            to="/aula-virtual"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold text-sm transition-all group"
          >
            <span className="flex items-center gap-3">
              <i className="fa-solid fa-video text-slate-400 group-hover:text-brand-600 w-4 transition-colors"></i>{' '}
              Aula Virtual
            </span>
            <span className="px-2 py-0.5 text-[10px] font-extrabold bg-red-100 text-red-600 rounded-full animate-pulse">
              EN VIVO
            </span>
          </Link>

          <NavLink
            to="/dashboard/clases"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isActive
                  ? 'bg-brand-50 text-brand-700 font-bold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <i className="fa-solid fa-calendar-days text-brand-600 w-4"></i> Mis Clases
          </NavLink>

          <NavLink
            to="/dashboard/tutores"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isActive
                  ? 'bg-brand-50 text-brand-700 font-bold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <i className="fa-solid fa-user-tie text-brand-600 w-4"></i> Mis Tutores
          </NavLink>

          <NavLink
            to="/dashboard/finanzas"
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                isActive
                  ? 'bg-brand-50 text-brand-700 font-bold shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            <i className="fa-solid fa-receipt text-brand-600 w-4"></i> Finanzas & Recibos
          </NavLink>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <p className="px-3 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-2">
              Comunidad
            </p>
            <Link
              to="/explorar"
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-semibold text-sm transition-all group"
            >
              <i className="fa-solid fa-compass text-slate-400 group-hover:text-brand-600 w-4 transition-colors"></i>{' '}
              Buscar Nuevos Tutores
            </Link>
          </div>
        </nav>

        {/* Bottom Session Logout */}
        <div className="p-4 border-t border-slate-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-slate-500 hover:bg-red-50 hover:text-red-600 font-semibold text-sm transition-all"
          >
            <i className="fa-solid fa-arrow-right-from-bracket w-4"></i> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
        ></div>
      )}

      {/* ================= MAIN CONTENT CONTAINER ================= */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-18 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:text-brand-600"
            >
              <i className="fa-solid fa-bars text-lg"></i>
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">{title}</h2>
              <p className="text-xs text-slate-400 hidden sm:block">Panel de control de tu aprendizaje</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/explorar"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-brand-50 text-brand-700 hover:bg-brand-100 font-bold text-xs transition-colors"
            >
              <i className="fa-solid fa-plus text-xs"></i> Reservar Nueva Clase
            </Link>
            <button className="w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:text-brand-600 hover:border-brand-200 transition-all flex items-center justify-center relative">
              <i className="fa-regular fa-bell text-sm"></i>
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <Link to="/aula-virtual" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-all">
              <i className="fa-solid fa-video text-xs"></i> Aula Virtual
            </Link>
          </div>
        </header>

        {/* Scrollable Sub-Page Outlet */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
