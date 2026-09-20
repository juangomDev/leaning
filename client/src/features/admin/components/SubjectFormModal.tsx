import React, { useState } from 'react';
import { adminOperationsService, AdminSubject } from '../services/adminOperationsService';

interface SubjectFormModalProps {
  subject?: AdminSubject | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  onSaved?: () => void;
}

const CATEGORIES = [
  'Matemáticas',
  'Física',
  'Informática',
  'Idiomas',
  'Ciencias',
  'Economía',
  'Humanidades',
];

export const SubjectFormModal: React.FC<SubjectFormModalProps> = ({
  subject,
  isOpen,
  onClose,
  onSuccess,
  onSaved,
}) => {
  const [name, setName] = useState(subject?.name || '');
  const [slug, setSlug] = useState(subject?.slug || '');
  const [category, setCategory] = useState(subject?.category || CATEGORIES[0]);
  const [active, setActive] = useState(subject ? subject.active : true);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (subject) {
        await adminOperationsService.updateSubject(subject.id, {
          name,
          slug: generatedSlug,
          category,
          active,
        });
      } else {
        await adminOperationsService.createSubject({
          name,
          slug: generatedSlug,
          category,
          active,
        });
      }
      onSuccess?.();
      onSaved?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-5">
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-600 flex items-center justify-center text-xl shrink-0">
            <i className="fa-solid fa-book-open"></i>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <div>
          <h3 className="text-lg font-black text-slate-900">
            {subject ? 'Editar Materia del Catálogo' : 'Crear Nueva Materia Oficial'}
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Esta materia estará disponible para que los tutores la seleccionen y los estudiantes la busquen.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Nombre de la Materia *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (!subject) {
                  setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                }
              }}
              required
              placeholder="Ej. Inteligencia Artificial y Machine Learning"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Identificador URL (Slug) *</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              required
              placeholder="inteligencia-artificial"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Categoría Temática</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="activeSub"
              checked={active}
              onChange={(e) => setActive(e.target.checked)}
              className="rounded text-brand-600 focus:ring-brand-500 accent-brand-600"
            />
            <label htmlFor="activeSub" className="text-xs font-bold text-slate-700 cursor-pointer">
              Materia activa y visible en el explorador
            </label>
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
              className="flex-1 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors shadow-sm"
            >
              {loading ? 'Guardando...' : subject ? 'Guardar Cambios' : 'Crear Materia'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
