import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { SUBJECTS_DATA, SubjectCategoryInfo } from './SubjectsPage';
import { tutorsService } from '../../../services/tutorsService';
import { Tutor } from '../../../types';

export const SubjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const subjectInfo: SubjectCategoryInfo =
    SUBJECTS_DATA.find((s) => s.slug === slug) || {
      slug: slug || 'general',
      name: (slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Materia'),
      description: 'Clases particulares y asesorías especializadas para todos los niveles.',
      tutorCount: 50,
      icon: 'fa-book-open',
      color: 'text-brand-600 bg-brand-50 border-brand-200',
      subtopics: ['Clases particulares', 'Nivel Universitario', 'Preparación de Exámenes'],
    };

  useEffect(() => {
    setLoading(true);
    tutorsService.getTutors({ categoria: slug }).then((data) => {
      setTutors(data);
      setLoading(false);
    });
  }, [slug]);

  return (
    <div className="bg-slate-50 min-h-screen py-12 antialiased">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link to="/" className="hover:text-brand-600">Inicio</Link>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
          <Link to="/subjects" className="hover:text-brand-600">Materias</Link>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
          <span className="text-brand-600">{subjectInfo.name}</span>
        </div>

        {/* Hero Header for Subject */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shrink-0 ${subjectInfo.color}`}>
              <i className={`fa-solid ${subjectInfo.icon} text-3xl`}></i>
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400">Área de estudio</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1">{subjectInfo.name}</h1>
              <p className="text-slate-600 text-sm mt-2 max-w-2xl leading-relaxed">{subjectInfo.description}</p>
            </div>
          </div>

          <div className="shrink-0 flex gap-2">
            <Link
              to={`/tutors?categoria=${slug}`}
              className="px-5 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow transition-all"
            >
              Filtros Avanzados
            </Link>
          </div>
        </div>

        {/* Subtopics Pills */}
        <div className="mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">Especialidades en {subjectInfo.name}:</span>
          <div className="flex flex-wrap gap-2">
            {subjectInfo.subtopics.map((sub, i) => (
              <span key={i} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 shadow-2xs">
                {sub}
              </span>
            ))}
          </div>
        </div>

        {/* Tutors Grid */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              Tutores disponibles ({tutors.length})
            </h2>
            <Link to={`/tutors?categoria=${slug}`} className="text-xs font-bold text-brand-600 hover:text-brand-800">
              Ver todos en catálogo →
            </Link>
          </div>

          {loading ? (
            <div className="py-20 text-center text-slate-400">
              <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-xs font-bold uppercase tracking-wider">Buscando profesores en {subjectInfo.name}...</p>
            </div>
          ) : tutors.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
              <i className="fa-solid fa-chalkboard-user text-slate-300 text-4xl mb-4"></i>
              <h3 className="text-lg font-bold text-slate-800">No encontramos tutores directos en esta área en este momento</h3>
              <p className="text-xs text-slate-500 mt-2 mb-6">Explora nuestro catálogo general con más de 1,500 docentes disponibles.</p>
              <Link to="/tutors" className="px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl">
                Ver todos los tutores
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tutors.map((tutor) => (
                <div key={tutor.id} className="card-base flex flex-col overflow-hidden">
                  <div className="p-6 flex-1">
                    <div className="flex items-start gap-4 mb-4">
                      <img
                        src={tutor.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200'}
                        alt={tutor.full_name}
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-100 shrink-0"
                      />
                      <div className="min-w-0">
                        <span className="px-2 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-bold rounded-md">
                          {tutor.subject_name}
                        </span>
                        <h3 className="font-bold text-slate-900 text-sm mt-1 truncate">
                          {tutor.full_name}
                        </h3>
                        <div className="flex items-center gap-1 mt-0.5 text-xs text-amber-500 font-bold">
                          <i className="fa-solid fa-star"></i>
                          <span>{tutor.rating}</span>
                          <span className="text-slate-400 font-normal">({tutor.reviews_count})</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed">
                      {tutor.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-600 font-semibold rounded-md">
                        {tutor.modality === 'online' ? 'Online' : 'Presencial'}
                      </span>
                      <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 font-semibold rounded-md">
                        Disponible
                      </span>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400">Tarifa / hora</p>
                      <p className="font-extrabold text-slate-900 text-sm">${tutor.price_per_hour} USD</p>
                    </div>
                    <div className="flex gap-2">
                      <Link
                        to={`/tutors/${tutor.id}`}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold rounded-xl"
                      >
                        Perfil
                      </Link>
                      <Link
                        to={`/tutors/${tutor.id}/book`}
                        className="px-3 py-1.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-xs"
                      >
                        Reservar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
