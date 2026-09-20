import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  adminFinanceService, 
  AdminWallet 
} from '../services/adminFinanceService';
import { 
  DollarSign, 
  Search, 
  Shield, 
  RotateCcw, 
  TrendingUp, 
  Eye,
  Lock
} from 'lucide-react';

export const AdminWalletsPage: React.FC = () => {
  const [wallets, setWallets] = useState<AdminWallet[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'tutor' | 'student'>('all');

  const fetchWallets = async () => {
    try {
      setLoading(true);
      const data = await adminFinanceService.getWallets();
      setWallets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  const totalInCustody = wallets.reduce((acc, w) => acc + w.inEscrow, 0);
  const totalAvailable = wallets.reduce((acc, w) => acc + w.balance, 0);
  const totalWithdrawn = wallets.reduce((acc, w) => acc + w.totalWithdrawn, 0);

  const filtered = wallets.filter(w => {
    const wid = w.id || w.userId || '';
    const matchesSearch = 
      w.userName.toLowerCase().includes(search.toLowerCase()) ||
      w.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      wid.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (roleFilter !== 'all' && w.userRole !== roleFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Auditoría de Monederos y Custodia Financiera
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Monitor centralizado de saldos en escrow, fondos líquidos y retiros procesados.
          </p>
        </div>
        <button
          onClick={fetchWallets}
          className="btn btn-secondary inline-flex items-center gap-2 self-start md:self-auto text-xs"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total en Custodia (Escrow)</span>
            <p className="text-2xl font-black text-blue-600 mt-1 font-mono">${totalInCustody.toFixed(2)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Lock className="w-5 h-5" />
          </div>
        </div>

        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Saldo Líquido Usuarios</span>
            <p className="text-2xl font-black text-emerald-600 mt-1 font-mono">${totalAvailable.toFixed(2)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Total Desembolsado</span>
            <p className="text-2xl font-black text-purple-600 mt-1 font-mono">${totalWithdrawn.toFixed(2)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Billeteras Activas</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{wallets.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
            <Shield className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por ID monedero, titular o correo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 text-xs w-full bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Filtrar:</label>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="input text-xs py-1.5 px-3 bg-white border-slate-200 font-semibold text-slate-700"
          >
            <option value="all">Todos los Roles</option>
            <option value="tutor">Solo Tutores</option>
            <option value="student">Solo Estudiantes</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-xs font-semibold">Auditando balances y monederos...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <DollarSign className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-700">No se encontraron monederos</p>
            <p className="text-xs text-slate-400 mt-1">Ajusta los criterios de búsqueda o remueve el filtro de rol.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-table-th">Titular del Monedero</th>
                  <th className="admin-table-th">Rol</th>
                  <th className="admin-table-th">Saldo Disponible</th>
                  <th className="admin-table-th">En Custodia (Escrow)</th>
                  <th className="admin-table-th">Total Retirado</th>
                  <th className="admin-table-th">Última Transacción</th>
                  <th className="admin-table-th text-right">Usuario</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((w) => {
                  const displayId = w.id || `wal_${w.userId.substring(0, 6)}`;
                  return (
                    <tr key={w.userId} className="transition-colors hover:bg-slate-50/80">
                      <td className="admin-table-td">
                        <div className="font-bold text-slate-900 text-sm">{w.userName}</div>
                        <div className="text-slate-400 text-xs font-mono">{w.userEmail}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {displayId}</div>
                      </td>

                      <td className="admin-table-td">
                        {w.userRole === 'tutor' ? (
                          <span className="admin-badge admin-badge-info">Tutor</span>
                        ) : (
                          <span className="admin-badge admin-badge-purple">Estudiante</span>
                        )}
                      </td>

                      <td className="admin-table-td">
                        <span className="font-bold text-emerald-600 font-mono text-sm">
                          ${w.balance.toFixed(2)}
                        </span>
                      </td>

                      <td className="admin-table-td">
                        <span className="font-bold text-blue-600 font-mono text-sm">
                          ${w.inEscrow.toFixed(2)}
                        </span>
                      </td>

                      <td className="admin-table-td">
                        <span className="font-mono text-slate-600 text-xs">
                          ${w.totalWithdrawn.toFixed(2)}
                        </span>
                      </td>

                      <td className="admin-table-td">
                        <span className="text-slate-500 text-xs font-mono">
                          {new Date(w.updatedAt).toLocaleDateString()}
                        </span>
                      </td>

                      <td className="admin-table-td text-right">
                        <Link
                          to={`/admin/users/${w.userId}`}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors inline-block"
                          title="Ver Perfil Global de Usuario"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
