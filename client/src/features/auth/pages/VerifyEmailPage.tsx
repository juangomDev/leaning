import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { authService } from '../services/authService';
import { extractErrorMessage } from '../../../api/apiClient';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || searchParams.get('code') || '';

  const [verifying, setVerifying] = useState<boolean>(Boolean(token));
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Resend form state
  const [resendEmail, setResendEmail] = useState<string>('');
  const [resending, setResending] = useState<boolean>(false);
  const [resendSuccess, setResendSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (token) {
      authService
        .verifyEmail(token)
        .then(() => {
          setIsSuccess(true);
        })
        .catch((err) => {
          setErrorMessage(
            extractErrorMessage(err, 'El enlace de verificación es inválido o ha expirado.')
          );
        })
        .finally(() => {
          setVerifying(false);
        });
    }
  }, [token]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;

    setResending(true);
    try {
      await authService.resendVerification(resendEmail);
      setResendSuccess(true);
    } catch {
      setResendSuccess(true); // Siempre positivo por seguridad
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout
      title="Verificación de Correo"
      subtitle="Confirma tu dirección de email para activar todas las funciones de tu cuenta."
      badge="Validación de Cuenta"
    >
      {verifying ? (
        <div className="text-center py-8 space-y-4">
          <div className="w-12 h-12 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs font-semibold text-slate-600">Verificando tu cuenta de EduConnect...</p>
        </div>
      ) : isSuccess ? (
        <div className="text-center space-y-5 py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-slate-900">¡Correo Electrónico Verificado!</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tu cuenta ha sido validada exitosamente. Ya puedes continuar con la configuración de tu
              perfil y reservar tutorías.
            </p>
          </div>
          <Link
            to="/onboarding"
            className="inline-block w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-2xl shadow-lg shadow-brand-500/20 transition-all"
          >
            Continuar al Onboarding
          </Link>
        </div>
      ) : (
        <div className="space-y-6 py-2">
          {errorMessage ? (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium flex items-center gap-3">
              <i className="fa-solid fa-triangle-exclamation text-amber-500 text-sm"></i>
              <span>{errorMessage}</span>
            </div>
          ) : (
            <p className="text-xs text-slate-600 leading-relaxed">
              Ingresa el correo con el que te registraste para enviarte un nuevo enlace de verificación.
            </p>
          )}

          {resendSuccess ? (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-center gap-3">
              <i className="fa-solid fa-circle-check text-emerald-500 text-sm"></i>
              <span>Si el correo está registrado, hemos enviado un nuevo enlace de verificación.</span>
            </div>
          ) : (
            <form onSubmit={handleResend} className="space-y-4">
              <div>
                <label className="auth-form-label">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="auth-input"
                />
              </div>

              <button
                type="submit"
                disabled={resending}
                className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all"
              >
                {resending ? 'Enviando enlace...' : 'Reenviar Correo de Verificación'}
              </button>
            </form>
          )}

          <div className="pt-2 text-center">
            <Link to="/login" className="text-xs font-bold text-brand-600 hover:underline">
              Volver a Iniciar Sesión
            </Link>
          </div>
        </div>
      )}
    </AuthLayout>
  );
};
