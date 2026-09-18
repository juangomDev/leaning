import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tutorsService } from '../services/tutorsService';
import { Tutor } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [_loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modality, setModality] = useState<string>('');

  useEffect(() => {
    tutorsService.getTutors().then((data) => {
      setTutors(data.slice(0, 3));
      setLoading(false);
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (modality) params.set('modalidad', modality);
    navigate(`/explorar?${params.toString()}`);
  };

  return (
    <div className="bg-slate-50 text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-grid">
            <div className="hero-content">
              <div className="hero-badge">
                <i className="fa-solid fa-star text-amber-500 text-xs"></i>
                Plataforma líder en tutorías personalizadas
              </div>

              <h1 className="hero-title">
                Aprende con el tutor<br />que necesitas para
                <span className="hero-title-gradient">
                  {' '}alcanzar tus metas
                </span>
              </h1>

              <p className="hero-lead">
                Conecta con profesores verificados para clases privadas online o presenciales. Tu ritmo, tu horario, tu aprendizaje.
              </p>

              {/* Search Bar */}
              <div className="hero-searchbar">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5 w-full">
                  <div className="hero-search-group relative flex-1">
                    <i className="fa-solid fa-book-open hero-search-icon"></i>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="¿Qué quieres aprender?"
                      className="hero-search-select"
                    />
                  </div>
                  <div className="hero-search-divider"></div>
                  <div className="hero-search-group relative sm:w-44">
                    <i className="fa-solid fa-location-dot hero-search-icon"></i>
                    <select
                      value={modality}
                      onChange={(e) => setModality(e.target.value)}
                      className="hero-search-select appearance-none"
                    >
                      <option value="">Modalidad</option>
                      <option value="online">En Línea</option>
                      <option value="presencial">Presencial</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="hero-search-btn"
                  >
                    <i className="fa-solid fa-magnifying-glass"></i> Buscar
                  </button>
                </form>
              </div>

              {/* Quick Links */}
              <div className="hero-quick-links">
                <span>Popular:</span>
                <Link to="/explorar?q=matematicas" className="hero-quick-chip">
                  Matemáticas
                </Link>
                <Link to="/explorar?q=python" className="hero-quick-chip">
                  Python
                </Link>
                <Link to="/explorar?q=ingles" className="hero-quick-chip">
                  Inglés
                </Link>
                <Link to="/explorar?q=fisica" className="hero-quick-chip">
                  Física
                </Link>
              </div>

              {/* Stats */}
              <div className="hero-stats-row">
                <div className="hero-stat-item">
                  <p className="hero-stat-number counter">+1,500</p>
                  <p className="hero-stat-label">Tutores Verificados</p>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat-item">
                  <p className="hero-stat-number counter">98%</p>
                  <p className="hero-stat-label">Satisfacción</p>
                </div>
                <div className="hero-stat-divider"></div>
                <div className="hero-stat-item">
                  <p className="hero-stat-number counter">+50</p>
                  <p className="hero-stat-label">Materias</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="hero-media-wrapper">
              <div className="hero-img-container">
                <img
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                  alt="Estudiantes aprendiendo"
                  className="hero-img"
                />
              </div>
              {/* Floating badge: verified */}
              <div className="hero-card-verified">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg shrink-0">
                  <i className="fa-solid fa-shield-check"></i>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">100% Verificados</p>
                  <p className="text-xs text-slate-500">Credenciales validadas</p>
                </div>
              </div>
              {/* Floating badge: rating */}
              <div className="hero-card-rating">
                <div className="flex text-amber-400 text-xs gap-0.5">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <span className="text-xs font-bold text-slate-700">4.9 / 5.0</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="value-banner">
        <div className="value-container">
          <div className="value-grid">
            <div className="value-item">
              <div className="value-icon-box">
                <i className="fa-solid fa-user-check"></i>
              </div>
              <div>
                <h3 className="value-title">Perfiles Transparentes</h3>
                <p className="value-desc">
                  Revisa antecedentes, formación académica y reseñas reales antes de elegir.
                </p>
              </div>
            </div>
            <div className="value-item">
              <div className="value-icon-box">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <div>
                <h3 className="value-title">Flexibilidad Total</h3>
                <p className="value-desc">
                  Sin paquetes obligatorios. Coordina horarios según tus necesidades.
                </p>
              </div>
            </div>
            <div className="value-item">
              <div className="value-icon-box">
                <i className="fa-solid fa-handshake-angle"></i>
              </div>
              <div>
                <h3 className="value-title">Garantía de Satisfacción</h3>
                <p className="value-desc">
                  Si la primera clase no cumple tus expectativas, te reasignamos sin costo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subject Categories */}
      <section id="materias" className="categories-section">
        <div className="categories-container">
          <div className="section-header">
            <span className="section-subtitle">Especialidades</span>
            <h2 className="section-title">
              Explora por área de estudio
            </h2>
            <p className="section-desc">Especialistas preparados para guiarte en cualquier nivel.</p>
          </div>
          <div className="category-grid">
            <Link
              to="/explorar?categoria=matematicas"
              className="category-card group"
            >
              <div className="category-icon-box bg-blue-50 text-blue-600 group-hover:bg-brand-600 group-hover:text-white">
                <i className="fa-solid fa-calculator"></i>
              </div>
              <h3 className="category-name">Matemáticas</h3>
              <p className="category-desc">Álgebra, Cálculo, Geometría y Estadística.</p>
              <div className="category-cta">
                Ver 320+ profesores{' '}
                <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </Link>

            <Link
              to="/explorar?categoria=programacion"
              className="category-card group"
            >
              <div className="category-icon-box bg-purple-50 text-purple-600 group-hover:bg-brand-600 group-hover:text-white">
                <i className="fa-solid fa-code"></i>
              </div>
              <h3 className="category-name">Programación & TI</h3>
              <p className="category-desc">Python, JavaScript, Desarrollo Web y Bases de Datos.</p>
              <div className="category-cta">
                Ver 210+ profesores{' '}
                <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </Link>

            <Link
              to="/explorar?categoria=idiomas"
              className="category-card group"
            >
              <div className="category-icon-box bg-amber-50 text-amber-600 group-hover:bg-brand-600 group-hover:text-white">
                <i className="fa-solid fa-language"></i>
              </div>
              <h3 className="category-name">Idiomas</h3>
              <p className="category-desc">Inglés, Francés, Alemán y preparación TOEFL.</p>
              <div className="category-cta">
                Ver 450+ profesores{' '}
                <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </Link>

            <Link
              to="/explorar?categoria=ciencias"
              className="category-card group"
            >
              <div className="category-icon-box bg-emerald-50 text-emerald-600 group-hover:bg-brand-600 group-hover:text-white">
                <i className="fa-solid fa-atom"></i>
              </div>
              <h3 className="category-name">Ciencias Naturales</h3>
              <p className="category-desc">Física, Química, Biología y Termodinámica.</p>
              <div className="category-cta">
                Ver 180+ profesores{' '}
                <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tutors Preview */}
      <section className="tutors-showcase">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="tutors-showcase-header">
            <div>
              <span className="text-brand-600 text-xs font-extrabold uppercase tracking-widest">Excelencia Académica</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1 tracking-tight">Tutores Destacados</h2>
              <p className="mt-2 text-slate-600 text-base">Profesores mejor valorados con disponibilidad esta semana.</p>
            </div>
            <Link to="/explorar" className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors">
              Ver todos los tutores <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>

          <div className="tutors-showcase-grid">
            {tutors.map((tutor) => (
              <div
                key={tutor.id}
                className="card-base flex flex-col overflow-hidden"
              >
                <div className="p-6 flex-1">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative shrink-0">
                      <img
                        src={tutor.avatar_url || tutor.avatar}
                        alt={tutor.full_name || tutor.name}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-100"
                      />
                      <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                    </div>
                    <div className="min-w-0">
                      <span className="px-2 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-bold rounded-md">
                        {tutor.subject_name || tutor.headline || tutor.subject || 'Especialista'}
                      </span>
                      <h3 className="font-bold text-slate-900 text-base mt-1 truncate">
                        {tutor.full_name || tutor.name}
                      </h3>
                      <div className="flex items-center gap-1 mt-0.5 text-xs">
                        <div className="flex text-amber-400 gap-0.5">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star-half-stroke"></i>
                        </div>
                        <span className="font-bold text-slate-800">{tutor.rating || 4.9}</span>
                        <span className="text-slate-400">({tutor.reviews_count || tutor.reviews || 48})</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                    {tutor.bio}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md">
                      <i className={`fa-solid ${tutor.modality === 'online' ? 'fa-laptop' : 'fa-location-dot'} text-brand-500 mr-1`}></i>
                      {tutor.modality === 'online' ? 'En Línea' : 'Presencial'}
                    </span>
                    <span className="px-2 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-semibold rounded-md">
                      Verificado
                    </span>
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-400">Tarifa por hora</p>
                    <p className="font-extrabold text-slate-900 text-base">
                      ${tutor.price_per_hour || tutor.hourly_rate || tutor.price || 25}{' '}
                      <span className="text-xs font-normal text-slate-400">USD</span>
                    </p>
                  </div>
                  <Link
                    to={`/tutores/${tutor.id}`}
                    className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                  >
                    Ver Perfil
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/explorar"
              className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl shadow-md transition-all"
            >
              <i className="fa-solid fa-magnifying-glass text-xs"></i> Ver los 1,500+ tutores en el catálogo
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="como-funciona" className="how-it-works-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="section-header mb-14">
            <span className="text-brand-500 text-xs font-extrabold uppercase tracking-widest">Proceso Simple</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">¿Cómo funciona?</h2>
            <p className="mt-3 text-slate-400 text-lg">Empezar a aprender solo te tomará unos minutos.</p>
          </div>
          <div className="steps-grid">
            <div className="step-card">
              <div className="step-number-box">
                1
              </div>
              <h3 className="step-title">Busca y compara</h3>
              <p className="step-desc">
                Explora perfiles, lee opiniones de alumnos y compara tarifas por hora en tiempo real.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number-box">
                2
              </div>
              <h3 className="step-title">Reserva tu clase</h3>
              <p className="step-desc">
                Elige modalidad (Online o Presencial) y selecciona el horario disponible que mejor se ajuste.
              </p>
            </div>
            <div className="step-card">
              <div className="step-number-box">
                3
              </div>
              <h3 className="step-title">Aprende y avanza</h3>
              <p className="step-desc">
                Conéctate al aula virtual o acude al punto de encuentro. Evalúa tu clase al finalizar.
              </p>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link
              to="/explorar"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-lg transition-all"
            >
              Empezar ahora <i className="fa-solid fa-arrow-right text-sm"></i>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="section-header mb-14">
            <span className="section-subtitle">Opiniones</span>
            <h2 className="section-title">
              Lo que dicen nuestros estudiantes
            </h2>
            <p className="section-desc">Cientos de alumnos han superado sus metas académicas.</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
              </div>
              <p className="testimonial-text">
                "Estaba sufriendo con Cálculo Integral. Encontré a la profesora Elena y en solo 4 sesiones logré entender conceptos que llevaba meses sin captar."
              </p>
              <div className="testimonial-author">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                  className="testimonial-avatar"
                  alt="Camila"
                />
                <div>
                  <p className="testimonial-name">Camila Torres</p>
                  <p className="testimonial-role">Ingeniería Civil</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
              </div>
              <p className="testimonial-text">
                "Necesitaba preparar mi entrevista técnica en inglés. Carlos me ayudó con conversación fluida enfocado en términos de software. Súper recomendado."
              </p>
              <div className="testimonial-author">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                  className="testimonial-avatar"
                  alt="Mateo"
                />
                <div>
                  <p className="testimonial-name">Mateo Ríos</p>
                  <p className="testimonial-role">Desarrollador Web</p>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
              </div>
              <p className="testimonial-text">
                "La garantía de la primera clase me dio confianza para probar. Ahora tomo clases semanales de Física y mis notas mejoraron notablemente."
              </p>
              <div className="testimonial-author">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                  className="testimonial-avatar"
                  alt="Sofía"
                />
                <div>
                  <p className="testimonial-name">Sofía Mendoza</p>
                  <p className="testimonial-role">Bachillerato</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tutor CTA */}
      <section className="tutor-cta-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="tutor-cta-grid">
            <div className="tutor-cta-content">
              <span className="tutor-cta-badge">
                ¿Eres profesor o especialista?
              </span>
              <h2 className="tutor-cta-title">
                Enseña en EduConnect y genera ingresos compartiendo tu conocimiento
              </h2>
              <div className="tutor-cta-perks">
                <span className="tutor-cta-perk">
                  <i className="fa-solid fa-circle-check text-brand-accent"></i> Sin cuotas de inscripción
                </span>
                <span className="tutor-cta-perk">
                  <i className="fa-solid fa-circle-check text-brand-accent"></i> Cobros semanales seguros
                </span>
                <span className="tutor-cta-perk">
                  <i className="fa-solid fa-circle-check text-brand-accent"></i> Herramientas para tus clases
                </span>
              </div>
            </div>
            <div className="tutor-cta-action">
              <Link
                to="/registro-tutor"
                className="tutor-cta-btn"
              >
                Regístrate como Tutor →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
