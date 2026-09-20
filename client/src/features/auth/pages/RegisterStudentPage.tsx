import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { AuthLayout } from '../components/AuthLayout';
import { PasswordStrengthMeter } from '../components/PasswordStrengthMeter';
import { extractErrorMessage } from '../../../api/apiClient';

export const RegisterStudentPage: React.FC = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const subjectOptions = [
    'Matemáticas',
    'Programación',
    'Inglés',
    'Física',
    'Química',
    'Economía',
    'Biología',
  ];

  const toggleSubject = (subj: string) => {
    if (selectedSubjects.includes(subj)) {
      setSelectedSubjects(selectedSubjects.filter((s) => s !== subj));
    } else {
      setSelectedSubjects([...selectedSubjects, subj]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMsg('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (!acceptTerms) {
      setErrorMsg('Debes aceptar los Términos y Condiciones para continuar.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    try {
      const res = await signUp({
        email,
        password,
        fullName,
        role: 'student',
        phone: phone || undefined,
      });
      if (res?.error) {
        setErrorMsg(extractErrorMessage(res.error, 'Error al registrar la cuenta.'));
      } else {
        // Redirección directa al wizard de onboarding
        navigate('/onboarding', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Error inesperado al crear tu cuenta.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Registro de Estudiante"
      subtitle="Crea tu cuenta para conectar con los mejores profesores en minutos."
      badge="Cuenta de Estudiante"
    >
      {errorMsg && (
        <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-3">
          <i className="fa-solid fa-circle-exclamation text-red-500 text-sm"></i>
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="auth-form-label">
            Nombre Completo *
          </label>
          <div className="input-with-icon-wrapper">
            <i className="fa-solid fa-user input-icon-left"></i>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ej. Sofía Mendoza"
              className="auth-input has-left-icon"
            />
          </div>
        </div>

        <div>
          <label className="auth-form-label">
            Correo Electrónico *
          </label>
          <div className="input-with-icon-wrapper">
            <i className="fa-solid fa-envelope input-icon-left"></i>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sofia@correo.com"
              className="auth-input has-left-icon"
            />
          </div>
        </div>

        <div>
          <label className="auth-form-label">
            Teléfono o WhatsApp (Opcional)
          </label>
          <div className="input-with-icon-wrapper">
            <i className="fa-solid fa-phone input-icon-left"></i>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+52 55 1234 5678"
              className="auth-input has-left-icon"
            />
          </div>
        </div>

        <div>
          <label className="auth-form-label">
            Contraseña *
          </label>
          <div className="input-with-icon-wrapper">
            <i className="fa-solid fa-lock input-icon-left"></i>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              className="auth-input has-left-icon has-right-icon"
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

        {/* Subjects of interest chips */}
        <div className="pt-1">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            ¿Qué materias te gustaría aprender?
          </label>
          <div className="flex flex-wrap gap-2">
            {subjectOptions.map((subj) => {
              const isSelected = selectedSubjects.includes(subj);
              return (
                <button
                  key={subj}
                  type="button"
                  onClick={() => toggleSubject(subj)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {subj}
                </button>
              );
            })}
          </div>
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
              Acepto los{' '}
              <Link to="/legal/terms" target="_blank" className="font-bold text-brand-600 hover:underline">
                Términos del Servicio
              </Link>{' '}
              y la{' '}
              <Link to="/legal/privacy" target="_blank" className="font-bold text-brand-600 hover:underline">
                Política de Privacidad
              </Link>
              .
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 px-4 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white text-sm font-bold rounded-2xl shadow-lg shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creando cuenta...</span>
            </>
          ) : (
            <>
              <span>Registrarme y Continuar</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 border-t border-slate-100 pt-5">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-bold text-brand-600 hover:underline">
          Inicia sesión
        </Link>
      </div>
    </AuthLayout>
  );
};
