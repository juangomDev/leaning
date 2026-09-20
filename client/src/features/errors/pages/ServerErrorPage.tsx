import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ServerCrash, 
  RotateCcw, 
  Copy, 
  Check, 
  Home, 
  HelpCircle,
  Activity,
  AlertOctagon
} from 'lucide-react';

export const ServerErrorPage: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [incidentId] = useState(() => `INC-${Math.floor(100000 + Math.random() * 900000)}`);

  const handleCopyTicket = () => {
    navigator.clipboard.writeText(incidentId);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleRetry = () => {
    setRetrying(true);
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="error-page-wrapper">
      <div className="error-bg-glow error-bg-glow-rose" />
      <div className="error-bg-glow error-bg-glow-amber" />

      <div className="error-card">
        {/* Badge */}
        <div className="error-code-badge error-badge-500">
          <AlertOctagon className="w-3.5 h-3.5 text-rose-600" />
          <span>Error 500 • Incidencia de Servidor</span>
        </div>

        {/* Floating Icon */}
        <div className="error-icon-box bg-rose-50 text-rose-600 border border-rose-200">
          <ServerCrash className="w-10 h-10 stroke-[1.75]" />
        </div>

        {/* Hero Code & Title */}
        <h1 className="error-code-number">500</h1>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
          Interrupción Temporal de Servicio
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed mb-6">
          Nuestros servidores encontraron una dificultad técnica al procesar tu solicitud. El equipo de operaciones ya fue notificado automáticamente.
        </p>

        {/* Incident Ticket Box */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto mb-6 flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Ticket de Incidencia
            </span>
            <span className="font-mono font-bold text-xs text-slate-800">
              {incidentId}
            </span>
          </div>
          <button
            onClick={handleCopyTicket}
            className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-slate-400 text-slate-700 text-xs font-semibold shadow-2xs inline-flex items-center gap-1.5 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copiar ID</span>
              </>
            )}
          </button>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleRetry}
            disabled={retrying}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <RotateCcw className={`w-4 h-4 ${retrying ? 'animate-spin' : ''}`} />
            <span>{retrying ? 'Reintentando...' : 'Reintentar Operación'}</span>
          </button>
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Volver al Inicio</span>
          </Link>
        </div>

        {/* Suggested Links */}
        <div className="error-suggested-links">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 w-full mb-1">
            Recursos y Estado
          </span>
          <Link to="/help" className="error-suggested-link">
            <HelpCircle className="w-3 h-3 inline mr-1" />
            Reportar con ID a Soporte
          </Link>
          <a
            href="https://status.educonnect.com"
            target="_blank"
            rel="noreferrer"
            className="error-suggested-link"
          >
            <Activity className="w-3 h-3 inline mr-1 text-emerald-600" />
            Página de Estado del Sistema
          </a>
        </div>
      </div>
    </div>
  );
};
