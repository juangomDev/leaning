import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar = () => {
  const { user, profile, role, signOut, isSupabaseConfigured, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
      {/* Supabase status banner if in demo mode */}
      {!isSupabaseConfigured && (
        <div className="bg-amber-500/10 text-amber-800 border-b border-amber-200 text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
          <i className="fa-solid fa-cloud text-amber-600"></i>
          <span>
            Modo Demo local activo. Configura <code>VITE_SUPABASE_URL</code> en <code>.env</code> para producción.
          </span>
          <div className="inline-flex gap-1.5 ml-2">
            <button 
              onClick={() => demoLogin('student')}
              className="text-[11px] bg-amber-200/80 hover:bg-amber-300 text-amber-900 px-2 py-0.5 rounded font-bold transition-colors"
            >
              Demo Alumno
            </button>
            <button 
              onClick={() => demoLogin('tutor')}
              className="text-[11px] bg-amber-200/80 hover:bg-amber-300 text-amber-900 px-2 py-0.5 rounded font-bold transition-colors"
            >
              Demo Tutor
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between py-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30">
            <i className="fa-solid fa-graduation-cap text-sm"></i>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Edu<span className="text-brand-600">Connect</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-slate-600">
          <Link to="/explorar" className="hover:text-brand-600 transition-colors flex items-center gap-1.5">
            <i className="fa-solid fa-compass text-xs"></i> Explorar
          </Link>
          <a href="/#como-funciona" className="hover:text-brand-600 transition-colors">
            ¿Cómo funciona?
          </a>
          <Link to="/registro-tutor" className="hover:text-brand-600 transition-colors">
            Enseñar
          </Link>
          {user && (
            <Link 
              to={role === 'tutor' ? '/dashboard/tutor' : '/dashboard'} 
              className="hover:text-brand-600 transition-colors flex items-center gap-1.5 font-bold text-brand-600"
            >
              <i className="fa-solid fa-chart-pie text-xs"></i> Mi Portal
            </Link>
          )}
        </nav>

        {/* Auth / Action Buttons */}
        <div className="flex items-center gap-2.5">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2.5 p-1.5 pl-3 rounded-xl border border-slate-200 hover:border-brand-300 bg-white transition-all"
              >
                <span className="text-xs font-bold text-slate-800 hidden sm:inline">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-brand-50 text-brand-700">
                  {role === 'tutor' ? 'Tutor' : 'Estudiante'}
                </span>
                <img 
                  src={profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-200/80 py-2 z-50 animate-fadeIn">
                  <Link 
                    to={role === 'tutor' ? '/dashboard/tutor' : '/dashboard'}
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 font-medium"
                  >
                    <i className="fa-solid fa-chart-pie text-xs w-4"></i> Mi Dashboard
                  </Link>
                  <Link 
                    to="/aula-virtual"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-brand-600 font-medium"
                  >
                    <i className="fa-solid fa-video text-xs w-4 text-red-500"></i> Aula Virtual
                  </Link>
                  <div className="my-1 border-t border-slate-100"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-semibold"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket text-xs w-4"></i> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link 
                to="/login-registro" 
                className="hidden sm:inline-flex px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors rounded-lg hover:bg-slate-50"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/explorar" 
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/20 hover:shadow-lg transition-all duration-200"
              >
                <i className="fa-solid fa-magnifying-glass text-xs"></i> Buscar Tutor
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-brand-600"
            aria-label="Abrir menú"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-3 shadow-lg">
          <Link 
            to="/explorar" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 flex items-center gap-2"
          >
            <i className="fa-solid fa-compass text-xs text-brand-600"></i> Explorar Tutores
          </Link>
          <a 
            href="/#como-funciona" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 flex items-center gap-2"
          >
            <i className="fa-solid fa-circle-question text-xs text-brand-600"></i> ¿Cómo funciona?
          </a>
          <Link 
            to="/registro-tutor" 
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-sm font-semibold text-brand-600 flex items-center gap-2"
          >
            <i className="fa-solid fa-chalkboard-user text-xs text-brand-600"></i> Enseñar en EduConnect
          </Link>

          {user ? (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link 
                to={role === 'tutor' ? '/dashboard/tutor' : '/dashboard'} 
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-sm font-bold text-slate-800 flex items-center gap-2"
              >
                <i className="fa-solid fa-chart-pie text-brand-600 text-xs"></i> Mi Dashboard
              </Link>
              <button 
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="py-2 text-left text-sm font-semibold text-red-600 flex items-center gap-2"
              >
                <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i> Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link 
                to="/login-registro" 
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-sm font-semibold text-slate-700 hover:text-brand-600"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/explorar" 
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex items-center justify-center gap-2 py-2.5 bg-brand-600 text-white font-bold text-sm rounded-xl"
              >
                Buscar Tutor
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
