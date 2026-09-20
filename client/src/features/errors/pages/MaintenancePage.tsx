import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Wrench, 
  Clock, 
  RotateCcw, 
  ShieldCheck, 
  Mail, 
  CheckCircle2, 
  Sparkles 
} from 'lucide-react';

export const MaintenancePage: React.FC = () => {
  const [checking, setChecking] = useState(false);
  const [checkStatus, setCheckStatus] = useState<string | null>(null);

  const handleCheck = () => {
    setChecking(true);
    setCheckStatus(null);
    setTimeout(() => {
      setChecking(false);
      setCheckStatus('El mantenimiento continúa en curso. La plataforma regresará en breve.');
      setTimeout(() => setCheckStatus(null), 5000);
    }, 1200);
  };

  return (
    <div className="error-page-wrapper">
      <div className="error-bg-glow error-bg-glow-amber" />
      <div className="error-bg-glow error-bg-glow-blue" />

      <div className="error-card">
        {/* Badge */}
        <div className="error-code-badge error-badge-maintenance">
          <Wrench className="w-3.5 h-3.5 text-amber-600" />
          <span>Ventana de Mantenimiento y Optimización</span>
        </div>

        {/* Floating Icon */}
        <div className="error-icon-box bg-amber-50 text-amber-600 border border-amber-200">
          <Wrench className="w-10 h-10 stroke-[1.75]" />
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          Estamos Mejorando EduConnect
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed mb-6">
          Estamos implementando mejoras de seguridad, velocidad y nuevas herramientas para tus clases interactivas. Regresaremos en cuestión de minutos.
        </p>

        {/* ETA & Progress Box */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 max-w-md mx-auto mb-6 text-left space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" /> Tiempo estimado de regreso:
            </span>
            <span className="font-mono font-black text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
              ~ 15 minutos
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-amber-800 pt-2 border-t border-amber-200/60">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Tus clases programadas, saldo en billetera y calificaciones están 100% a salvo y respaldadas.</span>
          </div>
        </div>

        {/* Feedback message */}
        {checkStatus && (
          <div className="p-3 mb-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-xs font-semibold">
            {checkStatus}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleCheck}
            disabled={checking}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <RotateCcw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Consultando estado...' : 'Comprobar Disponibilidad'}</span>
          </button>
          <a
            href="mailto:soporte@educonnect.com"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>Contactar Soporte</span>
          </a>
        </div>

        {/* Suggested Links */}
        <div className="error-suggested-links">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 w-full mb-1">
            Canales Oficiales
          </span>
          <a
            href="https://twitter.com/educonnect"
            target="_blank"
            rel="noreferrer"
            className="error-suggested-link"
          >
            <Sparkles className="w-3 h-3 inline mr-1 text-amber-500" />
            Avisos en Twitter / X
          </a>
          <Link to="/help" className="error-suggested-link">
            Preguntas Frecuentes de Mantenimiento
          </Link>
        </div>
      </div>
    </div>
  );
};
