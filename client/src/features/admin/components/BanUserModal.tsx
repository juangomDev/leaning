import React, { useState } from 'react';
import { adminService, AdminUser } from '../services/adminService';

interface BanUserModalProps {
  user: AdminUser;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const BanUserModal: React.FC<BanUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [reason, setReason] = useState('Incumplimiento reiterado de los términos del servicio o conducta inapropiada.');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleBan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;

    setLoading(true);
    try {
      await adminService.banUser(user.id, reason);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-user-slash"></i>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">Suspender Cuenta de Usuario</h3>
          <p className="text-xs text-slate-500 mt-1">
            Esta acción revocará el acceso inmediato de <span className="font-bold text-slate-800">{user.full_name}</span> ({user.email}) a la plataforma.
          </p>
        </div>

        <form onSubmit={handleBan} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Motivo formal de la suspensión *
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows={3}
              placeholder="Explica la causa de la sanción administrativa..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px] leading-relaxed">
            <i className="fa-solid fa-triangle-exclamation mr-1.5 text-rose-600"></i>
            El usuario no podrá iniciar sesión ni agendar clases mientras esté suspendido.
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              {loading ? 'Aplicando suspensión...' : 'Confirmar Suspensión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
