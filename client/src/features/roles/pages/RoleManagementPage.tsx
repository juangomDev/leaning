import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { RoleSwitcher } from '../components/RoleSwitcher';
import { BecomeTutorForm } from '../components/BecomeTutorForm';
import { BecomeStudentForm } from '../components/BecomeStudentForm';

export const RoleManagementPage: React.FC = () => {
  const { roles, activeRole, switchActiveRole } = useAuth();
  const navigate = useNavigate();

  const hasStudent = roles.includes('student');
  const hasTutor = roles.includes('tutor');
  const hasBoth = hasStudent && hasTutor;

  const [showTutorForm, setShowTutorForm] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleTutorSuccess = () => {
    setShowTutorForm(false);
    setSuccessBanner('¡Felicitaciones! Tu perfil de tutor ha sido activado.');
  };

  const handleStudentSuccess = () => {
    setShowStudentForm(false);
    setSuccessBanner('¡Excelente! Tu perfil de estudiante ha sido activado.');
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Breadcrumb */}
      <div>
        <Link
          to={activeRole === 'tutor' ? '/dashboard/tutor' : '/student'}
          className="text-xs text-brand-600 font-bold hover:underline inline-flex items-center gap-1.5 mb-2"
        >
          <i className="fa-solid fa-arrow-left"></i> Volver a mi panel principal
        </Link>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Gestión de Roles y Perfiles
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Una sola cuenta en EduConnect te permite aprender como alumno y enseñar como profesor sin perder tus datos ni tu saldo.
        </p>
      </div>

      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <i className="fa-solid fa-circle-check text-emerald-500 text-base"></i>
            <span className="font-bold">{successBanner}</span>
          </div>
          <button
            onClick={() => setSuccessBanner(null)}
            className="text-emerald-700 hover:text-emerald-900"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
      )}

      {/* Unified Architecture Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-md relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-[10px] font-bold border border-brand-500/30">
                Arquitectura Unificada
              </span>
              <span className="text-xs text-slate-300 font-semibold">Mismo usuario, múltiples capacidades</span>
            </div>
            <h2 className="text-lg font-black text-white">Tu Billetera y Credenciales son Únicas</h2>
            <p className="text-xs text-slate-300 mt-1 max-w-xl">
              Los ingresos que generas dando clases como Tutor pueden ser utilizados inmediatamente para agendar clases como Alumno.
            </p>
          </div>

          <div className="shrink-0">
            <RoleSwitcher />
          </div>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Role 1: Estudiante */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center text-xl">
                <i className="fa-solid fa-graduation-cap"></i>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                hasStudent
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {hasStudent ? 'Perfil Activo' : 'No Habilitado'}
              </span>
            </div>

            <h3 className="text-base font-black text-slate-900">Perfil de Estudiante</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Explora tutores en cientos de materias, agenda sesiones virtuales en vivo y gestiona tu aprendizaje.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-emerald-500 text-[11px]"></i>
                <span>Acceso al aula virtual y pizarras interactivas</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-emerald-500 text-[11px]"></i>
                <span>Garantía de reembolso en cancelaciones con tiempo</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-emerald-500 text-[11px]"></i>
                <span>Historial de clases y evaluaciones de tutores</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100">
            {hasStudent ? (
              <button
                type="button"
                onClick={() => {
                  switchActiveRole('student');
                  navigate('/student');
                }}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>Ir al Portal de Estudiante</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowStudentForm(!showStudentForm);
                  setShowTutorForm(false);
                }}
                className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                {showStudentForm ? 'Ocultar Formulario' : 'Activar Perfil de Estudiante'}
              </button>
            )}
          </div>
        </div>

        {/* Role 2: Tutor */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-xl">
                <i className="fa-solid fa-chalkboard-user"></i>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                hasTutor
                  ? 'bg-purple-50 text-purple-700 border border-purple-200'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {hasTutor ? 'Perfil Activo' : 'No Habilitado'}
              </span>
            </div>

            <h3 className="text-base font-black text-slate-900">Perfil de Tutor</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Comparte tu conocimiento, fija tu tarifa horaria y enseña a estudiantes de toda Latinoamérica y España.
            </p>

            <ul className="mt-4 space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-purple-600 text-[11px]"></i>
                <span>Fija tu propio precio por hora y horarios disponibles</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-purple-600 text-[11px]"></i>
                <span>Pagos directos a tu billetera sin demoras</span>
              </li>
              <li className="flex items-center gap-2">
                <i className="fa-solid fa-check text-purple-600 text-[11px]"></i>
                <span>Perfil profesional visible en el catálogo de tutores</span>
              </li>
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100">
            {hasTutor ? (
              <button
                type="button"
                onClick={() => {
                  switchActiveRole('tutor');
                  navigate('/dashboard/tutor');
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-2"
              >
                <span>Ir al Panel de Tutor</span>
                <i className="fa-solid fa-arrow-right"></i>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setShowTutorForm(!showTutorForm);
                  setShowStudentForm(false);
                }}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                {showTutorForm ? 'Ocultar Formulario' : 'Conviértete en Tutor'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Interactive Forms if user is toggling role expansion */}
      {showTutorForm && (
        <div className="pt-4">
          <BecomeTutorForm onSuccess={handleTutorSuccess} />
        </div>
      )}

      {showStudentForm && (
        <div className="pt-4">
          <BecomeStudentForm onSuccess={handleStudentSuccess} />
        </div>
      )}
    </div>
  );
};
