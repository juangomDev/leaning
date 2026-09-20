import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const PricingPage: React.FC = () => {
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(2);
  const [ratePerHour, setRatePerHour] = useState<number>(25);

  const monthlyTotal = hoursPerWeek * ratePerHour * 4;

  const comparisonItems = [
    {
      feature: 'Precio por hora',
      educonnect: 'Desde $15 / hora (libre elección por tutor)',
      traditional: '$35 - $60 / hora en institutos fijos',
      winner: true,
    },
    {
      feature: 'Matrícula o cuotas de inscripción',
      educonnect: '$0 (Totalmente gratis)',
      traditional: 'Cobro de matrícula anual o semestral',
      winner: true,
    },
    {
      feature: 'Garantía 1ª Clase',
      educonnect: '100% de devolución si no estás conforme',
      traditional: 'Sin devolución de matrícula',
      winner: true,
    },
    {
      feature: 'Flexibilidad horaria',
      educonnect: 'Elige tu propio horario semana a semana',
      traditional: 'Horarios rígidos sin posibilidad de cambio',
      winner: true,
    },
    {
      feature: 'Modalidad de aprendizaje',
      educonnect: 'Online en aula virtual o Presencial',
      traditional: 'Casi siempre presencial fija',
      winner: true,
    },
    {
      feature: 'Pagos seguros y protegidos',
      educonnect: 'El tutor solo cobra cuando la clase concluye',
      traditional: 'Pago por adelantado del mes completo',
      winner: true,
    },
  ];

  const categoryAverages = [
    { name: 'Matemáticas y Cálculo', avg: '$20 - $30', icon: 'fa-calculator', color: 'text-blue-600 bg-blue-50' },
    { name: 'Programación y Software', avg: '$25 - $40', icon: 'fa-code', color: 'text-purple-600 bg-purple-50' },
    { name: 'Idiomas (Inglés, Francés)', avg: '$18 - $28', icon: 'fa-language', color: 'text-amber-600 bg-amber-50' },
    { name: 'Física y Química', avg: '$22 - $32', icon: 'fa-atom', color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Música e Instrumentos', avg: '$20 - $35', icon: 'fa-music', color: 'text-rose-600 bg-rose-50' },
    { name: 'Preparación de Exámenes', avg: '$25 - $45', icon: 'fa-graduation-cap', color: 'text-indigo-600 bg-indigo-50' },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-brand-600 text-xs font-extrabold uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full border border-brand-200/60">
            Transparencia Total
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mt-4 tracking-tight">
            Pagas solo por lo que aprendes.<br />
            <span className="text-brand-600">Sin mensualidades forzadas.</span>
          </h1>
          <p className="mt-4 text-slate-600 text-lg leading-relaxed">
            En EduConnect cada tutor establece su tarifa de forma independiente. Sin cuotas de registro, sin permanencia obligatoria y con garantía en tu primera clase.
          </p>
        </div>

        {/* Value Calculator */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-200/80 mb-20 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Calculadora Interactiva</span>
              <h2 className="text-2xl font-extrabold text-slate-900 mt-1">Estima tu plan de estudio mensual</h2>
              <p className="text-slate-500 text-sm mt-2">
                Ajusta las horas semanales y la tarifa promedio del tutor para ver cuánto invertirás al mes.
              </p>

              <div className="mt-6 space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                    <span>Horas de clase por semana:</span>
                    <span className="text-brand-600 font-extrabold text-base">{hoursPerWeek} hrs / sem</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>1 hora</span>
                    <span>5 horas</span>
                    <span>10 horas</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                    <span>Tarifa promedio del tutor:</span>
                    <span className="text-brand-600 font-extrabold text-base">${ratePerHour} USD / hr</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={ratePerHour}
                    onChange={(e) => setRatePerHour(Number(e.target.value))}
                    className="w-full accent-brand-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                    <span>$15 USD</span>
                    <span>$35 USD</span>
                    <span>$60 USD</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-8 text-white text-center shadow-lg relative overflow-hidden">
              <div className="absolute -right-8 -bottom-8 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
              <p className="text-brand-200 text-xs uppercase tracking-widest font-bold">Inversión mensual estimada</p>
              <p className="text-5xl font-black mt-3 tracking-tight">
                ${monthlyTotal}
                <span className="text-base font-normal text-brand-200"> USD/mes</span>
              </p>
              <p className="text-xs text-brand-100 mt-2">
                Equivalente a <strong>{hoursPerWeek * 4} horas de clase personalizada</strong> al mes.
              </p>
              <div className="mt-6 pt-6 border-t border-brand-500/50 flex flex-col gap-3">
                <Link
                  to="/tutors"
                  className="w-full py-3 bg-white text-brand-700 hover:bg-brand-50 font-bold text-sm rounded-xl shadow transition-all"
                >
                  Buscar tutores en este rango →
                </Link>
                <p className="text-[11px] text-brand-200 flex items-center justify-center gap-1">
                  <i className="fa-solid fa-shield-halved"></i> Garantía de reembolso en tu primera sesión
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tariffs by category */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Tarifas promedio por materia</h2>
            <p className="text-slate-600 text-sm mt-2">Los precios varían según la experiencia y especialidad del docente.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryAverages.map((cat, idx) => (
              <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4 hover:border-brand-300 transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}>
                  <i className={`fa-solid ${cat.icon} text-lg`}></i>
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 text-sm">{cat.name}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Promedio habitual</p>
                  <p className="font-extrabold text-brand-600 text-sm mt-1">{cat.avg} <span className="text-[10px] text-slate-400 font-normal">USD/hr</span></p>
                </div>
                <Link to={`/subjects`} className="text-slate-400 hover:text-brand-600 text-xs">
                  <i className="fa-solid fa-chevron-right"></i>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison table */}
        <div className="mb-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">¿Por qué EduConnect rinde más?</h2>
            <p className="text-slate-600 text-sm mt-2">Comparativa directa con academias e institutos convencionales.</p>
          </div>

          <div className="overflow-x-auto bg-white rounded-3xl border border-slate-200/80 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-4 px-6 font-bold">Característica</th>
                  <th className="py-4 px-6 font-bold text-brand-700 bg-brand-50/50">EduConnect</th>
                  <th className="py-4 px-6 font-bold">Academias Tradicionales</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {comparisonItems.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-900">{item.feature}</td>
                    <td className="py-4 px-6 font-semibold text-brand-700 bg-brand-50/30 flex items-center gap-2">
                      <i className="fa-solid fa-circle-check text-emerald-500"></i>
                      {item.educonnect}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {item.traditional}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Guarantee Banner */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-8 sm:p-12 text-white shadow-md text-center max-w-4xl mx-auto">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <i className="fa-solid fa-medal text-2xl text-white"></i>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Garantía de Satisfacción 100%</h2>
          <p className="mt-3 text-amber-100 text-base max-w-2xl mx-auto leading-relaxed">
            Si tu primera clase con un tutor no cumple con tus expectativas académicas, te devolvemos el 100% de tu dinero o te reasignamos con otro tutor sin costo adicional.
          </p>
          <div className="mt-6">
            <Link
              to="/tutors"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-slate-900 font-extrabold text-sm rounded-xl shadow hover:bg-amber-50 transition-all"
            >
              Encontrar mi tutor ahora
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
