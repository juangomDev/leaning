import React, { useState, useEffect } from 'react';
import { tutorService, TutorProfileData, TutorSubject } from '../services/tutorService';
import { SubjectModal } from '../components/SubjectModal';
import { extractErrorMessage } from '../../../api/apiClient';

export const TutorProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'SUBJECTS' | 'PREVIEW'>('GENERAL');
  const [profile, setProfile] = useState<TutorProfileData | null>(null);
  const [subjects, setSubjects] = useState<TutorSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [baseHourlyRate, setBaseHourlyRate] = useState<number>(25);
  const [experienceYears, setExperienceYears] = useState<number>(8);
  const [degree, setDegree] = useState('');
  const [languages, setLanguages] = useState<string[]>([]);
  const [modality, setModality] = useState<'online' | 'presencial' | 'ambas'>('online');
  const [videoUrl, setVideoUrl] = useState('');

  // Subject modal
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profData, subjectsData] = await Promise.all([
        tutorService.getProfile(),
        tutorService.getSubjects(),
      ]);
      setProfile(profData);
      setSubjects(subjectsData);

      setFullName(profData.full_name);
      setAvatarUrl(profData.avatar_url);
      setHeadline(profData.headline);
      setBio(profData.bio);
      setBaseHourlyRate(profData.baseHourlyRate);
      setExperienceYears(profData.experienceYears);
      setDegree(profData.degree);
      setLanguages(profData.languages);
      setModality(profData.modality);
      setVideoUrl(profData.videoPresentationUrl || '');
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const updated = await tutorService.updateProfile({
        full_name: fullName,
        avatar_url: avatarUrl,
        headline,
        bio,
        baseHourlyRate: Number(baseHourlyRate),
        experienceYears: Number(experienceYears),
        degree,
        languages,
        modality,
        videoPresentationUrl: videoUrl,
      });
      setProfile(updated);
      setSuccessMsg('Información general de perfil actualizada exitosamente.');
    } catch (err) {
      setErrorMsg(extractErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSubject = async (subjectId: string) => {
    if (!confirm('¿Deseas eliminar esta materia de tu catálogo docente?')) return;
    await tutorService.deleteSubject(subjectId);
    const updated = await tutorService.getSubjects();
    setSubjects(updated);
  };

  if (loading || !profile) {
    return (
      <div className="py-20 text-center text-slate-400 bg-white rounded-3xl border border-slate-200/80">
        <i className="fa-solid fa-circle-notch fa-spin text-3xl text-purple-600 mb-3"></i>
        <p className="text-sm font-medium text-slate-600">Cargando perfil docente...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Perfil Profesional y Catálogo</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Configura tus datos públicos, tarifas personalizadas por materia y previsualiza cómo te ven los alumnos
        </p>
      </div>

      {/* 3 Tabs Bar */}
      <div className="flex border-b border-slate-200 gap-2">
        <button
          onClick={() => {
            setActiveTab('GENERAL');
            setSuccessMsg(null);
          }}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'GENERAL'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="fa-solid fa-id-card mr-2"></i>
          Información General
        </button>

        <button
          onClick={() => {
            setActiveTab('SUBJECTS');
            setSuccessMsg(null);
          }}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'SUBJECTS'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="fa-solid fa-book-bookmark mr-2"></i>
          Catálogo de Materias ({subjects.length})
        </button>

        <button
          onClick={() => {
            setActiveTab('PREVIEW');
            setSuccessMsg(null);
          }}
          className={`pb-3 px-4 text-xs font-bold transition-all border-b-2 ${
            activeTab === 'PREVIEW'
              ? 'border-purple-600 text-purple-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <i className="fa-solid fa-eye mr-2"></i>
          Previsualización Pública
        </button>
      </div>

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <i className="fa-solid fa-circle-check text-emerald-600"></i>
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <i className="fa-solid fa-circle-exclamation text-rose-600"></i>
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tab 1: General Info */}
      {activeTab === 'GENERAL' && (
        <form onSubmit={handleSaveGeneral} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
            <img
              src={avatarUrl}
              alt="Avatar docente"
              className="w-20 h-20 rounded-2xl object-cover border-2 border-purple-200 shadow-xs"
            />
            <div className="space-y-1.5 flex-1">
              <label className="block text-xs font-bold text-slate-700">URL de Foto de Perfil</label>
              <input
                type="url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
              <p className="text-[10px] text-slate-400">Una foto profesional aumenta tus reservas en un 40%</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Nombre Completo *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Titular Profesional / Headline *</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Ej. PhD en Física y Matemáticas Puras"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Tarifa Base por Hora (USD) *</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">$</span>
                <input
                  type="number"
                  min={10}
                  max={150}
                  value={baseHourlyRate}
                  onChange={(e) => setBaseHourlyRate(Number(e.target.value))}
                  required
                  className="w-full pl-7 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Años de Experiencia</label>
              <input
                type="number"
                min={0}
                max={40}
                value={experienceYears}
                onChange={(e) => setExperienceYears(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">Modalidad de Clase</label>
              <select
                value={modality}
                onChange={(e) => setModality(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
              >
                <option value="online">Online (Aula Virtual)</option>
                <option value="presencial">Presencial</option>
                <option value="ambas">Ambas modalidades</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Grado / Título Académico</label>
            <input
              type="text"
              value={degree}
              onChange={(e) => setDegree(e.target.value)}
              placeholder="Ej. Doctorado en Ciencias Físicas por la Universidad Complutense"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Video de Presentación (YouTube / Vimeo)</label>
            <input
              type="url"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Biografía y Metodología Pedagógica *</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 disabled:opacity-50 transition-colors shadow-sm"
            >
              {saving ? 'Guardando...' : 'Guardar Datos Generales'}
            </button>
          </div>
        </form>
      )}

      {/* Tab 2: Subjects Catalog (TUTOR_SUBJECT) */}
      {activeTab === 'SUBJECTS' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-base font-black text-slate-900">Catálogo de Materias Ofrecidas</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Define tarifas diferenciadas por materia y el nivel educativo en que la impartes
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsSubjectModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <i className="fa-solid fa-plus"></i>
              <span>Agregar Materia</span>
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {subjects.map((sub) => (
              <div key={sub.id} className="py-4 first:pt-0 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{sub.name}</h3>
                    <span className="px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px]">
                      {sub.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Nivel: <span className="font-semibold text-slate-700">{sub.level}</span>
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <span className="text-sm font-black text-purple-700">${sub.hourlyRate.toFixed(2)}</span>
                    <span className="text-[10px] text-slate-400 block">/ hora</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteSubject(sub.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Eliminar materia"
                  >
                    <i className="fa-solid fa-trash-can text-sm"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Public Preview */}
      {activeTab === 'PREVIEW' && (
        <div className="space-y-4">
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-2xl text-xs text-purple-800 flex items-center gap-2">
            <i className="fa-solid fa-circle-info"></i>
            <span>Así visualizan los estudiantes tu perfil en el catálogo público antes de reservar.</span>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row items-start gap-5">
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-24 h-24 rounded-3xl object-cover border-2 border-purple-200 shadow-sm shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900">{fullName}</h2>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
                    <i className="fa-solid fa-shield-check"></i> Verificado
                  </span>
                </div>
                <p className="text-xs text-purple-700 font-bold mt-0.5">{headline}</p>

                <div className="flex flex-wrap items-center gap-3 mt-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-bold text-amber-500">
                    <i className="fa-solid fa-star"></i> 4.9 (84 reseñas)
                  </span>
                  <span>•</span>
                  <span>{experienceYears} años experiencia</span>
                  <span>•</span>
                  <span className="text-purple-700 font-bold">${baseHourlyRate}/h base</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Acerca del Profesor</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{bio}</p>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Materias Impartidas</h3>
              <div className="flex flex-wrap gap-2">
                {subjects.map(s => (
                  <span key={s.id} className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200">
                    {s.name} (${s.hourlyRate}/h)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Subject Modal */}
      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSuccess={(newSub) => {
          setSubjects([...subjects, newSub]);
        }}
      />
    </div>
  );
};
