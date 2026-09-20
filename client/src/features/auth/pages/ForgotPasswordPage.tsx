import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { authService } from '../services/authService';
import { extractErrorMessage } from '../../../api/apiClient';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Por favor ingresa tu correo electrónico.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await authService.forgotPassword(email);
      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Error al solicitar el enlace de recuperación.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Recuperar Contraseña"
      subtitle="Te enviaremos un enlace seguro para restablecer el acceso a tu cuenta."
      badge="Seguridad"
    >
      {isSubmitted ? (
        <div className="text-center space-y-6 py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto shadow-sm">
            <i className="fa-solid fa-paper-plane"></i>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-extrabold text-slate-900">
              ¡Revisa tu bandeja de entrada!
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Si existe una cuenta asociada a <strong>{email}</strong>, recibirás un correo con las
              instrucciones para restablecer tu contraseña.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 text-left space-y-1">
            <p className="font-bold text-slate-700">¿No recibes el correo?</p>
            <p>1. Revisa tu carpeta de correo no deseado (spam).</p>
            <p>2. El enlace es válido durante 1 hora.</p>
          </div>

          <div className="space-y-2 pt-2">
            <button
              type="button"
              onClick={() => setIsSubmitted(false)}
              className="w-full py-3 px-4 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-colors"
            >
              Probar con otro correo
            </button>
            <Link
              to="/login"
              className="block w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-colors"
            >
              Volver a Iniciar Sesión
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-3">
              <i className="fa-solid fa-circle-exclamation text-red-500 text-sm"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="auth-form-label">
              Correo Electrónico de tu cuenta
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

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-bold rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Enviando enlace...</span>
              </>
            ) : (
              <>
                <span>Enviar Enlace de Recuperación</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </>
            )}
          </button>

          <div className="text-center pt-3">
            <Link
              to="/login"
              className="text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors inline-flex items-center gap-1.5"
            >
              <i className="fa-solid fa-arrow-left text-[10px]"></i> Volver a Iniciar Sesión
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
};
