import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const TutorSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'NOTIFICATIONS' | 'VERIFICATION' | 'SECURITY'>('VERIFICATION');

  // Notifications
  const [notifyNewBooking, setNotifyNewBooking] = useState(true);
  const [notifyReminder, setNotifyReminder] = useState(true);
  const [notifyPayout, setNotifyPayout] = useState(true);

  // Security
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSaveNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg('Preferencias de notificaciones guardadas exitosamente.');
    }, 400);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden.');
      return;
    }
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccessMsg('Contraseña actualizada correctamente.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ajustes y Verificación Docente</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Administra tus notificaciones, estado de validación de títulos y credenciales de seguridad
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
            setActiveTab('VERIFICATION');
            setSuccessMsg(null);
            setErrorMsg(null);
          }}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'VERIFICATION'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="fa-solid fa-shield-check mr-2"></i>
          Verificación y Títulos
        </button>

        <button
          onClick={() => {
            setActiveTab('NOTIFICATIONS');
            setSuccessMsg(null);
            setErrorMsg(null);
          }}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'NOTIFICATIONS'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="fa-solid fa-bell mr-2"></i>
          Notificaciones y Alertas
        </button>

        <button
          onClick={() => {
            setActiveTab('SECURITY');
            setSuccessMsg(null);
            setErrorMsg(null);
          }}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'SECURITY'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="fa-solid fa-lock mr-2"></i>
          Seguridad y Clave
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <i className="fa-solid fa-circle-check text-emerald-600"></i>
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation text-rose-600"></i>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tab 1: Verification */}
      {activeTab === 'VERIFICATION' && (
        <div className="space-y-5">
          {/* Badge status card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl shrink-0">
                <i className="fa-solid fa-certificate"></i>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-slate-900">Insignia: Tutor Verificado</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs border border-emerald-200 flex items-center gap-1">
                    <i className="fa-solid fa-check"></i> Activo
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Tu identidad y credenciales académicas han sido auditadas satisfactoriamente por el equipo de EduConnect.
                </p>
              </div>
            </div>
          </div>

          {/* Uploaded Documents List */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
              Documentos Académicos y Credenciales
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-file-pdf text-rose-500 text-xl"></i>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Doctorado_Fisica_Titulo.pdf</p>
                    <p className="text-[10px] text-slate-400">Verificado el 15/01/2026</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">Aprobado</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-id-card text-purple-600 text-xl"></i>
                  <div>
                    <p className="text-xs font-bold text-slate-800">Identificacion_Oficial_Tutor.jpg</p>
                    <p className="text-[10px] text-slate-400">Verificado el 15/01/2026</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">Aprobado</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => alert('Carga de documento adicional simulada.')}
                className="px-4 py-2 rounded-xl border border-dashed border-purple-300 hover:border-purple-600 text-purple-700 bg-purple-50/50 hover:bg-purple-100/50 font-bold text-xs transition-colors flex items-center gap-2"
              >
                <i className="fa-solid fa-upload"></i>
                <span>Adjuntar Nuevo Certificado o Especialidad</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Notifications */}
      {activeTab === 'NOTIFICATIONS' && (
        <form onSubmit={handleSaveNotifications} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
            Alertas de Reservas e Ingresos
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Nuevas Solicitudes de Alumnos</p>
                <p className="text-[11px] text-slate-400">Recibe una notificación inmediata cuando un alumno agende una clase</p>
              </div>
              <input
                type="checkbox"
                checked={notifyNewBooking}
                onChange={(e) => setNotifyNewBooking(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Recordatorio 15 Minutos Antes de la Clase</p>
                <p className="text-[11px] text-slate-400">Aviso con enlace directo para abrir el Aula Virtual</p>
              </div>
              <input
                type="checkbox"
                checked={notifyReminder}
                onChange={(e) => setNotifyReminder(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <div>
                <p className="text-xs font-bold text-slate-800">Confirmación de Transferencias y Retiros</p>
                <p className="text-[11px] text-slate-400">Recibe el recibo cuando tu pago se procese a tu cuenta bancaria</p>
              </div>
              <input
                type="checkbox"
                checked={notifyPayout}
                onChange={(e) => setNotifyPayout(e.target.checked)}
                className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 accent-purple-600"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors shadow-sm"
            >
              Guardar Preferencias
            </button>
          </div>
        </form>
      )}

      {/* Tab 3: Security */}
      {activeTab === 'SECURITY' && (
        <form onSubmit={handleSavePassword} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-sm font-black text-slate-900 pb-2 border-b border-slate-100">
            Actualizar Contraseña de Acceso
          </h3>

          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Contraseña Actual *</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Confirmar Nueva Contraseña *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 transition-colors shadow-sm"
            >
              Actualizar Clave
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
