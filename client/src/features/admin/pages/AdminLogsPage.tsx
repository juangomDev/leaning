import React, { useState, useEffect } from 'react';
import { 
  adminFinanceService, 
  AuditLog 
} from '../services/adminFinanceService';
import { 
  Search, 
  Shield, 
  AlertTriangle, 
  Info, 
  RotateCcw, 
  Terminal, 
  Filter 
} from 'lucide-react';

export const AdminLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await adminFinanceService.getAuditLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filtered = logs.filter(l => {
    const actor = l.userName || l.actor || '';
    const details = l.details || l.target || '';
    const matchesSearch = 
      actor.toLowerCase().includes(search.toLowerCase()) ||
      l.action.toLowerCase().includes(search.toLowerCase()) ||
      details.toLowerCase().includes(search.toLowerCase()) ||
      (l.ipAddress && l.ipAddress.includes(search));

    if (!matchesSearch) return false;
    const normSeverity = l.severity.toUpperCase();
    if (severityFilter !== 'all' && normSeverity !== severityFilter) return false;

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
            <Terminal className="text-blue-600 w-6 h-6" /> Auditoría del Sistema y Registro de Seguridad
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Bitácora cronológica inmutable de acciones administrativas, inicios de sesión y modificaciones de seguridad.
          </p>
        </div>
        <button
          onClick={fetchLogs}
          className="btn btn-secondary inline-flex items-center gap-2 self-start md:self-auto text-xs"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por acción, usuario responsable, IP o palabras clave..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 text-xs w-full bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Severidad:
          </label>
          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="input text-xs py-1.5 px-3 bg-white border-slate-200 font-semibold text-slate-700"
          >
            <option value="all">Todas las Severidades</option>
            <option value="INFO">Información (INFO)</option>
            <option value="WARN">Advertencias (WARN)</option>
            <option value="CRITICAL">Crítico (CRITICAL)</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-xs font-semibold">Cargando registros de auditoría...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Shield className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-700">No hay registros coincidentes</p>
            <p className="text-xs text-slate-400 mt-1">No se encontraron eventos con el criterio de búsqueda solicitado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-table-th">Hora del Evento</th>
                  <th className="admin-table-th">Nivel</th>
                  <th className="admin-table-th">Acción Ejecutada</th>
                  <th className="admin-table-th">Usuario Responsable</th>
                  <th className="admin-table-th">Dirección IP</th>
                  <th className="admin-table-th">Detalles Técnicos</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => {
                  const normSev = log.severity.toUpperCase();
                  return (
                    <tr key={log.id} className="transition-colors hover:bg-slate-50/80">
                      <td className="admin-table-td font-mono text-xs text-slate-600">
                        {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}
                      </td>

                      <td className="admin-table-td">
                        {(normSev === 'INFO') && (
                          <span className="admin-badge admin-badge-info">
                            <Info className="w-3 h-3" /> INFO
                          </span>
                        )}
                        {(normSev === 'WARN' || normSev === 'WARNING') && (
                          <span className="admin-badge admin-badge-pending">
                            <AlertTriangle className="w-3 h-3" /> WARN
                          </span>
                        )}
                        {(normSev === 'CRITICAL' || normSev === 'DANGER') && (
                          <span className="admin-badge admin-badge-banned">
                            <Shield className="w-3 h-3" /> CRITICAL
                          </span>
                        )}
                      </td>

                      <td className="admin-table-td font-bold text-slate-900 text-xs">
                        {log.action}
                      </td>

                      <td className="admin-table-td text-xs text-slate-700 font-medium">
                        {log.userName || log.actor || 'Administrador'}
                      </td>

                      <td className="admin-table-td font-mono text-xs text-slate-500">
                        {log.ipAddress || '127.0.0.1'}
                      </td>

                      <td className="admin-table-td text-xs text-slate-600 max-w-md">
                        {log.details || log.target || 'Registro generado por el sistema'}
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
