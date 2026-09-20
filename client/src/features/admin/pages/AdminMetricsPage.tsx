import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  DollarSign, 
  Activity, 
  Calendar, 
  BookOpen, 
  PieChart 
} from 'lucide-react';

export const AdminMetricsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');

  const topSubjects = [
    { name: 'Cálculo y Álgebra Lineal', bookings: 342, percentage: 88, color: 'bg-blue-600' },
    { name: 'Física Universitaria', bookings: 278, percentage: 72, color: 'bg-emerald-600' },
    { name: 'Programación en Python & JS', bookings: 245, percentage: 65, color: 'bg-purple-600' },
    { name: 'Inglés Avanzado (TOEFL / IELTS)', bookings: 198, percentage: 52, color: 'bg-amber-500' },
    { name: 'Química Orgánica', bookings: 140, percentage: 38, color: 'bg-rose-500' },
  ];

  const weekdayDistribution = [
    { day: 'Lun', classes: 84, pct: 70 },
    { day: 'Mar', classes: 96, pct: 80 },
    { day: 'Mié', classes: 110, pct: 92 },
    { day: 'Jue', classes: 120, pct: 100 },
    { day: 'Vie', classes: 90, pct: 75 },
    { day: 'Sáb', classes: 65, pct: 54 },
    { day: 'Dom', classes: 42, pct: 35 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Analíticas Avanzadas de Rendimiento
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Métricas de retención, volumen de reservas y comportamiento de demanda en la plataforma.
          </p>
        </div>

        {/* Time range selector */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200">
          {(['7d', '30d', '90d', '1y'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                timeRange === range
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {range === '7d' ? '7 Días' : range === '30d' ? '30 Días' : range === '90d' ? 'Trimestre' : 'Anual'}
            </button>
          ))}
        </div>
      </div>

      {/* Top Strategic KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="admin-kpi-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Crecimiento Usuarios</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              +24.5%
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">1,248</p>
          <p className="text-[11px] text-slate-400 mt-1">Nuevos registros en el período</p>
        </div>

        <div className="admin-kpi-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tasa Conversión</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              +4.2%
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">78.4%</p>
          <p className="text-[11px] text-slate-400 mt-1">De visitas a agendamiento efectivo</p>
        </div>

        <div className="admin-kpi-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Retención Mensual</span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              86.2%
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">86.2%</p>
          <p className="text-[11px] text-slate-400 mt-1">Alumnos que repiten clase en 30 días</p>
        </div>

        <div className="admin-kpi-card">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket Promedio</span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              +$3.20
            </span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2 font-mono">$28.50</p>
          <p className="text-[11px] text-slate-400 mt-1">Gasto medio por clase contratada</p>
        </div>
      </div>

      {/* Analytics Visual Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Demanded Subjects */}
        <div className="admin-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BookOpen className="text-blue-600 w-4 h-4" /> Materias con Mayor Demanda
            </h2>
            <span className="text-xs font-bold text-slate-400 font-mono">Volumen</span>
          </div>

          <div className="space-y-4 pt-2">
            {topSubjects.map((sub, i) => (
              <div key={i} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-800">{sub.name}</span>
                  <span className="text-slate-500 font-mono">{sub.bookings} reservas</span>
                </div>
                <div className="admin-progress-bg">
                  <div 
                    className={`admin-progress-fill ${sub.color}`} 
                    style={{ width: `${sub.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Distribution Histogram */}
        <div className="admin-card space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Calendar className="text-purple-600 w-4 h-4" /> Concentración de Sesiones por Día
            </h2>
            <span className="text-xs font-bold text-slate-400 font-mono">Pico: Jueves</span>
          </div>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {weekdayDistribution.map((item, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-mono font-bold text-slate-500">{item.classes}</span>
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-indigo-500 rounded-t-lg transition-all hover:brightness-110"
                  style={{ height: `${item.pct}%` }}
                ></div>
                <span className="text-xs font-bold text-slate-700">{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Split Card */}
      <div className="admin-card">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <PieChart className="text-emerald-600 w-4 h-4" /> Modelo de Monetización y División de Ingresos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-1 space-y-3">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 block">Comisión de Plataforma Fija</span>
              <span className="text-xl font-black text-emerald-600 font-mono">15.0%</span>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 block">Honorarios a Tutores</span>
              <span className="text-xl font-black text-blue-600 font-mono">85.0%</span>
            </div>
          </div>

          <div className="md:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Facturación Bruta (YTD)</span>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
                Auditado
              </span>
            </div>
            <p className="text-3xl font-black font-mono tracking-tight">$42,580.00 USD</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs text-slate-300">
                <span>Honorarios Tutores (85%): <strong>$36,193.00</strong></span>
                <span>Ingreso Neto EduConnect (15%): <strong className="text-emerald-400">$6,387.00</strong></span>
              </div>
              <div className="w-full h-2.5 bg-slate-700 rounded-full overflow-hidden flex">
                <div className="bg-blue-500 h-full" style={{ width: '85%' }}></div>
                <div className="bg-emerald-400 h-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
