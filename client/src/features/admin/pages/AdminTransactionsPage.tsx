import React, { useState, useEffect } from 'react';
import { 
  adminFinanceService, 
  AdminTransaction 
} from '../services/adminFinanceService';
import { 
  DollarSign, 
  Search, 
  Download, 
  RotateCcw, 
  TrendingUp, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Filter 
} from 'lucide-react';

export const AdminTransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<AdminTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await adminFinanceService.getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filtered = transactions.filter(t => {
    const matchesSearch = 
      t.userName.toLowerCase().includes(search.toLowerCase()) ||
      t.id.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (typeFilter !== 'all' && t.type !== typeFilter) return false;

    return true;
  });

  const exportCSV = () => {
    const headers = 'ID,Fecha,Tipo,Usuario,Monto,Estado,Descripcion\n';
    const rows = filtered.map(t => 
      `"${t.id}","${new Date(t.createdAt).toISOString()}","${t.type}","${t.userName}","${t.amount}","${t.status}","${t.description.replace(/"/g, '""')}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transacciones_educonnect_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalCommissions = transactions
    .filter(t => t.type === 'COMMISSION')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalDeposits = transactions
    .filter(t => t.type === 'DEPOSIT')
    .reduce((acc, t) => acc + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Libro Mayor de Transacciones
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Registro inmutable de movimientos financieros, retenciones, abonos y comisiones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportCSV}
            className="btn btn-secondary inline-flex items-center gap-2 text-xs font-bold"
          >
            <Download className="w-4 h-4" />
            Exportar CSV
          </button>
          <button
            onClick={fetchTransactions}
            className="btn btn-secondary inline-flex items-center gap-2 text-xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Movimientos</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{transactions.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Total Recargas Registradas</span>
            <p className="text-2xl font-black text-emerald-600 mt-1 font-mono">${totalDeposits.toFixed(2)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Comisiones Percibidas (15%)</span>
            <p className="text-2xl font-black text-purple-600 mt-1 font-mono">${totalCommissions.toFixed(2)}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por ID asiento, usuario o descripción del concepto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 text-xs w-full bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Tipo:
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="input text-xs py-1.5 px-3 bg-white border-slate-200 font-semibold text-slate-700"
          >
            <option value="all">Todos los Tipos</option>
            <option value="DEPOSIT">Recargas / Depósitos</option>
            <option value="CLASS_PAYMENT">Pagos de Clases</option>
            <option value="COMMISSION">Comisión de Plataforma</option>
            <option value="WITHDRAWAL">Retiros a Cuenta</option>
            <option value="DISPUTE_REFUND">Reembolsos de Disputas</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-xs font-semibold">Consultando libro contable...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <DollarSign className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-700">No hay movimientos contables</p>
            <p className="text-xs text-slate-400 mt-1">Prueba seleccionando otro filtro de tipo o borrando la búsqueda.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-table-th">Asiento / ID</th>
                  <th className="admin-table-th">Fecha & Hora</th>
                  <th className="admin-table-th">Tipo de Movimiento</th>
                  <th className="admin-table-th">Usuario / Titular</th>
                  <th className="admin-table-th">Concepto</th>
                  <th className="admin-table-th">Monto</th>
                  <th className="admin-table-th text-right">Estado</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const isPositive = ['DEPOSIT', 'COMMISSION'].includes(t.type);
                  return (
                    <tr key={t.id} className="transition-colors hover:bg-slate-50/80">
                      <td className="admin-table-td font-mono font-bold text-slate-500 text-xs">
                        #{t.id}
                      </td>

                      <td className="admin-table-td text-slate-600 font-mono text-xs">
                        {new Date(t.createdAt).toLocaleDateString()} {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>

                      <td className="admin-table-td">
                        {t.type === 'DEPOSIT' && (
                          <span className="admin-badge admin-badge-active">Recarga</span>
                        )}
                        {(t.type === 'CLASS_PAYMENT' || t.type === 'BOOKING_PAYMENT') && (
                          <span className="admin-badge admin-badge-completed">Pago Clase</span>
                        )}
                        {t.type === 'COMMISSION' && (
                          <span className="admin-badge admin-badge-purple">Comisión (15%)</span>
                        )}
                        {t.type === 'WITHDRAWAL' && (
                          <span className="admin-badge admin-badge-banned">Retiro</span>
                        )}
                        {(t.type === 'DISPUTE_REFUND' || t.type === 'REFUND') && (
                          <span className="admin-badge admin-badge-disputed">Reembolso</span>
                        )}
                      </td>

                      <td className="admin-table-td font-semibold text-slate-900 text-xs">
                        {t.userName}
                      </td>

                      <td className="admin-table-td text-xs text-slate-600 max-w-xs truncate">
                        {t.description}
                      </td>

                      <td className="admin-table-td">
                        <span className={`font-mono font-bold text-sm ${isPositive ? 'text-emerald-600' : 'text-slate-900'}`}>
                          {isPositive ? '+' : '-'}${t.amount.toFixed(2)}
                        </span>
                      </td>

                      <td className="admin-table-td text-right">
                        {t.status === 'COMPLETED' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Liquidado
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-amber-600 font-bold text-xs">
                            <Clock className="w-3.5 h-3.5" /> Pendiente
                          </span>
                        )}
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
