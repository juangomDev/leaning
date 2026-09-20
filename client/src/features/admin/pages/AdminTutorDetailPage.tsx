import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { adminService, AdminTutor } from '../services/adminService';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Calendar, 
  Mail, 
  ExternalLink,
  BookOpen,
  AlertCircle
} from 'lucide-react';

export const AdminTutorDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tutor, setTutor] = useState<AdminTutor | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchTutor = async () => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await adminService.getTutorById(id);
      setTutor(data);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error al obtener la información del tutor'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutor();
  }, [id]);

  const handleApprove = async () => {
    if (!id) return;
    try {
      setActionLoading(true);
      await adminService.approveTutor(id);
      setNotification({
        type: 'success',
        message: '¡El tutor ha sido aprobado exitosamente y ya puede recibir reservas de alumnos!'
      });
      fetchTutor();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error al aprobar tutor'
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !rejectionReason.trim()) return;
    try {
      setActionLoading(true);
      await adminService.rejectTutor(id, rejectionReason.trim());
      setNotification({
        type: 'success',
        message: 'Solicitud rechazada. Se ha notificado al postulante.'
      });
      setShowRejectForm(false);
      fetchTutor();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error al rechazar tutor'
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-400">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600 border-t-transparent mb-4"></div>
        <p className="text-xs font-semibold">Cargando expediente del tutor...</p>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="p-12 text-center">
        <AlertCircle className="w-12 h-12 mx-auto text-rose-500 mb-3" />
        <h2 className="text-lg font-bold text-slate-900">Tutor no encontrado</h2>
        <p className="text-xs text-slate-500 mt-1 mb-4">No se localizó el identificador docente especificado.</p>
        <Link to="/admin/tutors" className="btn btn-primary text-xs">
          Volver a Tutores
        </Link>
      </div>
    );
  }

  const name = tutor.user?.name || tutor.name;
  const email = tutor.user?.email || tutor.email;
  const avatar = tutor.user?.avatarUrl || tutor.avatar;
  const isVerified = tutor.verificationStatus === 'verified';
  const isRejected = tutor.verificationStatus === 'rejected';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Back button */}
      <Link 
        to="/admin/tutors" 
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a la lista de tutores
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
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* Header Profile Card */}
      <div className="admin-card">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-2xl border border-slate-200 overflow-hidden shadow-xs">
              {avatar ? (
                <img src={avatar} alt={name} className="w-full h-full object-cover" />
              ) : (
                name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">{name}</h1>
                {isVerified ? (
                  <span className="admin-badge admin-badge-verified">
                    <CheckCircle2 className="w-3 h-3" /> Verificado
                  </span>
                ) : isRejected ? (
                  <span className="admin-badge admin-badge-rejected">
                    <XCircle className="w-3 h-3" /> Rechazado
                  </span>
                ) : (
                  <span className="admin-badge admin-badge-pending">
                    Pendiente
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">{tutor.headline || 'Sin titular registrado'}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {email}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {tutor.createdAt || tutor.appliedDate}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            {!isVerified && (
              <>
                <button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="btn btn-primary bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {actionLoading ? 'Procesando...' : 'Aprobar Tutor'}
                </button>
                <button
                  onClick={() => setShowRejectForm(!showRejectForm)}
                  disabled={actionLoading}
                  className="btn btn-secondary text-rose-600 hover:bg-rose-50 text-xs font-bold inline-flex items-center gap-1.5"
                >
                  <XCircle className="w-4 h-4" />
                  Rechazar
                </button>
              </>
            )}
            {isVerified && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Docente Acreditado
              </span>
            )}
          </div>
        </div>

        {/* Rejection Form Modal/Drawer in-place */}
        {showRejectForm && (
          <form onSubmit={handleReject} className="mt-6 pt-6 border-t border-slate-100 bg-rose-50/50 p-4 rounded-xl border border-rose-100">
            <h3 className="text-xs font-bold text-rose-900 uppercase tracking-wider mb-2">
              Motivo formal de rechazo
            </h3>
            <textarea
              required
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ej: Los títulos escaneados carecen de sello de legalización académica o la identificación oficial no es legible..."
              className="w-full text-xs p-3 rounded-lg border border-rose-200 bg-white focus:outline-rose-500 mb-3"
            />
            <div className="flex justify-end gap-2">
              <button 
                type="button" 
                onClick={() => setShowRejectForm(false)} 
                className="btn btn-secondary text-xs"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={actionLoading}
                className="btn btn-primary bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
              >
                {actionLoading ? 'Guardando...' : 'Confirmar Rechazo'}
              </button>
            </div>
          </form>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Bio & Academic Info */}
        <div className="md:col-span-2 space-y-6">
          {/* Bio Sheet */}
          <div className="admin-card">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Biografía y Trayectoria</h2>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {tutor.bio || 'El postulante no ha redactado una biografía extendida aún.'}
            </p>
          </div>

          {/* Verification Documents */}
          <div className="admin-card">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Expediente de Documentación Adjunta</span>
              <span className="text-xs font-mono text-slate-400 font-normal">
                {tutor.documents?.length || (tutor.documentUrl ? 1 : 0)} archivos
              </span>
            </h2>

            {(!tutor.documents || tutor.documents.length === 0) && !tutor.documentUrl ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium">No se han adjuntado certificados ni comprobantes digitales.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {(tutor.documents || [{ name: 'Documento_Adjunto.pdf', type: 'PDF', url: tutor.documentUrl }]).map((doc, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-white transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">{doc.name || `Documento #${idx + 1}`}</span>
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider font-mono">{doc.type || 'PDF/IMG'}</span>
                      </div>
                    </div>
                    <a
                      href={doc.url || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary text-xs inline-flex items-center gap-1.5 py-1 px-3"
                    >
                      <span>Abrir Archivo</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Financial & Subjects Specs */}
        <div className="space-y-6">
          <div className="admin-card">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Condiciones de Servicio</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-500">Tarifa por Hora:</span>
                <span className="text-sm font-black text-slate-900 font-mono">${tutor.hourlyRate || 0} USD</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs text-slate-500">Comisión de Plataforma (15%):</span>
                <span className="text-xs font-bold text-emerald-600 font-mono">${((tutor.hourlyRate || 0) * 0.15).toFixed(2)} USD</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">Ingreso Neto Estimado:</span>
                <span className="text-xs font-bold text-slate-800 font-mono">${((tutor.hourlyRate || 0) * 0.85).toFixed(2)} USD</span>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <BookOpen className="text-blue-500 w-4 h-4" /> Materias Habilitadas
            </h2>
            <div className="flex flex-wrap gap-2">
              {tutor.subjects && tutor.subjects.length > 0 ? (
                tutor.subjects.map((sub, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                    {sub}
                  </span>
                ))
              ) : (
                <span className="text-xs text-slate-400 italic">No ha registrado materias específicas.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
