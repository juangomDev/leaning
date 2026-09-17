import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginRegistro = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp, demoLogin } = useAuth();

  const [panel, setPanel] = useState(searchParams.get('mode') === 'register' ? 'register' : 'login');
  const [role, setRole] = useState(searchParams.get('role') === 'tutor' ? 'tutor' : 'student');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const redirectTarget = searchParams.get('redirect');

  // Password strength
  const getPasswordStrength = () => {
    if (!password) return 0;
    let score = 0;
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    return score; // 0 to 4
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setErrorMsg(error.message || 'Credenciales inválidas');
      } else {
        navigate(redirectTarget === 'booking' ? -1 : '/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      const { error } = await signUp(email, password, {
        fullName,
        role,
        phone,
      });
      if (error) {
        setErrorMsg(error.message || 'No se pudo crear la cuenta');
      } else {
        navigate(role === 'tutor' ? '/dashboard/tutor' : '/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = (demoRole) => {
    demoLogin(demoRole);
    navigate(demoRole === 'tutor' ? '/dashboard/tutor' : '/dashboard');
  };

  const strength = getPasswordStrength();

  return (
    <div className="auth-page">
      {/* Top bar */}
      <div className="auth-topbar">
        <Link to="/" className="navbar-brand">
          <div className="navbar-brand-icon">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <span className="navbar-brand-text">
            Edu<span className="navbar-brand-accent">Connect</span>
          </span>
        </Link>
        <Link
          to="/"
          style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-slate-500)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        >
          <i className="fa-solid fa-arrow-left" style={{ fontSize: '10px' }}></i> Volver al inicio
        </Link>
      </div>

      <main className="auth-main-container">
        <div className="auth-card-box">
          {/* Booking Context Banner */}
          {redirectTarget === 'booking' && (
            <div className="alert alert-info" style={{ marginBottom: '1.5rem' }}>
              <div style={{ width: '2rem', height: '2rem', borderRadius: 'var(--radius-xl)', backgroundColor: 'var(--color-brand-600)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.875rem' }}>
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <div>
                <h3 style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', margin: '0 0 2px 0' }}>
                  Inicia sesión para continuar
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--color-brand-700)', lineHeight: 1.4, margin: 0 }}>
                  Para confirmar tu reserva de clase, ingresa a tu cuenta o regístrate en segundos.
                </p>
              </div>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="auth-tabs-switcher">
            <button
              onClick={() => { setPanel('login'); setErrorMsg(''); }}
              className={`auth-tab-toggle ${panel === 'login' ? 'active' : ''}`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setPanel('register'); setErrorMsg(''); }}
              className={`auth-tab-toggle ${panel === 'register' ? 'active' : ''}`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Access Bar */}
          <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-slate-200)', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-slate-500)', margin: '0 0 0.5rem 0' }}>Acceso rápido de prueba:</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => handleDemo('student')}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, padding: '6px 8px', fontSize: 11 }}
              >
                <i className="fa-solid fa-user-graduate" style={{ marginRight: 4 }}></i> Alumno
              </button>
              <button
                type="button"
                onClick={() => handleDemo('tutor')}
                className="btn btn-secondary btn-sm"
                style={{ flex: 1, padding: '6px 8px', fontSize: 11 }}
              >
                <i className="fa-solid fa-chalkboard-user" style={{ marginRight: 4 }}></i> Tutor
              </button>
            </div>
          </div>

          {/* ======= LOGIN PANEL ======= */}
          {panel === 'login' ? (
            <div className="auth-card">
              <div className="auth-card-header">
                <h1 className="auth-card-title">¡Hola de nuevo!</h1>
                <p className="auth-card-sub">Accede a tu cuenta de EduConnect</p>
              </div>

              {/* Social Login */}
              <div className="auth-social-grid">
                <button
                  type="button"
                  onClick={() => handleDemo('student')}
                  className="auth-social-btn"
                >
                  <i className="fa-brands fa-google" style={{ color: '#ef4444' }}></i> Google
                </button>
                <button
                  type="button"
                  onClick={() => handleDemo('student')}
                  className="auth-social-btn"
                >
                  <i className="fa-brands fa-github" style={{ color: '#0f172a' }}></i> GitHub
                </button>
              </div>

              <div className="auth-divider">
                <span>o con tu correo</span>
              </div>

              <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Correo electrónico</label>
                  <div className="input-group">
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nombre@ejemplo.com"
                      className="input-control"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <label className="form-label" style={{ margin: 0 }}>Contraseña</label>
                    <a href="#recuperar" style={{ fontSize: '11px', color: 'var(--color-brand-600)', textDecoration: 'none', fontWeight: 600 }}>¿Olvidaste?</a>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="input-control"
                      style={{ paddingRight: '2.5rem' }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-slate-400)', cursor: 'pointer', padding: 0 }}
                    >
                      <i className={`fa-regular fa-eye${showPassword ? '-slash' : ''}`}></i>
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-block btn-lg"
                  style={{ marginTop: '0.5rem' }}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              </form>
            </div>
          ) : (
            /* ======= REGISTER PANEL ======= */
            <div className="auth-card">
              <div className="auth-card-header">
                <h1 className="auth-card-title">Crea tu cuenta</h1>
                <p className="auth-card-sub">Únete a la comunidad de aprendizaje</p>
              </div>

              {/* Role Selection */}
              <div className="role-selector-grid">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`role-selector-btn ${role === 'student' ? 'active' : ''}`}
                >
                  <i className="fa-solid fa-graduation-cap" style={{ fontSize: '1.25rem', marginBottom: 4, display: 'block' }}></i>
                  <span style={{ fontSize: '12px', fontWeight: 700, display: 'block' }}>Quiero Aprender</span>
                  <span style={{ fontSize: '10px', color: 'var(--color-slate-400)' }}>Perfil Estudiante</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('tutor')}
                  className={`role-selector-btn ${role === 'tutor' ? 'active' : ''}`}
                >
                  <i className="fa-solid fa-chalkboard-user" style={{ fontSize: '1.25rem', marginBottom: 4, display: 'block' }}></i>
                  <span style={{ fontSize: '12px', fontWeight: 700, display: 'block' }}>Quiero Enseñar</span>
                  <span style={{ fontSize: '10px', color: 'var(--color-slate-400)' }}>Perfil Tutor</span>
                </button>
              </div>

              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                <div className="form-group">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Ej. Camila Torres"
                    className="input-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nombre@ejemplo.com"
                    className="input-control"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contraseña</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Al menos 6 caracteres"
                    className="input-control"
                  />
                  {password && (
                    <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: strength >= i ? 'var(--color-brand-600)' : '#e2e8f0' }}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary btn-block btn-lg"
                  style={{ marginTop: '0.5rem' }}
                >
                  {loading ? 'Creando cuenta...' : 'Crear Cuenta Gratis'}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      <footer style={{ padding: '1rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-slate-400)' }}>
        © 2026 EduConnect. Todos los derechos reservados.
      </footer>
    </div>
  );
};
