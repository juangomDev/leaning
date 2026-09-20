import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  adminOperationsService, 
  AdminReview 
} from '../services/adminOperationsService';
import { 
  Search, 
  Star, 
  CheckCircle2, 
  EyeOff, 
  Trash2, 
  Eye, 
  RotateCcw, 
  AlertTriangle, 
  MessageSquare 
} from 'lucide-react';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'PUBLISHED' | 'REPORTED' | 'HIDDEN'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const data = await adminOperationsService.getReviews();
      setReviews(data);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error al cargar las reseñas'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleModerate = async (reviewId: string, action: 'PUBLISHED' | 'HIDDEN' | 'DELETED') => {
    try {
      setActionLoadingId(reviewId);
      await adminOperationsService.moderateReview(reviewId, action);
      setNotification({
        type: 'success',
        message: `Reseña marcada como ${action.toLowerCase()} exitosamente.`
      });
      fetchReviews();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error al moderar la reseña'
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const filtered = reviews.filter(r => {
    const matchesSearch = 
      r.studentName.toLowerCase().includes(search.toLowerCase()) ||
      r.tutorName.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    const normStatus = r.status.toUpperCase();
    if (statusFilter !== 'all' && normStatus !== statusFilter) return false;

    return true;
  });

  const reportedCount = reviews.filter(r => r.status.toUpperCase() === 'REPORTED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Moderación y Auditoría de Reseñas
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Supervisa comentarios, previene lenguaje inapropiado y calibra la reputación pública.
          </p>
        </div>
        <button
          onClick={fetchReviews}
          className="btn btn-secondary inline-flex items-center gap-2 self-start md:self-auto text-xs"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
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
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          onClick={() => setStatusFilter('all')}
          className={`admin-tab-btn ${statusFilter === 'all' ? 'active' : ''}`}
        >
          Todas las Reseñas <span className="admin-tab-count">{reviews.length}</span>
        </button>
        <button
          onClick={() => setStatusFilter('REPORTED')}
          className={`admin-tab-btn ${statusFilter === 'REPORTED' ? 'active' : ''}`}
        >
          Reportadas / Pendientes <span className="admin-tab-count">{reportedCount}</span>
        </button>
        <button
          onClick={() => setStatusFilter('PUBLISHED')}
          className={`admin-tab-btn ${statusFilter === 'PUBLISHED' ? 'active' : ''}`}
        >
          Publicadas
        </button>
        <button
          onClick={() => setStatusFilter('HIDDEN')}
          className={`admin-tab-btn ${statusFilter === 'HIDDEN' ? 'active' : ''}`}
        >
          Ocultas
        </button>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por estudiante, tutor o contenido del comentario..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 text-xs w-full bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-xs font-semibold">Cargando reseñas del sistema...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-700">No se encontraron reseñas</p>
            <p className="text-xs text-slate-400 mt-1">No hay elementos que coincidan con los filtros actuales.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-table-th">Calificación</th>
                  <th className="admin-table-th">Estudiante</th>
                  <th className="admin-table-th">Tutor Evaluado</th>
                  <th className="admin-table-th">Comentario</th>
                  <th className="admin-table-th">Estado</th>
                  <th className="admin-table-th text-right">Moderación</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const normStatus = r.status.toUpperCase();
                  const dateDisplay = r.createdAt || r.date || '2026-09-18';

                  return (
                    <tr key={r.id} className="transition-colors hover:bg-slate-50/80">
                      <td className="admin-table-td">
                        <div className="flex items-center gap-1 text-amber-500 font-bold font-mono text-sm">
                          <span>{r.rating}</span>
                          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        </div>
                      </td>

                      <td className="admin-table-td font-semibold text-slate-900 text-xs">
                        {r.studentName}
                      </td>

                      <td className="admin-table-td text-slate-700 font-medium text-xs">
                        {r.tutorName}
                      </td>

                      <td className="admin-table-td max-w-sm">
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {r.comment}
                        </p>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {dateDisplay}
                        </span>
                      </td>

                      <td className="admin-table-td">
                        {normStatus === 'PUBLISHED' && (
                          <span className="admin-badge admin-badge-active">Publicada</span>
                        )}
                        {normStatus === 'REPORTED' && (
                          <span className="admin-badge admin-badge-disputed animate-pulse">
                            <AlertTriangle className="w-3 h-3" /> Reportada
                          </span>
                        )}
                        {normStatus === 'HIDDEN' && (
                          <span className="admin-badge admin-badge-banned">Oculta</span>
                        )}
                      </td>

                      <td className="admin-table-td text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link
                            to={`/admin/reviews/${r.id}`}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Ver Ficha Detallada"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {normStatus !== 'PUBLISHED' && (
                            <button
                              onClick={() => handleModerate(r.id, 'PUBLISHED')}
                              disabled={actionLoadingId === r.id}
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                              title="Aprobar y Publicar"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}

                          {normStatus !== 'HIDDEN' && (
                            <button
                              onClick={() => handleModerate(r.id, 'HIDDEN')}
                              disabled={actionLoadingId === r.id}
                              className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Ocultar de Perfil Público"
                            >
                              <EyeOff className="w-4 h-4" />
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (window.confirm('¿Seguro que deseas purgar esta reseña de forma irreversible?')) {
                                handleModerate(r.id, 'DELETED');
                              }
                            }}
                            disabled={actionLoadingId === r.id}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Eliminar Reseña"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
    </div>
  );
};
