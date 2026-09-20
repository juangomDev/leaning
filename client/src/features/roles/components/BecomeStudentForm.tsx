import React, { useState } from 'react';
import { roleService } from '../services/roleService';
import { useAuth } from '../../../context/AuthContext';
import { extractErrorMessage } from '../../../api/apiClient';

interface BecomeStudentFormProps {
  onSuccess: () => void;
}

const EDUCATION_LEVELS = [
  'Primaria / Secundaria',
  'Bachillerato / Preparatoria',
  'Estudiante Universitario (Pregrado)',
  'Posgrado / Maestría',
  'Profesional Independiente',
];

const COMMON_GOALS = [
  'Aprobar exámenes de admisión',
  'Aprender un nuevo idioma',
  'Reforzar matemáticas y ciencias',
  'Aprender a programar desde cero',
  'Preparación para certificaciones internacionales',
];

export const BecomeStudentForm: React.FC<BecomeStudentFormProps> = ({ onSuccess }) => {
  const { refreshProfile, switchActiveRole } = useAuth();

  const [educationLevel, setEducationLevel] = useState(EDUCATION_LEVELS[2]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([COMMON_GOALS[2]]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleGoal = (goal: string) => {
    if (selectedGoals.includes(goal)) {
      setSelectedGoals(selectedGoals.filter(g => g !== goal));
    } else {
      setSelectedGoals([...selectedGoals, goal]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await roleService.becomeStudent({
        educationLevel,
        learningGoals: selectedGoals,
      });

      await refreshProfile();
      switchActiveRole('student');
      onSuccess();
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="w-10 h-10 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center text-lg">
          <i className="fa-solid fa-graduation-cap"></i>
        </div>
        <div>
          <h3 className="text-base font-black text-slate-900">Activar Perfil de Estudiante</h3>
          <p className="text-xs text-slate-500">
            Aprende cualquier materia, agenda clases con otros tutores y utiliza tu billetera unificada
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation text-rose-500"></i>
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">Nivel Académico Actual *</label>
        <select
          value={educationLevel}
          onChange={(e) => setEducationLevel(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        >
          {EDUCATION_LEVELS.map(lvl => (
            <option key={lvl} value={lvl}>{lvl}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">Metas Principales de Aprendizaje</label>
        <div className="space-y-2 mt-2">
          {COMMON_GOALS.map(goal => {
            const isChecked = selectedGoals.includes(goal);
            return (
              <label
                key={goal}
                className={`flex items-center gap-3 p-3 rounded-xl border text-xs cursor-pointer transition-colors ${
                  isChecked ? 'border-brand-600 bg-brand-50 text-brand-900 font-bold' : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => toggleGoal(goal)}
                  className="rounded text-brand-600 focus:ring-brand-500 accent-brand-600"
                />
                <span>{goal}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
        >
          {loading ? (
            <>
              <i className="fa-solid fa-circle-notch fa-spin"></i>
              <span>Activando Rol de Alumno...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-check"></i>
              <span>Activar Perfil de Estudiante</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
