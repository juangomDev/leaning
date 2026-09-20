import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { extractErrorMessage } from '../../../api/apiClient';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, demoLogin } = useAuth();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const redirectTarget = searchParams.get('redirect') || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await signIn(email, password);
      if (res?.error) {
        setErrorMsg(extractErrorMessage(res.error, 'Credenciales inválidas. Verifica tu correo o contraseña.'));
      } else {
        const returnedUser = res.data?.user || res.user;
        const targetRole = returnedUser?.role || (Array.isArray(returnedUser?.roles) ? returnedUser.roles[0] : 'student');
        const defaultDestination = targetRole === 'admin' ? '/admin' : (targetRole === 'tutor' ? '/tutor' : '/student');
        const destination = searchParams.get('redirect') || defaultDestination;
        navigate(destination, { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Credenciales inválidas. Verifica tu correo o contraseña.'));
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (role: 'student' | 'tutor' | 'admin') => {
    setLoading(true);
    setErrorMsg('');
    try {
      await demoLogin(role);
      const destination = role === 'admin' ? '/admin' : (role === 'tutor' ? '/tutor' : '/student');
      navigate(destination, { replace: true });
    } catch (err: any) {
      setErrorMsg('Error al conectar con la cuenta demo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Bienvenido de vuelta"
      subtitle="Ingresa tus credenciales para acceder a tus clases y tutorías."
      badge="Iniciar Sesión"
    >
      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-3">
          <i className="fa-solid fa-circle-exclamation text-red-500 text-sm"></i>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="auth-form-label">
            Correo Electrónico
          </label>
          <div className="input-with-icon-wrapper">
            <i className="fa-solid fa-envelope input-icon-left"></i>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@correo.com"
              className="auth-input has-left-icon"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="auth-form-label" style={{ marginBottom: 0 }}>
              Contraseña
            </label>
            <Link
              to="/forgot-password"
              className="text-xs font-bold text-brand-600 hover:text-brand-800 transition-colors"
            >
              ¿Olvidaste tu contraseña?
            </Link>
          </div>
          <div className="input-with-icon-wrapper">
            <i className="fa-solid fa-lock input-icon-left"></i>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="auth-input has-left-icon has-right-icon"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="input-icon-right"
              aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
            />
            <span>Recordar mi sesión</span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-bold rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Ingresando...</span>
            </>
          ) : (
            <>
              <span>Iniciar Sesión</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </>
          )}
        </button>
      </form>

      {/* Quick Demo Logins */}
      <div className="mt-8 pt-6 border-t border-slate-100">
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
          Accesos Demo Rápidos
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemo('student')}
            disabled={loading}
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <i className="fa-solid fa-graduation-cap text-xs"></i>
            <span>Demo Alumno</span>
          </button>
          <button
            type="button"
            onClick={() => handleDemo('tutor')}
            disabled={loading}
            className="py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
          >
            <i className="fa-solid fa-chalkboard-user text-xs"></i>
            <span>Demo Tutor</span>
          </button>
        </div>
      </div>

      {/* Register redirect prompt */}
      <div className="mt-8 text-center text-xs text-slate-500">
        ¿Aún no tienes una cuenta?{' '}
        <Link to="/register" className="font-bold text-brand-600 hover:underline">
          Regístrate gratis
        </Link>
      </div>
    </AuthLayout>
  );
};
