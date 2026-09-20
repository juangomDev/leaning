import React, { useState } from 'react';
import { roleService } from '../services/roleService';
import { useAuth } from '../../../context/AuthContext';
import { extractErrorMessage } from '../../../api/apiClient';

interface BecomeTutorFormProps {
  onSuccess: () => void;
}

const COMMON_SUBJECTS = [
  'Matemáticas y Cálculo',
  'Física Clásica y Cuántica',
  'Química Orgánica',
  'Programación y Desarrollo Web',
  'Inglés Conversacional y TOEFL',
  'Economía y Finanzas',
  'Biología y Ciencias Médicas',
];

export const BecomeTutorForm: React.FC<BecomeTutorFormProps> = ({ onSuccess }) => {
  const { refreshProfile, switchActiveRole } = useAuth();

  const [subject, setSubject] = useState(COMMON_SUBJECTS[0]);
  const [hourlyRate, setHourlyRate] = useState<number>(25);
  const [modality, setModality] = useState<'online' | 'presencial'>('online');
  const [experienceYears, setExperienceYears] = useState<number>(3);
  const [degree, setDegree] = useState('');
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await roleService.becomeTutor({
        subject,
        hourlyRate: Number(hourlyRate),
        modality,
        experienceYears: Number(experienceYears),
        degree: degree || 'Graduado Universitario',
        bio: bio || 'Profesor apasionado por la enseñanza con metodología práctica e interactiva.',
      });

      // Refrescar el perfil para detectar ambos roles
      await refreshProfile();
      switchActiveRole('tutor');
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
        <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center text-lg">
          <i className="fa-solid fa-chalkboard-user"></i>
        </div>
        <div>
          <h3 className="text-base font-black text-slate-900">Habilitar Perfil de Tutor</h3>
          <p className="text-xs text-slate-500">
            Define tu tarifa, materia y experiencia para comenzar a recibir alumnos
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation text-rose-500"></i>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Materia Principal a Dictar *</label>
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          >
            {COMMON_SUBJECTS.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Tarifa por Hora (USD) *</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
            <input
              type="number"
              min={10}
              max={150}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(Number(e.target.value))}
              required
              className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Modalidad de Enseñanza</label>
          <select
            value={modality}
            onChange={(e) => setModality(e.target.value as 'online' | 'presencial')}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          >
            <option value="online">Online (Aula Virtual)</option>
            <option value="presencial">Presencial / Híbrida</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Años de Experiencia Docente</label>
          <input
            type="number"
            min={0}
            max={40}
            value={experienceYears}
            onChange={(e) => setExperienceYears(Number(e.target.value))}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">Título Académico / Especialidad</label>
        <input
          type="text"
          value={degree}
          onChange={(e) => setDegree(e.target.value)}
          placeholder="Ej. Licenciatura en Matemáticas Puras / Ingeniero de Sistemas"
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-700 mb-1.5">Presentación / Bio para tus Alumnos</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={3}
          placeholder="Describe tu metodología, cómo guías a tus estudiantes y tu pasión por la enseñanza..."
          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
        />
      </div>

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
        >
          {loading ? (
            <>
              <i className="fa-solid fa-circle-notch fa-spin"></i>
              <span>Activando Rol de Tutor...</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-check"></i>
              <span>Activar Perfil de Tutor</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
