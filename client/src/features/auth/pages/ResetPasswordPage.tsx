import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthLayout } from '../components/AuthLayout';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { authService } from '../services/authService';
import { extractErrorMessage } from '../../../api/apiClient';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg('El token de restablecimiento no fue encontrado o es inválido.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      await authService.resetPassword(token, newPassword);
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Error al restablecer la contraseña.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Restablecer Contraseña"
      subtitle="Crea una contraseña nueva y segura para tu cuenta en EduConnect."
      badge="Nueva Clave"
    >
      {!token ? (
        <div className="text-center space-y-4 py-4">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-500 flex items-center justify-center text-xl mx-auto">
            <i className="fa-solid fa-link-slash"></i>
          </div>
          <h3 className="text-base font-bold text-slate-900">Enlace Inválido o Faltante</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            No se encontró el token de seguridad necesario para cambiar tu contraseña. Por favor solicita
            un nuevo enlace.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block py-2.5 px-5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-colors"
          >
            Solicitar Nuevo Enlace
          </Link>
        </div>
      ) : isSuccess ? (
        <div className="text-center space-y-5 py-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl mx-auto">
            <i className="fa-solid fa-circle-check"></i>
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-extrabold text-slate-900">¡Contraseña Actualizada!</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Tu contraseña ha sido restablecida con éxito. Ya puedes iniciar sesión con tus nuevas
              credenciales.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-block w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-2xl shadow-lg shadow-brand-500/20 transition-all"
          >
            Iniciar Sesión Ahora
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-3">
              <i className="fa-solid fa-circle-exclamation text-red-500 text-sm"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          <div>
            <label className="auth-form-label">
              Nueva Contraseña
            </label>
            <div className="input-with-icon-wrapper">
              <i className="fa-solid fa-lock input-icon-left"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
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
            <PasswordStrengthMeter password={newPassword} />
          </div>

          <div>
            <label className="auth-form-label">
              Confirmar Nueva Contraseña
            </label>
            <div className="input-with-icon-wrapper">
              <i className="fa-solid fa-shield-halved input-icon-left"></i>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                className="auth-input has-left-icon"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-bold rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Actualizando contraseña...</span>
              </>
            ) : (
              <>
                <span>Guardar Nueva Contraseña</span>
                <i className="fa-solid fa-arrow-right text-xs"></i>
              </>
            )}
          </button>
        </form>
      )}
    </AuthLayout>
  );
};
