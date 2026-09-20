import React, { useState, useEffect } from 'react';
import { 
  adminFinanceService, 
  AdminSystemSettings 
} from '../services/adminFinanceService';
import { 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Mail, 
  Sliders 
} from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<AdminSystemSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await adminFinanceService.getSettings();
      setSettings(data);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error al cargar la configuración del sistema'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      setSaving(true);
      const updated = await adminFinanceService.updateSettings(settings);
      setSettings(updated);
      setNotification({
        type: 'success',
        message: 'Los parámetros del sistema se han actualizado y aplicado correctamente.'
      });
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error al guardar los ajustes'
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="p-16 text-center text-slate-400">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-xs font-semibold">Cargando parámetros globales...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
          <Sliders className="text-blue-600 w-6 h-6" /> Configuración Global de la Plataforma
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Ajusta las políticas económicas, correos de enlace institucional y parámetros de moderación.
        </p>
      </div>

      {/* Notifications */}
      {notification && (
        <div 
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
            notification.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* General Identity */}
        <div className="admin-card space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Identidad Institucional</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Nombre de la Plataforma:</label>
              <input
                type="text"
                required
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                className="input text-xs w-full bg-slate-50 border-slate-200 focus:bg-white"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Correo de Soporte Oficial:</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="email"
                  required
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                  className="input pl-10 text-xs w-full bg-slate-50 border-slate-200 focus:bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Financial Policy */}
        <div className="admin-card space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Política Económica & Comisiones
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Tasa de Comisión por Clase (%):
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.5"
                  required
                  value={settings.commissionRate}
                  onChange={(e) => setSettings({ ...settings, commissionRate: parseFloat(e.target.value) || 0 })}
                  className="input text-xs w-full bg-slate-50 border-slate-200 focus:bg-white pr-8 font-mono font-bold"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">%</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Porcentaje deducido al tutor por cada hora de clase completada.</p>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Monto Mínimo de Retiro ($ USD):
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={settings.minimumWithdrawal}
                  onChange={(e) => setSettings({ ...settings, minimumWithdrawal: parseFloat(e.target.value) || 0 })}
                  className="input pl-10 text-xs w-full bg-slate-50 border-slate-200 focus:bg-white font-mono font-bold"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Límite mínimo requerido para solicitar dispersión bancaria.</p>
            </div>
          </div>
        </div>

        {/* Operational Toggles */}
        <div className="admin-card space-y-4">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Modos Operativos</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all cursor-pointer">
              <div>
                <span className="font-bold text-slate-900 text-xs block">Aprobación Automática de Nuevos Tutores</span>
                <span className="text-[11px] text-slate-400">Si se activa, los tutores no requerirán validación manual de títulos.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.autoApproveTutors}
                onChange={(e) => setSettings({ ...settings, autoApproveTutors: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between p-3 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 transition-all cursor-pointer">
              <div>
                <span className="font-bold text-rose-900 text-xs block">Modo Mantenimiento Global</span>
                <span className="text-[11px] text-rose-600">Restringe el acceso general y muestra un aviso de actualización temporal.</span>
              </div>
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                className="w-4 h-4 text-rose-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={fetchSettings}
            className="btn btn-secondary text-xs"
          >
            Descartar Cambios
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn btn-primary text-xs font-bold inline-flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar Parámetros'}
          </button>
        </div>
      </form>
    </div>
  );
};
