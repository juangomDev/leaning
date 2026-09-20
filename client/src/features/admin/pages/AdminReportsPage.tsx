import React, { useState } from 'react';
import { 
  Download, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Shield 
} from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const [startDate, setStartDate] = useState('2026-01-01');
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const reportTypes = [
    {
      id: 'financial',
      title: 'Reporte Financiero Consolidado',
      description: 'Detalle de comisiones percibidas, facturación bruta, saldos en escrow y retiros liquidados.',
      icon: DollarSign,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      id: 'tutors',
      title: 'Rendimiento y Desempeño Docente',
      description: 'Métricas individuales de horas dictadas, puntualidad, calificaciones promedio y retención de alumnos.',
      icon: TrendingUp,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      id: 'disputes',
      title: 'Auditoría de Disputas e Incidencias',
      description: 'Historial de mediaciones arbitrales, laudos emitidos, causas de reclamo y porcentaje de reembolsos.',
      icon: Shield,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      id: 'students',
      title: 'Padrón de Estudiantes y Hábitos de Estudio',
      description: 'Segmentación de alumnos por grado escolar, materias de preferencia y frecuencia de agendamiento.',
      icon: Users,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    }
  ];

  const handleDownload = (reportId: string, title: string) => {
    setGeneratingId(reportId);
    setTimeout(() => {
      // Generate sample CSV
      const content = `Reporte: ${title}\nPeriodo: ${startDate} al ${endDate}\nGenerado el: ${new Date().toISOString()}\n\nCampo,Valor,Notas\nRegistros analizados,142,OK\nEstado de conformidad,100%,Auditoria conforme\n`;
      const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportId}_educonnect_${startDate}_${endDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setGeneratingId(null);
      setSuccessMessage(`El reporte "${title}" se descargó exitosamente.`);
      setTimeout(() => setSuccessMessage(null), 4000);
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Centro de Reportes y Descargas Ejecutivas
        </h1>
        <p className="text-sm text-slate-500 font-medium">
          Exporta reportes contables, operativos y académicos en formato interoperable.
        </p>
      </div>

      {/* Notifications */}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Date Filter Card */}
      <div className="admin-card">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Rango Cronológico para la Extracción
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-1/2">
            <label className="text-xs font-bold text-slate-700 block mb-1">Fecha Desde:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="input text-xs w-full bg-slate-50 border-slate-200"
            />
          </div>
          <div className="w-full sm:w-1/2">
            <label className="text-xs font-bold text-slate-700 block mb-1">Fecha Hasta:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="input text-xs w-full bg-slate-50 border-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Available Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTypes.map((report) => {
          const Icon = report.icon;
          const isGenerating = generatingId === report.id;
          return (
            <div key={report.id} className="admin-card flex flex-col justify-between hover:border-slate-300 transition-all">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold border ${report.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">{report.title}</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {report.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400">Formato: CSV / Hoja de Cálculo</span>
                <button
                  onClick={() => handleDownload(report.id, report.title)}
                  disabled={isGenerating}
                  className="btn btn-primary text-xs font-bold inline-flex items-center gap-1.5 py-1.5 px-3"
                >
                  <Download className={`w-3.5 h-3.5 ${isGenerating ? 'animate-bounce' : ''}`} />
                  {isGenerating ? 'Generando...' : 'Descargar'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scheduled / Recent Generations History */}
      <div className="admin-card">
        <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4" /> Historial de Exportaciones Recientes
        </h2>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="text-emerald-600 w-4 h-4" />
              <div>
                <span className="font-bold text-slate-800">Cierre_Contable_Septiembre_2026.csv</span>
                <span className="text-slate-400 block text-[10px]">Generado por Administrador General</span>
              </div>
            </div>
            <span className="font-mono text-slate-500">2026-09-20 02:15</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="text-emerald-600 w-4 h-4" />
              <div>
                <span className="font-bold text-slate-800">Auditoria_Tutorias_Aprobadas.csv</span>
                <span className="text-slate-400 block text-[10px]">Generado por Administrador General</span>
              </div>
            </div>
            <span className="font-mono text-slate-500">2026-09-18 19:40</span>
          </div>
        </div>
      </div>
    </div>
  );
};
