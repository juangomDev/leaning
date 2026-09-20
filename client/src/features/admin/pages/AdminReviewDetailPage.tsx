import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  adminOperationsService, 
  AdminReview 
} from '../services/adminOperationsService';
import { 
  ArrowLeft, 
  Star, 
  CheckCircle2, 
  EyeOff, 
  Trash2, 
  AlertTriangle, 
  Calendar
} from 'lucide-react';

export const AdminReviewDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [review, setReview] = useState<AdminReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchReview = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await adminOperationsService.getReviewById(id);
      setReview(data);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error al obtener la reseña'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReview();
  }, [id]);

  const handleAction = async (status: 'PUBLISHED' | 'HIDDEN' | 'DELETED') => {
    if (!id) return;
    try {
      setActionLoading(true);
      await adminOperationsService.moderateReview(id, status);
      if (status === 'DELETED') {
        navigate('/admin/reviews');
        return;
      }
      setNotification({
        type: 'success',
        message: `Estado de la reseña actualizado a ${status.toLowerCase()}`
      });
      fetchReview();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error al procesar la acción'
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-xs font-semibold">Cargando expediente de la reseña...</p>
      </div>
    );
  }

  if (!review) {
    return (
      <div className="p-12 text-center">
        <AlertTriangle className="w-12 h-12 mx-auto text-rose-500 mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Reseña no encontrada</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">El comentario solicitado no existe o fue purgado del registro.</p>
        <Link to="/admin/reviews" className="btn btn-primary text-xs">
          Volver a Reseñas
        </Link>
      </div>
    );
  }

  const normStatus = review.status.toUpperCase();
  const dateStr = review.createdAt || review.date || '2026-09-18';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Back button */}
      <Link 
        to="/admin/reviews" 
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al centro de moderación
      </Link>

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

      {/* Main Review Card */}
      <div className="admin-card space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-400">#{review.id}</span>
              {normStatus === 'PUBLISHED' && (
                <span className="admin-badge admin-badge-active">Publicada</span>
              )}
              {normStatus === 'REPORTED' && (
                <span className="admin-badge admin-badge-disputed">Reportada para Revisión</span>
              )}
              {normStatus === 'HIDDEN' && (
                <span className="admin-badge admin-badge-banned">Oculta al Público</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${star <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`}
                  />
                ))}
              </div>
              <span className="text-sm font-black text-slate-900 font-mono">({review.rating} / 5)</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {normStatus !== 'PUBLISHED' && (
              <button
                onClick={() => handleAction('PUBLISHED')}
                disabled={actionLoading}
                className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Aprobar y Publicar
              </button>
            )}

            {normStatus !== 'HIDDEN' && (
              <button
                onClick={() => handleAction('HIDDEN')}
                disabled={actionLoading}
                className="btn btn-secondary text-amber-600 hover:bg-amber-50 text-xs font-bold inline-flex items-center gap-1.5"
              >
                <EyeOff className="w-4 h-4" />
                Ocultar
              </button>
            )}

            <button
              onClick={() => {
                if (window.confirm('¿Confirmas la eliminación permanente de este registro?')) {
                  handleAction('DELETED');
                }
              }}
              disabled={actionLoading}
              className="btn btn-secondary text-rose-600 hover:bg-rose-50 text-xs font-bold inline-flex items-center gap-1.5"
            >
              <Trash2 className="w-4 h-4" />
              Eliminar
            </button>
          </div>
        </div>

        {/* Comment Body */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
            Texto del Alumno
          </h3>
          <p className="text-sm text-slate-800 leading-relaxed font-medium">
            "{review.comment}"
          </p>
          <div className="mt-3 flex items-center gap-2 text-xs text-slate-400 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>Emitida el {dateStr}</span>
          </div>
        </div>

        {/* Involved Parties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Alumno Autor</span>
            <span className="text-sm font-bold text-slate-900 block mt-1">{review.studentName}</span>
            {review.studentId && (
              <Link to={`/admin/users/${review.studentId}`} className="text-xs font-semibold text-blue-600 hover:underline mt-2 inline-block">
                Ver perfil de estudiante →
              </Link>
            )}
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-white">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Tutor Calificado</span>
            <span className="text-sm font-bold text-slate-900 block mt-1">{review.tutorName}</span>
            {review.tutorId && (
              <Link to={`/admin/tutors/${review.tutorId}`} className="text-xs font-semibold text-blue-600 hover:underline mt-2 inline-block">
                Ver expediente del docente →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
