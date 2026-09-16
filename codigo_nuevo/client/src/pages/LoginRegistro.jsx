import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginRegistro = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { signIn, signUp, demoLogin, isSupabaseConfigured } = useAuth();

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
  const strengthColors = ['bg-slate-200', 'bg-red-500', 'bg-amber-500', 'bg-blue-500', 'bg-emerald-500'];

  return (
    <div className="bg-gradient-to-br from-slate-100 via-brand-50 to-slate-100 min-h-screen antialiased flex flex-col justify-between selection:bg-brand-500 selection:text-white">
      {/* Top bar */}
      <div className="py-5 px-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 text-sm">
            <i className="fa-solid fa-graduation-cap"></i>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900">
            Edu<span className="text-brand-600">Connect</span>
          </span>
        </Link>
        <Link
          to="/"
          className="text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors flex items-center gap-1.5"
        >
          <i className="fa-solid fa-arrow-left text-[10px]"></i> Volver al inicio
        </Link>
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Booking Context Banner */}
          {redirectTarget === 'booking' && (
            <div className="mb-6 p-4 rounded-2xl border border-brand-200 bg-brand-50 text-brand-900 shadow-sm flex items-start gap-3 animate-fadeIn">
              <div className="w-8 h-8 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0 mt-0.5 text-sm">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider mb-0.5">
                  Inicia sesión para continuar
                </h3>
                <p className="text-xs text-brand-700 leading-relaxed">
                  Para confirmar tu reserva de clase, ingresa a tu cuenta o regístrate en segundos.
                </p>
              </div>
            </div>
          )}

          {/* Tab Switcher */}
          <div className="flex bg-white rounded-2xl p-1.5 shadow-sm border border-slate-200/80 mb-6">
            <button
              onClick={() => { setPanel('login'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                panel === 'login'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              onClick={() => { setPanel('register'); setErrorMsg(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                panel === 'register'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Crear Cuenta
            </button>
          </div>

          {/* Error Message if any */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <i className="fa-solid fa-circle-exclamation"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Access Bar */}
          <div className="mb-4 p-3 bg-white/80 rounded-2xl border border-slate-200 text-center">
            <p className="text-[11px] font-semibold text-slate-500 mb-2">Acceso rápido de prueba:</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleDemo('student')}
                className="flex-1 py-1.5 px-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold transition-colors"
              >
                <i className="fa-solid fa-user-graduate mr-1"></i> Entrar como Alumno
              </button>
              <button
                type="button"
                onClick={() => handleDemo('tutor')}
                className="flex-1 py-1.5 px-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-bold transition-colors"
              >
                <i className="fa-solid fa-chalkboard-user mr-1"></i> Entrar como Tutor
              </button>
            </div>
          </div>

          {/* ======= LOGIN PANEL ======= */}
          {panel === 'login' ? (
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-8 space-y-5 animate-fadeIn">
              <div className="text-center">
                <h1 className="text-2xl font-extrabold text-slate-900">¡Hola de nuevo!</h1>
                <p className="text-slate-500 text-sm mt-1">Accede a tu cuenta de EduConnect</p>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleDemo('student')}
                  className="social-btn flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all"
                >
                  <i className="fa-brands fa-google text-red-500"></i> Google
                </button>
                <button
                  type="button"
                  onClick={() => handleDemo('student')}
                  className="social-btn flex items-center justify-center gap-2 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all"
                >
                  <i className="fa-brands fa-github text-slate-900"></i> GitHub
                </button>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200"></div>
                <span className="text-xs text-slate-400 font-medium">o con tu correo</span>
                <div className="flex-1 h-px bg-slate-200"></div>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition-all bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Contraseña
                    </label>
                    <a href="#" className="text-xs text-brand-600 hover:text-brand-800 font-semibold transition-colors">
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <div className="relative">
                    <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition-all bg-slate-50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 accent-brand-600 rounded" />
                  <span className="text-xs text-slate-600">Mantener sesión iniciada</span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl shadow-lg shadow-brand-500/20 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verificando...</span>
                    </>
                  ) : (
                    'Iniciar Sesión'
                  )}
                </button>
              </form>
            </div>
          ) : (
            /* ======= REGISTER PANEL ======= */
            <div className="bg-white rounded-3xl shadow-xl border border-slate-200/60 p-8 space-y-5 animate-fadeIn">
              <div className="text-center">
                <h1 className="text-2xl font-extrabold text-slate-900">Crea tu cuenta</h1>
                <p className="text-slate-500 text-sm mt-1">Únete hoy a la comunidad EduConnect</p>
              </div>

              {/* Role Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  ¿Cómo deseas usar EduConnect?
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      role === 'student'
                        ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-blue-100 text-brand-600 flex items-center justify-center mb-2 text-sm">
                      <i className="fa-solid fa-user-graduate"></i>
                    </div>
                    <p className="text-xs font-bold text-slate-900">Quiero Aprender</p>
                    <p className="text-[10px] text-slate-500">Estudiante</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('tutor')}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      role === 'tutor'
                        ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center mb-2 text-sm">
                      <i className="fa-solid fa-chalkboard-user"></i>
                    </div>
                    <p className="text-xs font-bold text-slate-900">Quiero Enseñar</p>
                    <p className="text-[10px] text-slate-500">Tutor Docente</p>
                  </button>
                </div>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Nombre Completo
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ej. Sofía Martínez"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition-all bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Correo Electrónico
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition-all bg-slate-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                    Contraseña
                  </label>
                  <div className="relative">
                    <i className="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-500 transition-all bg-slate-50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'} text-sm`}></i>
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1 h-1.5 w-full">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`flex-1 rounded-full transition-all duration-300 ${
                              strength >= step ? strengthColors[strength] : 'bg-slate-200'
                            }`}
                          ></div>
                        ))}
                      </div>
                      <p className="text-[10px] text-slate-400">
                        {strength <= 1 ? 'Seguridad débil' : strength <= 3 ? 'Seguridad media' : 'Contraseña segura'}
                      </p>
                    </div>
                  )}
                </div>

                <label className="flex items-start gap-2.5 cursor-pointer pt-1">
                  <input type="checkbox" required className="w-4 h-4 mt-0.5 accent-brand-600 rounded" />
                  <span className="text-xs text-slate-500 leading-relaxed">
                    Acepto los{' '}
                    <a href="#" className="text-brand-600 underline">Términos de Servicio</a>{' '}
                    y la{' '}
                    <a href="#" className="text-brand-600 underline">Política de Privacidad</a>.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl shadow-lg shadow-brand-500/20 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creando cuenta...</span>
                    </>
                  ) : (
                    'Completar Registro'
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Footer minimal */}
      <footer className="py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white/50">
        © 2026 EduConnect Inc. Todos los derechos reservados.
      </footer>
    </div>
  );
};
