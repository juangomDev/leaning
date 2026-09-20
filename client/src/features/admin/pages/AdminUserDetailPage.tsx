import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { adminService, AdminUser } from '../services/adminService';
import { BanUserModal } from '../components/BanUserModal';

export const AdminUserDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);

  const fetchUser = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await adminService.getUserById(id);
      setUser(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleUnban = async () => {
    if (!user || !confirm('¿Deseas reactivar esta cuenta?')) return;
    await adminService.unbanUser(user.id);
    fetchUser();
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80">
        <i className="fa-solid fa-circle-notch fa-spin text-3xl text-brand-600 mb-3"></i>
        <p className="text-sm font-medium text-slate-600">Cargando expediente de usuario...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-16 text-center bg-white rounded-3xl border border-slate-200/80 max-w-md mx-auto p-6">
        <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4">
          <i className="fa-solid fa-user-xmark text-2xl"></i>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Usuario no encontrado</h2>
        <Link
          to="/admin/users"
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors"
        >
          Volver a Usuarios
        </Link>
      </div>
    );
  }

  const isBanned = user.status === 'banned';

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top navigation */}
      <div>
        <Link
          to="/admin/users"
          className="text-xs text-brand-600 font-bold hover:underline inline-flex items-center gap-1.5 mb-2"
        >
          <i className="fa-solid fa-arrow-left"></i> Volver a Todos los Usuarios
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Ficha de Usuario: {user.full_name}
          </h1>
          <div>
            {isBanned ? (
              <button
                onClick={handleUnban}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <i className="fa-solid fa-user-check mr-1.5"></i>
                Reactivar Cuenta
              </button>
            ) : (
              <button
                onClick={() => setIsBanModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm"
              >
                <i className="fa-solid fa-user-slash mr-1.5"></i>
                Suspender Cuenta
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Suspension Alert if Banned */}
      {isBanned && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-3">
          <i className="fa-solid fa-triangle-exclamation text-rose-600 text-base mt-0.5"></i>
          <div>
            <p className="font-bold">Esta cuenta se encuentra suspendida por la administración</p>
            <p className="mt-0.5 text-rose-700">Motivo: {user.banReason || 'Incumplimiento de términos'}</p>
          </div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
          <img
            src={user.avatar_url}
            alt={user.full_name}
            className="w-20 h-20 rounded-2xl object-cover border-2 border-slate-200 shadow-xs"
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-slate-900">{user.full_name}</h2>
              <span className={`admin-badge ${isBanned ? 'admin-badge-banned' : 'admin-badge-active'}`}>
                {isBanned ? 'Suspendido' : 'Activo'}
              </span>
            </div>
            <p className="text-xs text-slate-500">{user.email}</p>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-bold text-slate-400">Roles:</span>
              {user.roles.map(r => (
                <span key={r} className="px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 font-bold text-[10px] uppercase">
                  {r}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Identificador Único (ID)</span>
            <span className="font-bold text-slate-800 font-mono mt-0.5 block">{user.id}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Fecha de Registro</span>
            <span className="font-bold text-slate-800 mt-0.5 block">{user.createdAt}</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Saldo en Billetera</span>
            <span className="text-base font-black text-emerald-600 mt-0.5 block">${user.walletBalance.toFixed(2)} USD</span>
          </div>
        </div>
      </div>

      {/* Ban Modal */}
      <BanUserModal
        user={user}
        isOpen={isBanModalOpen}
        onClose={() => setIsBanModalOpen(false)}
        onSuccess={fetchUser}
      />
    </div>
  );
};
