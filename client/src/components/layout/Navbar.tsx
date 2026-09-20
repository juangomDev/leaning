import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const { user, profile, role, signOut, isSupabaseConfigured, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState<boolean>(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="navbar">
      {/* Supabase status banner if in demo mode */}
      {!isSupabaseConfigured && (
        <div className="navbar-demo-banner">
          <i className="fa-solid fa-cloud text-amber-600"></i>
          <span>
            Modo Demo local activo. Configura <code>VITE_SUPABASE_URL</code> en <code>.env</code> para producción.
          </span>
          <div className="inline-flex gap-1.5 ml-2">
            <button 
              onClick={() => demoLogin('student')}
              className="navbar-demo-btn"
            >
              Demo Alumno
            </button>
            <button 
              onClick={() => demoLogin('tutor')}
              className="navbar-demo-btn"
            >
              Demo Tutor
            </button>
          </div>
        </div>
      )}

      <div className="navbar-container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand">
          <div className="navbar-brand-icon">
            <i className="fa-solid fa-graduation-cap text-sm"></i>
          </div>
          <span className="navbar-brand-text">
            Edu<span className="navbar-brand-accent">Connect</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="navbar-nav">
          <Link to="/tutors" className="navbar-link">
            <i className="fa-solid fa-compass text-xs"></i> Tutores
          </Link>
          <Link to="/subjects" className="navbar-link">
            <i className="fa-solid fa-shapes text-xs"></i> Materias
          </Link>
          <Link to="/pricing" className="navbar-link">
            <i className="fa-solid fa-tag text-xs"></i> Precios
          </Link>
          <a href="/#como-funciona" className="navbar-link">
            ¿Cómo funciona?
          </a>
          <Link to="/help" className="navbar-link">
            Ayuda
          </Link>
          <Link to="/registro-tutor" className="navbar-link">
            Enseñar
          </Link>
          {user && (
            <Link 
              to={role === 'tutor' ? '/dashboard/tutor' : '/dashboard'} 
              className="navbar-link active font-bold"
            >
              <i className="fa-solid fa-chart-pie text-xs"></i> Mi Portal
            </Link>
          )}
        </nav>

        {/* Auth / Action Buttons */}
        <div className="navbar-actions">
          {user ? (
            <div className="relative">
              <button 
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="navbar-user-btn"
              >
                <span className="navbar-user-name hidden sm:inline">
                  {profile?.full_name || user.email?.split('@')[0]}
                </span>
                <span className="navbar-user-role">
                  {role === 'tutor' ? 'Tutor' : 'Estudiante'}
                </span>
                <img 
                  src={profile?.avatar_url || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"} 
                  alt="Avatar" 
                  className="navbar-user-avatar"
                />
              </button>

              {userDropdownOpen && (
                <div className="navbar-user-dropdown animate-fadeIn">
                  <Link 
                    to={role === 'tutor' ? '/dashboard/tutor' : '/dashboard'}
                    onClick={() => setUserDropdownOpen(false)}
                    className="navbar-user-dropdown-item"
                  >
                    <i className="fa-solid fa-chart-pie text-xs w-4"></i> Mi Dashboard
                  </Link>
                  <Link 
                    to="/aula-virtual"
                    onClick={() => setUserDropdownOpen(false)}
                    className="navbar-user-dropdown-item"
                  >
                    <i className="fa-solid fa-video text-xs w-4 text-red-500"></i> Aula Virtual
                  </Link>
                  <div className="my-1 border-t border-slate-100"></div>
                  <button 
                    onClick={handleLogout}
                    className="w-full navbar-user-dropdown-item text-red-600 hover:bg-red-50 font-semibold"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket text-xs w-4"></i> Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link 
                to="/login" 
                className="navbar-btn-login"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/tutors" 
                className="navbar-btn-search"
              >
                <i className="fa-solid fa-magnifying-glass text-xs"></i> Buscar Tutor
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="navbar-mobile-toggle"
            aria-label="Abrir menú"
          >
            <i className={`fa-solid ${mobileMenuOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="navbar-mobile-menu">
          <Link 
            to="/tutors" 
            onClick={() => setMobileMenuOpen(false)}
            className="navbar-mobile-link flex items-center gap-2"
          >
            <i className="fa-solid fa-compass text-xs text-brand-600"></i> Explorar Tutores
          </Link>
          <Link 
            to="/subjects" 
            onClick={() => setMobileMenuOpen(false)}
            className="navbar-mobile-link flex items-center gap-2"
          >
            <i className="fa-solid fa-shapes text-xs text-brand-600"></i> Materias
          </Link>
          <Link 
            to="/pricing" 
            onClick={() => setMobileMenuOpen(false)}
            className="navbar-mobile-link flex items-center gap-2"
          >
            <i className="fa-solid fa-tag text-xs text-brand-600"></i> Precios
          </Link>
          <a 
            href="/#como-funciona" 
            onClick={() => setMobileMenuOpen(false)}
            className="navbar-mobile-link flex items-center gap-2"
          >
            <i className="fa-solid fa-circle-question text-xs text-brand-600"></i> ¿Cómo funciona?
          </a>
          <Link 
            to="/help" 
            onClick={() => setMobileMenuOpen(false)}
            className="navbar-mobile-link flex items-center gap-2"
          >
            <i className="fa-solid fa-circle-info text-xs text-brand-600"></i> Centro de Ayuda
          </Link>
          <Link 
            to="/registro-tutor" 
            onClick={() => setMobileMenuOpen(false)}
            className="navbar-mobile-link flex items-center gap-2 text-brand-600"
          >
            <i className="fa-solid fa-chalkboard-user text-xs text-brand-600"></i> Enseñar en EduConnect
          </Link>

          {user ? (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link 
                to={role === 'tutor' ? '/dashboard/tutor' : '/dashboard'} 
                onClick={() => setMobileMenuOpen(false)}
                className="navbar-mobile-link flex items-center gap-2 font-bold text-slate-800"
              >
                <i className="fa-solid fa-chart-pie text-brand-600 text-xs"></i> Mi Dashboard
              </Link>
              <button 
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="navbar-mobile-link text-left flex items-center gap-2 text-red-600"
              >
                <i className="fa-solid fa-arrow-right-from-bracket text-xs"></i> Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
              <Link 
                to="/login" 
                onClick={() => setMobileMenuOpen(false)}
                className="navbar-mobile-link"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/tutors" 
                onClick={() => setMobileMenuOpen(false)}
                className="navbar-btn-search text-center justify-center w-full"
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
