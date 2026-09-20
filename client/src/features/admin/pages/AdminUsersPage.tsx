import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, AdminUser } from '../services/adminService';
import { BanUserModal } from '../components/BanUserModal';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Ban modal
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleUnban = async (userId: string) => {
    if (!confirm('¿Deseas reactivar esta cuenta de usuario?')) return;
    await adminService.unbanUser(userId);
    fetchUsers();
  };

  const filtered = users.filter((u) => {
    const matchesSearch =
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.roles.includes(roleFilter.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || u.status === statusFilter.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Directorio Global de Usuarios</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Gestión de accesos, roles, auditoría de estados y control disciplinario
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative flex-1 w-full">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar por nombre, correo o ID..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none"
          >
            <option value="ALL">Todos los Roles</option>
            <option value="STUDENT">Estudiantes</option>
            <option value="TUTOR">Tutores</option>
            <option value="ADMIN">Administradores</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white focus:outline-none"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="ACTIVE">Activos</option>
            <option value="BANNED">Suspendidos / Banned</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <i className="fa-solid fa-circle-notch fa-spin text-3xl text-brand-600 mb-3"></i>
            <p className="text-sm">Cargando directorio de usuarios...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <i className="fa-solid fa-user-slash text-3xl mb-2 text-slate-300"></i>
            <p className="text-xs font-semibold">No se encontraron usuarios con esos filtros</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-table-th">Usuario</th>
                  <th className="admin-table-th">Roles</th>
                  <th className="admin-table-th">Estado</th>
                  <th className="admin-table-th">Saldo Billetera</th>
                  <th className="admin-table-th">Último Acceso</th>
                  <th className="admin-table-th text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const isBanned = u.status === 'banned';
                  return (
                    <tr key={u.id}>
                      <td className="admin-table-td">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar_url}
                            alt={u.full_name}
                            className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{u.full_name}</p>
                            <p className="text-[11px] text-slate-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="admin-table-td">
                        <div className="flex flex-wrap gap-1">
                          {u.roles.map((r) => (
                            <span
                              key={r}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                r === 'admin'
                                  ? 'bg-purple-100 text-purple-800'
                                  : r === 'tutor'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {r.toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="admin-table-td">
                        <span
                          className={`admin-badge ${
                            isBanned ? 'admin-badge-banned' : 'admin-badge-active'
                          }`}
                        >
                          {isBanned ? 'Suspendido' : 'Activo'}
                        </span>
                      </td>
                      <td className="admin-table-td font-bold text-slate-800">
                        ${u.walletBalance.toFixed(2)} USD
                      </td>
                      <td className="admin-table-td text-slate-500 text-xs">
                        {u.lastLogin}
                      </td>
                      <td className="admin-table-td text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            to={`/admin/users/${u.id}`}
                            className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                          >
                            Detalle
                          </Link>

                          {isBanned ? (
                            <button
                              type="button"
                              onClick={() => handleUnban(u.id)}
                              className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition-colors"
                            >
                              Reactivar
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedUser(u);
                                setIsBanModalOpen(true);
                              }}
                              className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition-colors"
                            >
                              Suspender
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ban Modal */}
      {selectedUser && (
        <BanUserModal
          user={selectedUser}
          isOpen={isBanModalOpen}
          onClose={() => {
            setIsBanModalOpen(false);
            setSelectedUser(null);
          }}
          onSuccess={fetchUsers}
        />
      )}
    </div>
  );
};
