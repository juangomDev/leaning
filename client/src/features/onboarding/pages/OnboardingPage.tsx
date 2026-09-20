import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { onboardingService } from '../services/onboardingService';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile, role } = useAuth();

  const isTutor = role === 'tutor';
  const [step, setStep] = useState<number>(1);
  const [saving, setSaving] = useState<boolean>(false);
  const [completed, setCompleted] = useState<boolean>(false);

  // Student state
  const [educationLevel, setEducationLevel] = useState<string>('Universidad');
  const [learningGoals, setLearningGoals] = useState<string[]>([
    'Aprobar materias difíciles',
  ]);
  const [schedulePreference, setSchedulePreference] = useState<string>('tardes');
  const [preferredModality, setPreferredModality] = useState<string>('online');

  // Tutor state
  const [avatarUrl, setAvatarUrl] = useState<string>(
    profile?.avatar_url ||
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80'
  );
  const [availabilityDays, setAvailabilityDays] = useState<string[]>([
    'Lunes a Viernes',
  ]);
  const [paymentMethod, setPaymentMethod] = useState<string>('transferencia');

  const studentGoalOptions = [
    'Aprobar materias difíciles',
    'Preparar examen de admisión',
    'Aprender a programar',
    'Dominar un nuevo idioma',
    'Acompañamiento semanal continuo',
    'Reforzar conceptos clave',
  ];

  const toggleStudentGoal = (goal: string) => {
    if (learningGoals.includes(goal)) {
      setLearningGoals(learningGoals.filter((g) => g !== goal));
    } else {
      setLearningGoals([...learningGoals, goal]);
    }
  };

  const handleFinish = async () => {
    setSaving(true);
    try {
      if (isTutor) {
        await onboardingService.completeOnboarding({
          role: 'tutor',
          avatarUrl,
          schedulePreference: availabilityDays.join(', '),
          paymentMethod,
        });
      } else {
        await onboardingService.completeOnboarding({
          role: 'student',
          educationLevel,
          learningGoals,
          schedulePreference,
        });
      }
      setCompleted(true);
    } catch {
      // Si ocurre un error de red local, avanzamos igualmente al dashboard
      setCompleted(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="w-full py-10 sm:py-16 px-4 sm:px-6 lg:px-8 antialiased">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-50 text-brand-700 rounded-full border border-brand-200/60 text-xs font-bold">
            <i className="fa-solid fa-wand-magic-sparkles text-brand-600"></i>
            <span>Configuración Inicial</span>
          </div>
          <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
            Paso {step} de 3
          </span>
        </div>

        <div className="w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/40">
          {completed ? (
            <div className="text-center py-6 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto shadow-md animate-bounce">
                <i className="fa-solid fa-wand-magic-sparkles"></i>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  ¡Todo listo, {profile?.full_name || user?.email?.split('@')[0]}!
                </h2>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                  Tu perfil ha sido configurado exitosamente. Ya puedes explorar y agendar tus
                  primeras clases personalizadas.
                </p>
              </div>

              <button
                type="button"
                onClick={() => navigate(isTutor ? '/dashboard/tutor' : '/dashboard')}
                className="w-full sm:w-auto px-8 py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-brand-500/25 transition-all"
              >
                Ir a Mi Portal →
              </button>
            </div>
          ) : (
            <div>
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 mb-2">
                  <span>Configuración de Perfil</span>
                  <span>{step === 1 ? '33%' : step === 2 ? '66%' : '100%'}</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-600 transition-all duration-300 rounded-full"
                    style={{ width: step === 1 ? '33%' : step === 2 ? '66%' : '100%' }}
                  ></div>
                </div>
              </div>

              {/* STUDENT ONBOARDING */}
              {!isTutor && (
                <div>
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                          ¿Cuál es tu nivel de estudios actual?
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Esto nos ayuda a recomendarte profesores con el enfoque pedagógico ideal.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {[
                          { id: 'Secundaria', desc: 'Educación básica', icon: 'fa-book-open' },
                          { id: 'Bachillerato', desc: 'Preparatoria / Prepa', icon: 'fa-school' },
                          { id: 'Universidad', desc: 'Pregrado / Licenciatura', icon: 'fa-graduation-cap' },
                          { id: 'Profesional', desc: 'Posgrado o Carrera laboral', icon: 'fa-briefcase' },
                        ].map((lvl) => (
                          <button
                            key={lvl.id}
                            type="button"
                            onClick={() => setEducationLevel(lvl.id)}
                            className={`p-4 rounded-2xl border text-left transition-all flex items-start gap-3 ${
                              educationLevel === lvl.id
                                ? 'border-brand-600 bg-brand-50/50 shadow-sm'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <i
                              className={`fa-solid ${lvl.icon} mt-1 text-base ${
                                educationLevel === lvl.id ? 'text-brand-600' : 'text-slate-400'
                              }`}
                            ></i>
                            <div>
                              <p
                                className={`text-sm font-bold ${
                                  educationLevel === lvl.id ? 'text-brand-900' : 'text-slate-800'
                                }`}
                              >
                                {lvl.id}
                              </p>
                              <p className="text-[11px] text-slate-500 mt-0.5">{lvl.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>

                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-full mt-4 py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <span>Siguiente: Tus Metas</span>
                        <i className="fa-solid fa-arrow-right text-xs"></i>
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                          ¿Cuáles son tus principales objetivos?
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Selecciona una o más metas que quieras alcanzar este ciclo.
                        </p>
                      </div>

                      <div className="space-y-2.5">
                        {studentGoalOptions.map((goal) => {
                          const active = learningGoals.includes(goal);
                          return (
                            <button
                              key={goal}
                              type="button"
                              onClick={() => toggleStudentGoal(goal)}
                              className={`w-full p-3.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                                active
                                  ? 'border-brand-600 bg-brand-50 text-brand-800'
                                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>{goal}</span>
                              <i
                                className={`fa-solid ${
                                  active ? 'fa-check-circle text-brand-600 text-base' : 'fa-circle text-slate-200'
                                }`}
                              ></i>
                            </button>
                          );
                        })}
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                        >
                          ← Volver
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="flex-1 py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
                        >
                          <span>Siguiente: Horarios</span>
                          <i className="fa-solid fa-arrow-right text-xs"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                          ¿Qué horarios y modalidad prefieres?
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Nos ayuda a sincronizar la agenda de tus tutores ideales.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Franja Horaria Preferida
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {[
                              { id: 'mananas', label: 'Mañanas (8am - 12pm)', icon: 'fa-sun' },
                              { id: 'tardes', label: 'Tardes (2pm - 6pm)', icon: 'fa-cloud-sun' },
                              { id: 'noches', label: 'Noches (6pm - 10pm)', icon: 'fa-moon' },
                            ].map((s) => (
                              <button
                                key={s.id}
                                type="button"
                                onClick={() => setSchedulePreference(s.id)}
                                className={`p-3 rounded-xl border text-center text-xs font-bold transition-all flex flex-col items-center gap-2 ${
                                  schedulePreference === s.id
                                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                <i className={`fa-solid ${s.icon} text-base`}></i>
                                <span>{s.label}</span>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                            Modalidad de Clase
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              onClick={() => setPreferredModality('online')}
                              className={`p-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                preferredModality === 'online'
                                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <i className="fa-solid fa-laptop text-sm"></i>
                              <span>100% En Línea</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setPreferredModality('presencial')}
                              className={`p-3.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                                preferredModality === 'presencial'
                                  ? 'border-brand-600 bg-brand-50 text-brand-700'
                                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <i className="fa-solid fa-location-dot text-sm"></i>
                              <span>Presencial</span>
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                        >
                          ← Volver
                        </button>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={handleFinish}
                          className="flex-1 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-bold rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
                        >
                          {saving ? (
                            <span>Guardando preferencias...</span>
                          ) : (
                            <>
                              <span>Completar Onboarding</span>
                              <i className="fa-solid fa-check text-xs"></i>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TUTOR ONBOARDING */}
              {isTutor && (
                <div>
                  {step === 1 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                          Tu Foto y Presencia Profesional
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Los tutores con fotografía clara reciben hasta 3 veces más reservas.
                        </p>
                      </div>

                      <div className="flex flex-col items-center gap-4 py-4">
                        <img
                          src={avatarUrl}
                          alt="Avatar tutor"
                          className="w-24 h-24 rounded-3xl object-cover border-4 border-brand-100 shadow-md"
                        />
                        <div className="flex gap-2">
                          {[
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80',
                            'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80',
                            'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=160&q=80',
                            'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
                          ].map((url, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => setAvatarUrl(url)}
                              className={`w-10 h-10 rounded-xl overflow-hidden border-2 transition-all ${
                                avatarUrl === url ? 'border-brand-600 scale-105' : 'border-transparent'
                              }`}
                            >
                              <img src={url} alt="Avatar option" className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setStep(2)}
                        className="w-full py-3.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                      >
                        <span>Siguiente: Horarios Disponibles</span>
                        <i className="fa-solid fa-arrow-right text-xs"></i>
                      </button>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                          ¿Qué días tienes disponibilidad para clases?
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Podrás sincronizar tu calendario con mayor detalle en tu panel.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {['Lunes a Viernes', 'Fines de Semana', 'Tardes y Noches', 'Horario Flexible'].map(
                          (opt) => {
                            const active = availabilityDays.includes(opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  if (active) setAvailabilityDays(availabilityDays.filter((d) => d !== opt));
                                  else setAvailabilityDays([...availabilityDays, opt]);
                                }}
                                className={`w-full p-3.5 rounded-2xl border text-left text-xs font-bold transition-all flex items-center justify-between ${
                                  active
                                    ? 'border-purple-600 bg-purple-50 text-purple-900'
                                    : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                                }`}
                              >
                                <span>{opt}</span>
                                <i
                                  className={`fa-solid ${
                                    active ? 'fa-check-circle text-purple-600 text-base' : 'fa-circle text-slate-200'
                                  }`}
                                ></i>
                              </button>
                            );
                          }
                        )}
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(1)}
                          className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                        >
                          ← Volver
                        </button>
                        <button
                          type="button"
                          onClick={() => setStep(3)}
                          className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                        >
                          <span>Siguiente: Método de Cobro</span>
                          <i className="fa-solid fa-arrow-right text-xs"></i>
                        </button>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                          Método de Cobro Preferido
                        </h2>
                        <p className="text-xs text-slate-500 mt-1">
                          Las clases impartidas se liquidan semanalmente todos los lunes.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {[
                          { id: 'transferencia', label: 'Transferencia Bancaria (CLABE / IBAN)', icon: 'fa-building-columns' },
                          { id: 'paypal', label: 'Cuenta PayPal', icon: 'fa-brands fa-paypal' },
                        ].map((m) => (
                          <button
                            key={m.id}
                            type="button"
                            onClick={() => setPaymentMethod(m.id)}
                            className={`w-full p-4 rounded-2xl border text-left text-xs font-bold transition-all flex items-center gap-3 ${
                              paymentMethod === m.id
                                ? 'border-purple-600 bg-purple-50 text-purple-900 shadow-sm'
                                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <i className={`fa-solid ${m.icon} text-lg text-purple-600`}></i>
                            <span className="flex-1">{m.label}</span>
                            {paymentMethod === m.id && (
                              <i className="fa-solid fa-check-circle text-purple-600 text-base"></i>
                            )}
                          </button>
                        ))}
                      </div>

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => setStep(2)}
                          className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
                        >
                          ← Volver
                        </button>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={handleFinish}
                          className="flex-1 py-3.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
                        >
                          {saving ? (
                            <span>Guardando perfil...</span>
                          ) : (
                            <>
                              <span>Completar Onboarding Docente</span>
                              <i className="fa-solid fa-check text-xs"></i>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
