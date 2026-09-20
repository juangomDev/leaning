import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  adminService, 
  AdminTutor 
} from '../services/adminService';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  FileText, 
  Clock, 
  Award, 
  AlertCircle,
  RotateCcw
} from 'lucide-react';

export const AdminTutorsPage: React.FC = () => {
  const [tutors, setTutors] = useState<AdminTutor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const data = await adminService.getTutors();
      setTutors(data);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error al cargar la lista de tutores'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTutors();
  }, []);

  const handleQuickApprove = async (tutorId: string) => {
    try {
      setActionLoadingId(tutorId);
      await adminService.approveTutor(tutorId);
      setNotification({
        type: 'success',
        message: 'Tutor verificado y aprobado satisfactoriamente.'
      });
      fetchTutors();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error al aprobar al tutor'
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleQuickReject = async (tutorId: string) => {
    const reason = window.prompt('Motivo del rechazo de la solicitud del tutor:', 'Documentación ilegible o insuficiente');
    if (!reason) return;
    try {
      setActionLoadingId(tutorId);
      await adminService.rejectTutor(tutorId, reason);
      setNotification({
        type: 'success',
        message: 'Solicitud del tutor rechazada.'
      });
      fetchTutors();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error al rechazar al tutor'
      });
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredTutors = tutors.filter(t => {
    const tutorName = t.user?.name || t.name;
    const tutorEmail = t.user?.email || t.email;
    const matchesSearch = 
      tutorName.toLowerCase().includes(search.toLowerCase()) ||
      tutorEmail.toLowerCase().includes(search.toLowerCase()) ||
      (t.headline && t.headline.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'pending') return t.verificationStatus === 'pending';
    if (activeTab === 'verified') return t.verificationStatus === 'verified';
    if (activeTab === 'rejected') return t.verificationStatus === 'rejected';

    return true;
  });

  const pendingCount = tutors.filter(t => t.verificationStatus === 'pending').length;
  const verifiedCount = tutors.filter(t => t.verificationStatus === 'verified').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Verificación y Gestión de Tutores
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Supervisa el cuerpo docente, revisa credenciales académicas y autoriza nuevos perfiles.
          </p>
        </div>
        <button
          onClick={fetchTutors}
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
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* Metric Badges / Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Registrados</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{tutors.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Award className="w-5 h-5" />
          </div>
        </div>
        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Pendientes Revisión</span>
            <p className="text-2xl font-black text-amber-600 mt-1">{pendingCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock className="w-5 h-5" />
          </div>
        </div>
        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Aprobados Activos</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{verifiedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        <button
          onClick={() => setActiveTab('all')}
          className={`admin-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
        >
          Todos los Tutores <span className="admin-tab-count">{tutors.length}</span>
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`admin-tab-btn ${activeTab === 'pending' ? 'active' : ''}`}
        >
          Pendientes de Verificación <span className="admin-tab-count">{pendingCount}</span>
        </button>
        <button
          onClick={() => setActiveTab('verified')}
          className={`admin-tab-btn ${activeTab === 'verified' ? 'active' : ''}`}
        >
          Aprobados <span className="admin-tab-count">{verifiedCount}</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nombre de tutor, email o materia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 text-xs w-full bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="admin-table-container">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-xs font-semibold">Cargando tutores del sistema...</p>
          </div>
        ) : filteredTutors.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-700">No se encontraron tutores</p>
            <p className="text-xs text-slate-400 mt-1">Intenta con otro término de búsqueda o cambia la pestaña seleccionada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-table-th">Tutor</th>
                  <th className="admin-table-th">Especialidad / Título</th>
                  <th className="admin-table-th">Tarifa / h</th>
                  <th className="admin-table-th">Documentación</th>
                  <th className="admin-table-th">Estado</th>
                  <th className="admin-table-th text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredTutors.map((tutor) => {
                  const name = tutor.user?.name || tutor.name;
                  const email = tutor.user?.email || tutor.email;
                  const avatar = tutor.user?.avatarUrl || tutor.avatar;
                  const isVerified = tutor.verificationStatus === 'verified';
                  const isRejected = tutor.verificationStatus === 'rejected';

                  return (
                    <tr key={tutor.id} className="transition-colors hover:bg-slate-50/80">
                      <td className="admin-table-td">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm overflow-hidden border border-slate-200">
                            {avatar ? (
                              <img src={avatar} alt={name} className="w-full h-full object-cover" />
                            ) : (
                              name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                              {name}
                              {isVerified && <CheckCircle2 className="text-emerald-600 w-3.5 h-3.5 inline" />}
                            </div>
                            <div className="text-slate-400 text-xs font-mono">{email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="admin-table-td">
                        <span className="font-semibold text-slate-700 block">{tutor.headline || 'Sin titular docente'}</span>
                        <span className="text-[11px] text-slate-400 line-clamp-1">{tutor.bio || 'Sin biografía registrada'}</span>
                      </td>

                      <td className="admin-table-td">
                        <span className="font-bold text-slate-900 font-mono text-sm">${tutor.hourlyRate || 0}</span>
                        <span className="text-[11px] text-slate-400 block">USD / hora</span>
                      </td>

                      <td className="admin-table-td">
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <FileText className="text-blue-500 w-4 h-4" />
                          <span>{tutor.documents?.length || (tutor.documentUrl ? 1 : 0)} archivo(s)</span>
                        </div>
                      </td>

                      <td className="admin-table-td">
                        {isVerified ? (
                          <span className="admin-badge admin-badge-verified">
                            <CheckCircle2 className="w-3 h-3" /> Verificado
                          </span>
                        ) : isRejected ? (
                          <span className="admin-badge admin-badge-rejected" title={tutor.rejectionReason}>
                            <XCircle className="w-3 h-3" /> Rechazado
                          </span>
                        ) : (
                          <span className="admin-badge admin-badge-pending">
                            <Clock className="w-3 h-3" /> Por Revisar
                          </span>
                        )}
                      </td>

                      <td className="admin-table-td text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/tutors/${tutor.id}`}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Ver Ficha y Expediente"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {!isVerified && (
                            <>
                              <button
                                onClick={() => handleQuickApprove(tutor.id)}
                                disabled={actionLoadingId === tutor.id}
                                className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Aprobar Tutor"
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleQuickReject(tutor.id)}
                                disabled={actionLoadingId === tutor.id}
                                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Rechazar Tutor"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
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
    </div>
  );
};
