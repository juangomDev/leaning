import React, { useState, useEffect } from 'react';
import { 
  WifiOff, 
  Wifi, 
  RotateCcw, 
  CheckCircle2, 
  Smartphone, 
  Radio, 
  ArrowRight 
} from 'lucide-react';

export const OfflinePage: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [checking, setChecking] = useState(false);
  const [autoReloadCountdown, setAutoReloadCountdown] = useState<number | null>(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setAutoReloadCountdown(3);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setAutoReloadCountdown(null);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (autoReloadCountdown === null) return;
    if (autoReloadCountdown <= 0) {
      window.location.reload();
      return;
    }

    const timer = setTimeout(() => {
      setAutoReloadCountdown(autoReloadCountdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoReloadCountdown]);

  const handleManualCheck = () => {
    setChecking(true);
    setTimeout(() => {
      setChecking(false);
      if (navigator.onLine) {
        setIsOnline(true);
        window.location.reload();
      } else {
        setIsOnline(false);
      }
    }, 1000);
  };

  return (
    <div className="error-page-wrapper">
      <div className="error-bg-glow error-bg-glow-blue" />
      <div className="error-bg-glow error-bg-glow-rose" />

      <div className="error-card">
        {/* Badge with Live Connection Indicator */}
        <div className={`error-code-badge ${isOnline ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'error-badge-offline'}`}>
          <span className={`offline-ping ${isOnline ? 'offline-ping-connected' : 'offline-ping-disconnected'}`} />
          <span>
            {isOnline ? '¡Conexión a Internet Restablecida!' : 'Sin Conexión a Internet'}
          </span>
        </div>

        {/* Floating Icon */}
        <div className={`error-icon-box ${isOnline ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
          {isOnline ? (
            <Wifi className="w-10 h-10 stroke-[1.75]" />
          ) : (
            <WifiOff className="w-10 h-10 stroke-[1.75]" />
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-2">
          {isOnline ? '¡Estás de Vuelta en Línea!' : 'Parece que Has Perdido la Señal'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed mb-6">
          {isOnline
            ? `Tu navegador ha recuperado el acceso a la red. Te redirigiremos automáticamente en ${autoReloadCountdown || 1} segundos...`
            : 'No pudimos comunicarnos con los servidores de EduConnect. Verifica tu red Wi-Fi o datos móviles para continuar.'}
        </p>

        {/* Auto Reload Banner if back online */}
        {isOnline && (
          <div className="p-3.5 mb-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Redireccionando a tu aula y clases...</span>
          </div>
        )}

        {/* Troubleshooting Checklist */}
        {!isOnline && (
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 max-w-md mx-auto mb-6 text-left space-y-2.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
              Comprobaciones Rápidas
            </span>
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <Radio className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Verifica si el router Wi-Fi o la señal de red están activos.</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-700">
              <Smartphone className="w-4 h-4 text-blue-600 shrink-0" />
              <span>Asegúrate de no tener activado el Modo Avión en tu dispositivo.</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleManualCheck}
            disabled={checking}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <RotateCcw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
            <span>{checking ? 'Comprobando red...' : 'Reintentar Conexión Ahora'}</span>
          </button>
        </div>

        {/* Suggested Links */}
        <div className="error-suggested-links">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 w-full mb-1">
            EduConnect Offline Ready
          </span>
          <p className="text-[11px] text-slate-400 text-center">
            Tus notas y cambios locales se sincronizarán en cuanto la conexión vuelva a estar disponible.
          </p>
        </div>
      </div>
    </div>
  );
};
