import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, AdminDashboardSummary } from '../services/adminService';
import { adminFinanceService, AdminTransaction } from '../services/adminFinanceService';

export const AdminDashboardPage: React.FC = () => {
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [sumData, txData] = await Promise.all([
          adminService.getDashboardSummary(),
          adminFinanceService.getTransactions(),
        ]);
        setSummary(sumData);
        setTransactions(txData.slice(0, 5));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading || !summary) {
    return (
      <div className="py-20 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80">
        <i className="fa-solid fa-circle-notch fa-spin text-3xl text-brand-600 mb-3"></i>
        <p className="text-sm font-medium text-slate-600">Cargando métricas del sistema...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-500/30">
              Centro de Control Global
            </span>
            <span className="text-xs text-slate-400 font-semibold font-mono">v2.4.0-PROD</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Panel de Administración EduConnect
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
            Supervisión global de usuarios, reservas, comisiones retenidas, moderación de contenidos y auditoría contable.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 z-10">
          <Link
            to="/admin/reports"
            className="px-4 py-2.5 rounded-2xl bg-white text-slate-900 font-bold text-xs hover:bg-slate-100 transition-colors shadow-sm flex items-center gap-2"
          >
            <i className="fa-solid fa-file-export text-brand-600"></i>
            <span>Exportar Reporte</span>
          </Link>
          <Link
            to="/admin/settings"
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/20 flex items-center gap-2"
          >
            <i className="fa-solid fa-sliders text-slate-300"></i>
            <span>Ajustes Globales</span>
          </Link>
        </div>
      </div>

      {/* Priority Action Alerts (Audits needed) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {summary.pendingTutors > 0 && (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center text-lg shrink-0">
                <i className="fa-solid fa-user-check"></i>
              </div>
              <div>
                <p className="text-xs font-bold">{summary.pendingTutors} solicitud(es) de tutor pendiente(s)</p>
                <p className="text-[11px] text-amber-700">Revisa los títulos universitarios y aprueba o rechaza.</p>
              </div>
            </div>
            <Link
              to="/admin/tutors"
              className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition-colors shrink-0 shadow-xs"
            >
              Auditar
            </Link>
          </div>
        )}

        {summary.openDisputes > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center text-lg shrink-0">
                <i className="fa-solid fa-scale-balanced"></i>
              </div>
              <div>
                <p className="text-xs font-bold">{summary.openDisputes} reclamo / disputa arbitral activa</p>
                <p className="text-[11px] text-rose-700">Fondos congelados esperando arbitraje de la administración.</p>
              </div>
            </div>
            <Link
              to="/admin/bookings"
              className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shrink-0 shadow-xs"
            >
              Resolver
            </Link>
          </div>
        )}
      </div>

      {/* 6 Metric KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="admin-kpi-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Usuarios</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{summary.totalUsers}</span>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">+12 este mes</span>
        </div>

        <div className="admin-kpi-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tutores</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{summary.totalTutors}</span>
          <span className="text-[10px] text-purple-600 font-bold mt-1 block">{summary.pendingTutors} en revisión</span>
        </div>

        <div className="admin-kpi-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estudiantes</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{summary.totalStudents}</span>
          <span className="text-[10px] text-slate-500 font-bold mt-1 block">Activos</span>
        </div>

        <div className="admin-kpi-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reservas</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">{summary.totalBookings}</span>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">98.2% éxito</span>
        </div>

        <div className="admin-kpi-card">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Volumen Bruto</span>
          <span className="text-2xl font-black text-slate-900 mt-1 block">${(summary.grossRevenue / 1000).toFixed(1)}k</span>
          <span className="text-[10px] text-slate-500 font-bold mt-1 block">USD transaccionados</span>
        </div>

        <div className="admin-kpi-card bg-emerald-50/50 border-emerald-200/80">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Comisión EduConnect</span>
          <span className="text-2xl font-black text-emerald-700 mt-1 block">${summary.platformCommissions.toFixed(0)}</span>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">10% neto retenido</span>
        </div>
      </div>

      {/* Main Grid: Recent Transactions Ledger + Quick Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Recent Transactions */}
        <div className="lg:col-span-2 admin-table-container">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-slate-900">Últimos Movimientos del Libro Contable</h2>
              <p className="text-xs text-slate-400">Transacciones financieras globales en tiempo real</p>
            </div>
            <Link to="/admin/transactions" className="text-xs font-bold text-brand-600 hover:text-brand-800">
              Ver todas ({transactions.length})
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-table-th">Tipo / Usuario</th>
                  <th className="admin-table-th">Fecha</th>
                  <th className="admin-table-th">Estado</th>
                  <th className="admin-table-th text-right">Monto</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="admin-table-td">
                      <p className="font-bold text-slate-800">{tx.userName}</p>
                      <p className="text-[11px] text-slate-400">{tx.description}</p>
                    </td>
                    <td className="admin-table-td text-slate-500 text-xs">{tx.createdAt}</td>
                    <td className="admin-table-td">
                      <span className="admin-badge admin-badge-active">{tx.status}</span>
                    </td>
                    <td className="admin-table-td text-right font-black text-sm text-slate-900">
                      ${tx.amount.toFixed(2)} USD
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Col: Admin Shortcuts */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Acciones Rápidas del Administrador
            </h3>
            <div className="space-y-2 text-xs">
              <Link
                to="/admin/users"
                className="p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors font-bold text-slate-800"
              >
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-user-gear text-brand-600"></i>
                  <span>Administrar Usuarios y Bans</span>
                </span>
                <i className="fa-solid fa-chevron-right text-slate-400 text-xs"></i>
              </Link>

              <Link
                to="/admin/tutors"
                className="p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors font-bold text-slate-800"
              >
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-chalkboard-user text-purple-600"></i>
                  <span>Validar Títulos Docentes</span>
                </span>
                <i className="fa-solid fa-chevron-right text-slate-400 text-xs"></i>
              </Link>

              <Link
                to="/admin/subjects"
                className="p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors font-bold text-slate-800"
              >
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-book-bookmark text-emerald-600"></i>
                  <span>Crear / Editar Materias</span>
                </span>
                <i className="fa-solid fa-chevron-right text-slate-400 text-xs"></i>
              </Link>

              <Link
                to="/admin/wallets"
                className="p-3 rounded-2xl border border-slate-100 bg-slate-50 hover:bg-slate-100 flex items-center justify-between transition-colors font-bold text-slate-800"
              >
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-vault text-amber-600"></i>
                  <span>Auditar Billeteras & Escrow</span>
                </span>
                <i className="fa-solid fa-chevron-right text-slate-400 text-xs"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
