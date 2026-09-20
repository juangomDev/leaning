import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { 
  ShieldAlert, 
  Lock, 
  ArrowLeft, 
  UserCheck, 
  Home, 
  HelpCircle,
  Repeat
} from 'lucide-react';

export const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, role } = useAuth();

  const currentRoleLabel = 
    role === 'admin' ? 'Administrador' :
    role === 'tutor' ? 'Tutor Docente' : 'Estudiante';

  const defaultDashboard = 
    role === 'admin' ? '/admin' :
    role === 'tutor' ? '/tutor' : '/student';

  return (
    <div className="error-page-wrapper">
      <div className="error-bg-glow error-bg-glow-rose" />
      <div className="error-bg-glow error-bg-glow-blue" />

      <div className="error-card">
        {/* Badge */}
        <div className="error-code-badge error-badge-403">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
          <span>Error 403 • Acceso Restringido</span>
        </div>

        {/* Floating Icon */}
        <div className="error-icon-box bg-rose-50 text-rose-600 border border-rose-200">
          <Lock className="w-10 h-10 stroke-[1.75]" />
        </div>

        {/* Hero Code & Title */}
        <h1 className="error-code-number">403</h1>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
          Área Protegida por Privilegios
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed mb-6">
          Tu cuenta actual no posee las credenciales o el rol requerido para operar en este módulo de la plataforma.
        </p>

        {/* User Context Card */}
        {user && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto mb-6 text-left flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs uppercase">
                {user.email?.slice(0, 2) || 'US'}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-900 block truncate max-w-[180px]">
                  {user.email}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 flex items-center gap-1">
                  <UserCheck className="w-3 h-3 text-emerald-600" /> Rol activo: <strong>{currentRoleLabel}</strong>
                </span>
              </div>
            </div>
            <Link
              to="/account/roles"
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-[11px] font-bold text-slate-700 shadow-2xs inline-flex items-center gap-1 transition-all"
            >
              <Repeat className="w-3 h-3 text-blue-600" />
              <span>Cambiar Rol</span>
            </Link>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to={defaultDashboard}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Ir a Mi Panel ({currentRoleLabel})</span>
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Regresar</span>
          </button>
        </div>

        {/* Suggested Links */}
        <div className="error-suggested-links">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 w-full mb-1">
            Gestión de Credenciales
          </span>
          <Link to="/account/roles" className="error-suggested-link">
            Activar Perfil Docente o Alumno
          </Link>
          <Link to="/help" className="error-suggested-link">
            <HelpCircle className="w-3 h-3 inline mr-1" />
            Solicitar Permisos a Soporte
          </Link>
        </div>
      </div>
    </div>
  );
};
