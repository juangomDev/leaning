import React, { useState } from 'react';
import { tutorService, TutorSubject } from '../services/tutorService';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newSubject: TutorSubject) => void;
}

const COMMON_CATEGORIES = [
  'Matemáticas',
  'Física y Química',
  'Programación y Software',
  'Idiomas y Lingüística',
  'Ciencias Médicas y Biología',
  'Economía y Negocios',
];

const COMMON_LEVELS = [
  'Universitario / Pregrado',
  'Bachillerato / Preparatoria',
  'Secundaria / Media',
  'Posgrado / Maestría',
  'Todos los niveles',
];

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState(COMMON_CATEGORIES[0]);
  const [hourlyRate, setHourlyRate] = useState<number>(25);
  const [level, setLevel] = useState(COMMON_LEVELS[0]);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const created = await tutorService.addSubject({
        name,
        category,
        hourlyRate: Number(hourlyRate),
        level,
        active: true,
      });
      onSuccess(created);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-book-bookmark"></i>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">Agregar Materia al Catálogo</h3>
          <p className="text-xs text-slate-500 mt-1">
            Configura la materia que impartirás, su tarifa por hora y el nivel académico
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Nombre de la Materia *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej. Ecuaciones Diferenciales Ordinarias"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Categoría</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              >
                {COMMON_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
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
                  className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Nivel Académico Objetivo</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              {COMMON_LEVELS.map(lvl => (
                <option key={lvl} value={lvl}>{lvl}</option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              {loading ? (
                <>
                  <i className="fa-solid fa-circle-notch fa-spin"></i>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-plus"></i>
                  <span>Agregar Materia</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
