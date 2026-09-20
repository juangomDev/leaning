import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { studentService, StudentProfileData } from '../services/studentService';
import { extractErrorMessage } from '../../../api/apiClient';

const ACADEMIC_LEVELS = [
  'Primaria / Básica',
  'Secundaria / Media',
  'Bachillerato / Preparatoria',
  'Pregrado Universitario',
  'Posgrado / Maestría',
  'Profesional Autodidacta',
];

const AVAILABLE_INTERESTS = [
  'Matemáticas',
  'Cálculo',
  'Física',
  'Química',
  'Programación Web',
  'Python',
  'Inglés',
  'Francés',
  'Biología',
  'Economía',
  'Estadística',
];

export const StudentProfilePage: React.FC = () => {
  const { user, profile, refreshProfile } = useAuth();

  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [academicLevel, setAcademicLevel] = useState('Pregrado Universitario');
  const [interests, setInterests] = useState<string[]>(['Matemáticas', 'Programación Web']);
  const [bio, setBio] = useState('');

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const initProfile = async () => {
      setLoading(true);
      try {
        const data = await studentService.getProfile();
        setFullName(data.full_name || profile?.full_name || '');
        setAvatarUrl(data.avatar_url || profile?.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80');
        if (data.academic_level) setAcademicLevel(data.academic_level);
        if (data.interests && data.interests.length > 0) setInterests(data.interests);
        if (data.bio) setBio(data.bio);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    initProfile();
  }, [profile]);

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      setInterests([...interests, interest]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const payload: Partial<StudentProfileData> = {
        full_name: fullName,
        avatar_url: avatarUrl,
        academic_level: academicLevel,
        interests,
        bio,
      };

      await studentService.updateProfile(payload);
      await refreshProfile();
      setSuccessMessage('¡Perfil de estudiante actualizado exitosamente!');
    } catch (err) {
      setErrorMessage(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Mi Perfil de Estudiante</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Administra tus datos personales, nivel formativo e intereses de estudio
        </p>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-3">
          <i className="fa-solid fa-circle-check text-emerald-500 text-sm"></i>
          <span className="font-semibold">{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-3">
          <i className="fa-solid fa-circle-exclamation text-rose-500 text-sm"></i>
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
        {/* Avatar Section */}
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
          <img
            src={avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'}
            alt="Avatar del estudiante"
            className="w-18 h-18 rounded-2xl object-cover border-2 border-brand-100 shadow-xs"
          />
          <div className="space-y-1.5 flex-1">
            <label className="block text-xs font-bold text-slate-700">URL de Foto de Perfil</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
            <p className="text-[10px] text-slate-400">Pega un enlace directo a tu imagen (JPEG, PNG, WebP)</p>
          </div>
        </div>

        {/* Name and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Nombre Completo *</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Correo Electrónico (Registrado)</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-400 bg-slate-50 cursor-not-allowed"
            />
          </div>
        </div>

        {/* Academic Level */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">Nivel Académico Actual</label>
          <select
            value={academicLevel}
            onChange={(e) => setAcademicLevel(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          >
            {ACADEMIC_LEVELS.map(lvl => (
              <option key={lvl} value={lvl}>{lvl}</option>
            ))}
          </select>
        </div>

        {/* Interests Chips */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Intereses y Materias Principales
          </label>
          <p className="text-[11px] text-slate-400 mb-2.5">
            Selecciona las áreas que te interesa reforzar con tus tutores:
          </p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_INTERESTS.map(interest => {
              const isSelected = interests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                  }`}
                >
                  {isSelected && <i className="fa-solid fa-check mr-1.5 text-[10px]"></i>}
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bio / Learning Objectives */}
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1.5">
            Objetivos de Aprendizaje / Metas
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            placeholder="Ej. Me estoy preparando para el examen de admisión a la universidad y requiero apoyo intensivo en cálculo y física..."
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Submit button */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm flex items-center gap-2"
          >
            {saving ? (
              <>
                <i className="fa-solid fa-circle-notch fa-spin"></i>
                <span>Guardando Cambios...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk"></i>
                <span>Guardar Perfil</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
