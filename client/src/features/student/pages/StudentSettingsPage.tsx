import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { studentService, StudentSettingsData } from '../services/studentService';
import { extractErrorMessage } from '../../../api/apiClient';

export const StudentSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'PREFERENCES' | 'SECURITY' | 'SESSIONS'>('PREFERENCES');

  // Preferences state
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [classReminders, setClassReminders] = useState(true);
  const [promotionalEmails, setPromotionalEmails] = useState(false);
  const [timezone, setTimezone] = useState('America/Bogota');
  const [language, setLanguage] = useState('es');

  // Security state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const payload: Partial<StudentSettingsData> = {
        email_notifications: emailNotifications,
        class_reminders: classReminders,
        promotional_emails: promotionalEmails,
        timezone,
        language,
      };

      await studentService.updateSettings(payload);
      setSuccessMessage('Preferencias de cuenta guardadas correctamente.');
    } catch (err) {
      setErrorMessage(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (newPassword !== confirmPassword) {
      setErrorMessage('Las contraseñas nuevas no coinciden.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('La nueva contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setSaving(true);
    try {
      await studentService.changePassword(currentPassword, newPassword);
      setSuccessMessage('Tu contraseña ha sido actualizada exitosamente.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setErrorMessage(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Configuración de Cuenta</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Administra tus notificaciones, seguridad de acceso y preferencias
          </p>
        </div>
        <Link
          to="/account/roles"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-50 text-purple-700 border border-purple-200 text-xs font-bold hover:bg-purple-100 transition-colors shrink-0"
        >
          <i className="fa-solid fa-users-gear"></i>
          <span>Gestión de Roles</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => {
            setActiveTab('PREFERENCES');
            setSuccessMessage(null);
            setErrorMessage(null);
          }}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'PREFERENCES'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="fa-solid fa-sliders mr-2"></i>
          Preferencias y Notificaciones
        </button>

        <button
          onClick={() => {
            setActiveTab('SECURITY');
            setSuccessMessage(null);
            setErrorMessage(null);
          }}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'SECURITY'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="fa-solid fa-lock mr-2"></i>
          Seguridad y Clave
        </button>

        <button
          onClick={() => {
            setActiveTab('SESSIONS');
            setSuccessMessage(null);
            setErrorMessage(null);
          }}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'SESSIONS'
              ? 'border-brand-600 text-brand-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="fa-solid fa-laptop mr-2"></i>
          Sesiones Activas
        </button>
      </div>

      {/* Alert Banners */}
      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
          <i className="fa-solid fa-circle-check text-emerald-500 text-sm"></i>
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <i className="fa-solid fa-circle-exclamation text-rose-500 text-sm"></i>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tab 1: Preferences */}
      {activeTab === 'PREFERENCES' && (
        <form onSubmit={handleSavePreferences} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Notificaciones de Estudio
          </h2>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Recordatorios de Clases</p>
                <p className="text-[11px] text-slate-400">Recibe un correo 1 hora antes del inicio de tu sesión programada</p>
              </div>
              <input
                type="checkbox"
                checked={classReminders}
                onChange={(e) => setClassReminders(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 accent-brand-600"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Actualizaciones de Reserva y Reembolsos</p>
                <p className="text-[11px] text-slate-400">Confirmaciones de pago, cancelaciones o cambios de horario</p>
              </div>
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 accent-brand-600"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Ofertas y Nuevos Profesores</p>
                <p className="text-[11px] text-slate-400">Boletín mensual con promociones y tutores destacados</p>
              </div>
              <input
                type="checkbox"
                checked={promotionalEmails}
                onChange={(e) => setPromotionalEmails(e.target.checked)}
                className="w-4 h-4 rounded text-brand-600 focus:ring-brand-500 accent-brand-600"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Zona Horaria</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                <option value="America/Bogota">GMT-5 (Colombia, Perú, Ecuador)</option>
                <option value="America/Mexico_City">GMT-6 (Ciudad de México)</option>
                <option value="America/Argentina/Buenos_Aires">GMT-3 (Argentina, Chile)</option>
                <option value="Europe/Madrid">GMT+1 (España peninsular)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Idioma de la Plataforma</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                <option value="es">Español (Latinoamérica / España)</option>
                <option value="en">English (US)</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              Guardar Preferencias
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Security */}
      {activeTab === 'SECURITY' && (
        <form onSubmit={handlePasswordChange} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Cambiar Contraseña
          </h2>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Contraseña Actual *</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nueva Contraseña *</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">Mínimo 8 caracteres, combinación de letras y números</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirmar Nueva Contraseña *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              Actualizar Contraseña
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Active Sessions */}
      {activeTab === 'SESSIONS' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Dispositivos Conectados
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Sesiones donde tu cuenta está iniciada</p>
            </div>
            <button
              type="button"
              onClick={() => alert('Todas las otras sesiones han sido finalizadas.')}
              className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-700 bg-rose-50 hover:bg-rose-100 text-xs font-bold transition-colors"
            >
              Cerrar otras sesiones
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center">
                  <i className="fa-solid fa-laptop text-lg"></i>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-bold text-slate-800">Windows 11 • Chrome 124.0</p>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-black">
                      ESTA SESIÓN
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">Activo ahora mismo • Dirección IP: 186.28.***.***</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center">
                  <i className="fa-solid fa-mobile-screen text-lg"></i>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">iPhone 14 • Safari Mobile</p>
                  <p className="text-[11px] text-slate-400">Última actividad hace 2 días</p>
                </div>
              </div>
              <button
                type="button"
                className="text-xs text-slate-400 hover:text-rose-600 font-semibold"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
