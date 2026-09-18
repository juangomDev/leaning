import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface FormDataState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  modality: string;
  rate: string;
  bio: string;
  experienceYears: string;
  degree: string;
}

export const RegistroTutor: React.FC = () => {

  // Earnings Simulator State
  const [weeklyHours, setWeeklyHours] = useState<number>(15);
  const [hourlyRate, setHourlyRate] = useState<number>(25);

  // Application Step Wizard State
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormDataState>({
    name: '',
    email: '',
    phone: '',
    subject: 'Matemáticas',
    modality: 'online',
    rate: '25',
    bio: '',
    experienceYears: '3',
    degree: '',
  });
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Calculate monthly earnings (approx 4.3 weeks in a month)
  const monthlyEarnings = Math.round(weeklyHours * hourlyRate * 4.3);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const faqs = [
    {
      q: '¿Cuáles son los requisitos mínimos para ser tutor?',
      a: 'Tener conocimientos comprobables en la materia que deseas enseñar, identificación oficial vigente y disponibilidad para impartir clases de forma puntual y profesional.',
    },
    {
      q: '¿Cómo y cuándo recibo los pagos de mis clases?',
      a: 'Los pagos de las clases completadas se acumulan en tu billetera EduConnect y se transfieren automáticamente a tu cuenta bancaria o PayPal de manera semanal todos los lunes.',
    },
    {
      q: '¿EduConnect cobra alguna comisión por registro?',
      a: 'El registro y la publicación de tu perfil son 100% gratuitos. Solo retenemos un pequeño porcentaje por servicio una vez que completas clases con éxito.',
    },
    {
      q: '¿Puedo enseñar tanto de forma online como presencial?',
      a: 'Sí, tú decides tu modalidad. Puedes optar por dar clases 100% online en nuestra aula virtual o acordar sesiones presenciales en tu ciudad.',
    },
  ];

  return (
    <div className="bg-slate-50 text-slate-800 antialiased selection:bg-brand-500 selection:text-white pb-20">
      {/* Hero Section */}
      <section className="bg-slate-900 text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2563eb_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider border border-brand-500/30">
                <i className="fa-solid fa-graduation-cap"></i> Únete al equipo docente
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
                Enseña lo que amas.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-indigo-300">
                  Genera ingresos a tu propio ritmo.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
                EduConnect conecta a más de 1,500 tutores con estudiantes de todo el continente. Fija tus propias tarifas, gestiona tus horarios y enseña online o presencial.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <a
                  href="#formulario-postulacion"
                  className="px-6 py-3.5 bg-brand-600 hover:bg-brand-500 text-white font-bold rounded-xl shadow-lg shadow-brand-500/30 transition-all text-sm flex items-center gap-2"
                >
                  <i className="fa-solid fa-user-plus"></i> Postular Ahora
                </a>
                <a
                  href="#simulador"
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition-all text-sm flex items-center gap-2"
                >
                  <i className="fa-solid fa-calculator"></i> Calcular Ingresos
                </a>
              </div>
            </div>

            {/* Quick Stats Pill Cards */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 backdrop-blur">
                <div className="w-10 h-10 rounded-xl bg-brand-600/20 text-brand-400 flex items-center justify-center text-lg mb-3">
                  <i className="fa-solid fa-wallet"></i>
                </div>
                <h3 className="text-2xl font-extrabold text-white">$1,200+</h3>
                <p className="text-xs text-slate-400 mt-1">Ingreso promedio mensual de tutores activos</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 backdrop-blur">
                <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center text-lg mb-3">
                  <i className="fa-solid fa-users"></i>
                </div>
                <h3 className="text-2xl font-extrabold text-white">45,000+</h3>
                <p className="text-xs text-slate-400 mt-1">Estudiantes buscando clases particulares</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 backdrop-blur">
                <div className="w-10 h-10 rounded-xl bg-amber-600/20 text-amber-400 flex items-center justify-center text-lg mb-3">
                  <i className="fa-solid fa-clock"></i>
                </div>
                <h3 className="text-2xl font-extrabold text-white">100%</h3>
                <p className="text-xs text-slate-400 mt-1">Flexibilidad en tus horarios y calendario</p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 backdrop-blur">
                <div className="w-10 h-10 rounded-xl bg-purple-600/20 text-purple-400 flex items-center justify-center text-lg mb-3">
                  <i className="fa-solid fa-shield-check"></i>
                </div>
                <h3 className="text-2xl font-extrabold text-white">Semanal</h3>
                <p className="text-xs text-slate-400 mt-1">Pagos garantizados y directos a tu banco</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Earnings Simulator */}
      <section id="simulador" className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <span className="text-brand-600 text-xs font-extrabold uppercase tracking-widest">Simulador</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              ¿Cuánto podrías ganar enseñando en EduConnect?
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Ajusta las horas que tienes disponibles y tu tarifa esperada para estimar tus ingresos mensuales.
            </p>
          </div>

          <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
            <div className="grid sm:grid-cols-2 gap-8">
              {/* Hours Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Horas por semana
                  </label>
                  <span className="text-base font-extrabold text-brand-600 bg-brand-50 px-3 py-1 rounded-lg border border-brand-200">
                    {weeklyHours} hrs
                  </span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="40"
                  value={weeklyHours}
                  onChange={(e) => setWeeklyHours(parseInt(e.target.value))}
                  className="w-full accent-brand-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>2 hrs (Tiempo libre)</span>
                  <span>40 hrs (Tiempo completo)</span>
                </div>
              </div>

              {/* Rate Slider */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Tarifa por hora
                  </label>
                  <span className="text-base font-extrabold text-brand-600 bg-brand-50 px-3 py-1 rounded-lg border border-brand-200">
                    ${hourlyRate} USD
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="70"
                  step="5"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseInt(e.target.value))}
                  className="w-full accent-brand-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 mt-1">
                  <span>$10 USD (Básico)</span>
                  <span>$70 USD (Especializado)</span>
                </div>
              </div>
            </div>

            {/* Results Banner */}
            <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  Ingreso mensual estimado
                </p>
                <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600 mt-0.5">
                  ${monthlyEarnings.toLocaleString()} <span className="text-sm font-bold text-slate-400">USD/mes</span>
                </p>
              </div>
              <a
                href="#formulario-postulacion"
                className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-xs transition-all shadow-md"
              >
                Comenzar con esta meta →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Application Wizard */}
      <section id="formulario-postulacion" className="py-16 max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-brand-600 text-xs font-extrabold uppercase tracking-widest">
            Proceso de Selección
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Formulario de Postulación Docente
          </h2>
          <p className="text-slate-500 text-sm mt-1">
            Completa estos 3 simples pasos para validar tu perfil
          </p>
        </div>

        {/* Wizard Steps Indicator */}
        <div className="flex items-center justify-between max-w-md mx-auto mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0"></div>
          <div
            className="absolute top-1/2 left-0 h-1 bg-brand-600 -translate-y-1/2 z-0 transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>

          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-9 h-9 rounded-full flex items-center justify-center font-extrabold text-xs relative z-10 transition-all ${
                step === s
                  ? 'bg-brand-600 text-white ring-4 ring-brand-100 shadow-md'
                  : step > s
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white border-2 border-slate-300 text-slate-400'
              }`}
            >
              {step > s ? <i className="fa-solid fa-check"></i> : s}
            </div>
          ))}
        </div>

        {/* Wizard Content Card */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-lg p-6 sm:p-8">
          {isSubmitted ? (
            <div className="text-center py-10 space-y-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-md">
                <i className="fa-solid fa-circle-check"></i>
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900">¡Postulación recibida con éxito!</h3>
              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                Revisaremos tus antecedentes académicos y te notificaremos en menos de 24 horas por correo electrónico para coordinar tu activación.
              </p>
              <div className="pt-4">
                <Link
                  to="/"
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl text-sm transition-all inline-block"
                >
                  Volver al Inicio
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleNextStep} className="space-y-6">
              {/* STEP 1: Datos Personales */}
              {step === 1 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-base font-extrabold text-slate-900 mb-1">Paso 1: Información Personal</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Nombre y Apellido
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Ej. Dra. Elena Rostova"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Correo Electrónico
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="tu@correo.com"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 bg-slate-50 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Teléfono / WhatsApp
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+52 55 1234 5678"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Materias y Tarifas */}
              {step === 2 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-base font-extrabold text-slate-900 mb-1">Paso 2: Materia y Modalidad</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Área Principal de Enseñanza
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 bg-slate-50 focus:bg-white"
                    >
                      <option value="Matemáticas">Matemáticas & Cálculo</option>
                      <option value="Programación">Programación & Ciencias de la Computación</option>
                      <option value="Idiomas">Idiomas (Inglés, Francés, etc.)</option>
                      <option value="Ciencias">Física, Química o Biología</option>
                      <option value="Música">Música e Instrumentos</option>
                    </select>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Modalidad preferida
                      </label>
                      <select
                        value={formData.modality}
                        onChange={(e) => setFormData({ ...formData, modality: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 bg-slate-50 focus:bg-white"
                      >
                        <option value="online">100% En Línea</option>
                        <option value="presencial">Presencial</option>
                        <option value="ambas">Ambas modalidades</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                        Tarifa por hora ($ USD)
                      </label>
                      <input
                        type="number"
                        min="10"
                        max="100"
                        required
                        value={formData.rate}
                        onChange={(e) => setFormData({ ...formData, rate: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Experiencia y Documentos */}
              {step === 3 && (
                <div className="space-y-4 animate-fadeIn">
                  <h3 className="text-base font-extrabold text-slate-900 mb-1">Paso 3: Trayectoria y Metodología</h3>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Título o Grado Académico
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      placeholder="Ej. Licenciatura en Matemáticas Puras (UNAM)"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 bg-slate-50 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                      Breve presentación / Metodología de enseñanza
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      placeholder="Explica tu enfoque pedagógico, cómo preparas tus clases y qué pueden esperar tus estudiantes..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-brand-500 bg-slate-50 focus:bg-white"
                    ></textarea>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                {step > 1 ? (
                  <button
                    type="button"
                    onClick={() => setStep(step - 1)}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50"
                  >
                    ← Anterior
                  </button>
                ) : (
                  <div></div>
                )}
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl shadow-md text-xs transition-all flex items-center gap-1.5"
                >
                  {step === 3 ? 'Enviar Postulación ✓' : 'Siguiente Paso →'}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 max-w-3xl mx-auto px-4 sm:px-6">
        <h3 className="text-xl font-extrabold text-slate-900 text-center mb-6">Preguntas Frecuentes</h3>
        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between font-bold text-sm text-slate-800 hover:text-brand-600"
              >
                <span>{faq.q}</span>
                <i
                  className={`fa-solid fa-chevron-down text-xs transition-transform ${
                    openFaq === idx ? 'rotate-180 text-brand-600' : 'text-slate-400'
                  }`}
                ></i>
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-fadeIn">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
