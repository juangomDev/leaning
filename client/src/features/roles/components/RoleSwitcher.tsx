import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export const RoleSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { roles, activeRole, switchActiveRole } = useAuth();
  const navigate = useNavigate();

  const hasStudent = roles.includes('student');
  const hasTutor = roles.includes('tutor');
  const hasBoth = hasStudent && hasTutor;

  const handleSwitch = (newRole: string) => {
    if (newRole === activeRole) return;
    switchActiveRole(newRole);
    if (newRole === 'tutor') {
      navigate('/dashboard/tutor');
    } else {
      navigate('/student');
    }
  };

  if (!hasBoth) {
    // Si solo tiene un rol, mostramos un botón para habilitar el otro
    return (
      <button
        onClick={() => navigate('/account/roles')}
        className={`inline-flex items-center gap-2 rounded-xl text-xs font-bold transition-all ${
          compact
            ? 'p-2 text-brand-600 hover:bg-brand-50'
            : 'px-3 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200/80 shadow-xs'
        }`}
        title={hasStudent ? 'Habilitar perfil de profesor' : 'Habilitar perfil de estudiante'}
      >
        <i className={`fa-solid ${hasStudent ? 'fa-chalkboard-user' : 'fa-graduation-cap'}`}></i>
        {!compact && (
          <span>{hasStudent ? 'Enseñar como Tutor' : 'Aprender como Alumno'}</span>
        )}
      </button>
    );
  }

  return (
    <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200/80 shadow-inner">
      <button
        type="button"
        onClick={() => handleSwitch('student')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          activeRole === 'student'
            ? 'bg-white text-brand-700 shadow-sm'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <i className="fa-solid fa-graduation-cap text-xs"></i>
        <span>Estudiante</span>
      </button>

      <button
        type="button"
        onClick={() => handleSwitch('tutor')}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
          activeRole === 'tutor'
            ? 'bg-purple-600 text-white shadow-sm'
            : 'text-slate-500 hover:text-slate-800'
        }`}
      >
        <i className="fa-solid fa-chalkboard-user text-xs"></i>
        <span>Tutor</span>
      </button>
    </div>
  );
};
