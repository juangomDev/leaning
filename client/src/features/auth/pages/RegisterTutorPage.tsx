import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { extractErrorMessage } from '../../../api/apiClient';

export const RegisterTutorPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [step, setStep] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  // Step 1: Account
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Step 2: Subject & Rate
  const [subject, setSubject] = useState<string>('Matemáticas');
  const [modality, setModality] = useState<string>('online');
  const [hourlyRate, setHourlyRate] = useState<number>(25);

  // Step 3: Experience & Bio
  const [experienceYears, setExperienceYears] = useState<string>('3');
  const [degree, setDegree] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);

  const estimatedMonthly = Math.round(hourlyRate * 15 * 4.3);

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (step === 1) {
      if (!fullName || !email || !password) {
        setErrorMsg('Por favor completa todos los campos del paso 1.');
        return;
      }
      if (password.length < 6) {
        setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!subject || hourlyRate <= 0) {
        setErrorMsg('Por favor define tu materia y tarifa por hora.');
        return;
      }
      setStep(3);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!degree || !bio) {
      setErrorMsg('Por favor completa tu titulación y biografía profesional.');
      return;
    }
    if (!acceptTerms) {
      setErrorMsg('Debes aceptar los Términos del Servicio para continuar.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await signUp({
        email,
        password,
        fullName,
        role: 'tutor',
        phone: phone || undefined,
      });
      if (res?.error) {
        setErrorMsg(extractErrorMessage(res.error, 'Error al registrar tu cuenta docente.'));
      } else {
        navigate('/onboarding', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Error al procesar el registro.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Registro para Profesores"
      subtitle="Comparte tu conocimiento y genera ingresos enseñando en EduConnect."
      badge="Comunidad Docente"
    >
      {/* Wizard Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-slate-200 w-full z-0"></div>
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-600 transition-all duration-300 z-0"
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          ></div>

          {[
            { num: 1, label: 'Cuenta' },
            { num: 2, label: 'Tarifa' },
            { num: 3, label: 'Perfil' },
          ].map((s) => (
            <div key={s.num} className="relative z-10 flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  step >= s.num
                    ? 'bg-brand-600 text-white shadow-md'
                    : 'bg-white border-2 border-slate-300 text-slate-400'
                }`}
              >
                {step > s.num ? <i className="fa-solid fa-check text-[10px]"></i> : s.num}
              </div>
              <span className="text-[10px] font-bold text-slate-600 mt-1">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-3">
          <i className="fa-solid fa-circle-exclamation text-red-500 text-sm"></i>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Account Information */}
      {step === 1 && (
        <form onSubmit={handleNext} className="space-y-4">
          <div>
            <label className="auth-form-label">
              Nombre Completo y Título *
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej. Ing. Carlos Mendoza"
              className="auth-input"
            />
          </div>

          <div>
            <label className="auth-form-label">
              Correo Electrónico *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="profesor@correo.com"
              className="auth-input"
            />
          </div>

          <div>
            <label className="auth-form-label">
              Teléfono / WhatsApp *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+52 55 1234 5678"
              className="auth-input"
            />
          </div>

          <div>
            <label className="auth-form-label">
              Contraseña de Acceso *
            </label>
            <div className="input-with-icon-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="auth-input has-right-icon"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="input-icon-right"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
              >
                <i className={`fa-solid ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
              </button>
            </div>
            <PasswordStrengthMeter password={password} />
          </div>

          <button
            type="submit"
            className="w-full mt-4 py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Siguiente: Especialidad & Tarifa</span>
            <i className="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </form>
      )}

      {/* STEP 2: Specialty & Rate */}
      {step === 2 && (
        <form onSubmit={handleNext} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Materia Principal *
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
            >
              <option value="Matemáticas">Matemáticas (Álgebra, Cálculo, Geometría)</option>
              <option value="Programación">Programación (Python, Web, Bases de datos)</option>
              <option value="Inglés">Inglés (Conversación, TOEFL, IELTS)</option>
              <option value="Física">Física & Mecánica</option>
              <option value="Química">Química General & Orgánica</option>
              <option value="Economía">Economía & Finanzas</option>
              <option value="Música">Música & Producción</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Modalidad de Enseñanza
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setModality('online')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  modality === 'online'
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <i className="fa-solid fa-laptop text-sm"></i>
                <span>En Línea</span>
              </button>
              <button
                type="button"
                onClick={() => setModality('presencial')}
                className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  modality === 'presencial'
                    ? 'border-brand-600 bg-brand-50 text-brand-700'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <i className="fa-solid fa-location-dot text-sm"></i>
                <span>Presencial</span>
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Tarifa por Hora (USD)
              </label>
              <span className="text-base font-extrabold text-brand-600">${hourlyRate} USD/h</span>
            </div>
            <input
              type="range"
              min="10"
              max="100"
              step="5"
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              className="w-full accent-brand-600 cursor-pointer"
            />
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 flex justify-between items-center">
              <span>Estimado mensual (~15h/semana):</span>
              <span className="font-extrabold text-slate-900 text-sm">~${estimatedMonthly} USD</span>
            </div>
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
              type="submit"
              className="flex-1 py-3.5 px-4 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Siguiente: Perfil & Bio</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>
        </form>
      )}

      {/* STEP 3: Experience & Bio */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Años de Experiencia Docente
            </label>
            <select
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
            >
              <option value="1">1 - 2 años</option>
              <option value="3">3 - 5 años</option>
              <option value="6">6 - 10 años</option>
              <option value="10">Más de 10 años</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Formación o Título Universitario *
            </label>
            <input
              type="text"
              required
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="Ej. Licenciatura en Matemáticas, Universidad Nacional"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Biografía y Metodología de Enseñanza *
            </label>
            <textarea
              required
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Cuéntales a tus futuros alumnos sobre tu enfoque pedagógico, paciencia y casos de éxito..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none transition-all"
            />
          </div>

          <div className="pt-2">
            <label className="flex items-start gap-2 text-xs text-slate-600 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              />
              <span>
                Acepto el acuerdo docente y las{' '}
                <Link to="/legal/terms" target="_blank" className="font-bold text-brand-600 hover:underline">
                  Políticas de Clases
                </Link>
                .
              </span>
            </label>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50"
            >
              ← Volver
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-3.5 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-sm font-bold rounded-2xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Registrando...</span>
                </>
              ) : (
                <>
                  <span>Completar Registro Docente</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </>
              )}
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-5">
        ¿Ya tienes cuenta docente?{' '}
        <Link to="/login" className="font-bold text-brand-600 hover:underline">
          Inicia sesión
        </Link>
      </div>
    </AuthLayout>
  );
};
