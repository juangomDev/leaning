import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { tutorsService } from '../services/tutorsService';

export const Home = () => {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [modality, setModality] = useState('');

  useEffect(() => {
    tutorsService.getTutors().then((data) => {
      setTutors(data.slice(0, 3));
      setLoading(false);
    });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    if (modality) params.set('modalidad', modality);
    navigate(`/explorar?${params.toString()}`);
  };

  return (
    <div className="bg-slate-50 text-slate-800 antialiased selection:bg-brand-500 selection:text-white">
      {/* Hero Section */}
      <section className="hero-gradient pt-14 pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-7">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-100 text-brand-700 text-xs font-bold tracking-wider uppercase border border-brand-200/50">
                <i className="fa-solid fa-star text-amber-500 text-xs"></i>
                Plataforma líder en tutorías personalizadas
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 leading-[1.12] tracking-tight">
                Aprende con el tutor<br />que necesitas para
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-indigo-500">
                  {' '}alcanzar tus metas
                </span>
              </h1>

              <p className="text-lg text-slate-600 max-w-xl leading-relaxed">
                Conecta con profesores verificados para clases privadas online o presenciales. Tu ritmo, tu horario, tu aprendizaje.
              </p>

              {/* Search Bar */}
              <div className="bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/80 border border-slate-100 max-w-2xl">
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2.5">
                  <div className="relative flex-1">
                    <i className="fa-solid fa-book-open absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="¿Qué quieres aprender?"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 border border-transparent"
                    />
                  </div>
                  <div className="relative sm:w-44">
                    <i className="fa-solid fa-location-dot absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm"></i>
                    <select
                      value={modality}
                      onChange={(e) => setModality(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 rounded-xl text-slate-700 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-brand-500 border border-transparent appearance-none"
                    >
                      <option value="">Modalidad</option>
                      <option value="online">En Línea</option>
                      <option value="presencial">Presencial</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 text-sm shadow-md"
                  >
                    <i className="fa-solid fa-magnifying-glass"></i> Buscar
                  </button>
                </form>
              </div>

              {/* Quick Links */}
              <div className="flex flex-wrap gap-2 text-xs font-medium text-slate-500">
                <span>Popular:</span>
                <Link to="/explorar?q=matematicas" className="px-3 py-1 bg-white rounded-full border border-slate-200 hover:border-brand-400 hover:text-brand-600 transition-all">
                  Matemáticas
                </Link>
                <Link to="/explorar?q=python" className="px-3 py-1 bg-white rounded-full border border-slate-200 hover:border-brand-400 hover:text-brand-600 transition-all">
                  Python
                </Link>
                <Link to="/explorar?q=ingles" className="px-3 py-1 bg-white rounded-full border border-slate-200 hover:border-brand-400 hover:text-brand-600 transition-all">
                  Inglés
                </Link>
                <Link to="/explorar?q=fisica" className="px-3 py-1 bg-white rounded-full border border-slate-200 hover:border-brand-400 hover:text-brand-600 transition-all">
                  Física
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-8 pt-2 border-t border-slate-200/60">
                <div>
                  <p className="text-2xl font-bold text-slate-900 counter">+1,500</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Tutores Verificados</p>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 counter">98%</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Satisfacción</p>
                </div>
                <div className="h-8 w-px bg-slate-200"></div>
                <div>
                  <p className="text-2xl font-bold text-slate-900 counter">+50</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">Materias</p>
                </div>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                <div className="absolute -top-8 -left-8 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=800&q=80"
                    alt="Estudiantes aprendiendo"
                    className="w-full h-[440px] object-cover"
                  />
                </div>
                {/* Floating badge: verified */}
                <div className="absolute -bottom-5 -left-5 bg-white p-3.5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-lg">
                    <i className="fa-solid fa-shield-check"></i>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">100% Verificados</p>
                    <p className="text-xs text-slate-500">Credenciales validadas</p>
                  </div>
                </div>
                {/* Floating badge: rating */}
                <div className="absolute -top-4 -right-4 bg-white p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2.5">
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
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-12 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl shrink-0">
                <i className="fa-solid fa-user-check"></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Perfiles Transparentes</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Revisa antecedentes, formación académica y reseñas reales antes de elegir.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl shrink-0">
                <i className="fa-solid fa-calendar-check"></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Flexibilidad Total</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Sin paquetes obligatorios. Coordina horarios según tus necesidades.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center text-xl shrink-0">
                <i className="fa-solid fa-handshake-angle"></i>
              </div>
              <div>
                <h3 className="font-bold text-slate-900 mb-1">Garantía de Satisfacción</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Si la primera clase no cumple tus expectativas, te reasignamos sin costo.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Subject Categories */}
      <section id="materias" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Explora por área de estudio
            </h2>
            <p className="mt-3 text-slate-600 text-lg">Especialistas preparados para guiarte en cualquier nivel.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <Link
              to="/explorar?categoria=matematicas"
              className="group p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-400 transition-all duration-300 card-hover block"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center text-2xl transition-all mb-5">
                <i className="fa-solid fa-calculator"></i>
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">Matemáticas</h3>
              <p className="text-sm text-slate-500 mt-1.5 mb-5">Álgebra, Cálculo, Geometría y Estadística.</p>
              <div className="flex items-center text-xs font-bold text-brand-600 gap-1">
                Ver 320+ profesores{' '}
                <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </Link>

            <Link
              to="/explorar?categoria=programacion"
              className="group p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-400 transition-all duration-300 card-hover block"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center text-2xl transition-all mb-5">
                <i className="fa-solid fa-code"></i>
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">Programación & TI</h3>
              <p className="text-sm text-slate-500 mt-1.5 mb-5">Python, JavaScript, Desarrollo Web y Bases de Datos.</p>
              <div className="flex items-center text-xs font-bold text-brand-600 gap-1">
                Ver 210+ profesores{' '}
                <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </Link>

            <Link
              to="/explorar?categoria=ingles"
              className="group p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-400 transition-all duration-300 card-hover block"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center text-2xl transition-all mb-5">
                <i className="fa-solid fa-language"></i>
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">Idiomas</h3>
              <p className="text-sm text-slate-500 mt-1.5 mb-5">Inglés, Francés, Alemán y preparación TOEFL.</p>
              <div className="flex items-center text-xs font-bold text-brand-600 gap-1">
                Ver 450+ profesores{' '}
                <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </Link>

            <Link
              to="/explorar?categoria=ciencias"
              className="group p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-400 transition-all duration-300 card-hover block"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center text-2xl transition-all mb-5">
                <i className="fa-solid fa-atom"></i>
              </div>
              <h3 className="font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">Ciencias Naturales</h3>
              <p className="text-sm text-slate-500 mt-1.5 mb-5">Física, Química, Biología y Termodinámica.</p>
              <div className="flex items-center text-xs font-bold text-brand-600 gap-1">
                Ver 180+ profesores{' '}
                <i className="fa-solid fa-chevron-right text-[10px] group-hover:translate-x-1 transition-transform"></i>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Tutors Preview */}
      <section className="py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-brand-600 text-xs font-extrabold uppercase tracking-widest">Excelencia Académica</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-1 tracking-tight">Tutores Destacados</h2>
              <p className="mt-2 text-slate-600 text-base">Profesores mejor valorados con disponibilidad esta semana.</p>
            </div>
            <Link to="/explorar" className="inline-flex items-center gap-2 text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors">
              Ver todos los tutores <i className="fa-solid fa-arrow-right text-xs"></i>
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutors.map((tutor) => (
              <div
                key={tutor.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 flex flex-col overflow-hidden"
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
      <section id="como-funciona" className="py-20 bg-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-14">
            <span className="text-brand-500 text-xs font-extrabold uppercase tracking-widest">Proceso Simple</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 tracking-tight">¿Cómo funciona?</h2>
            <p className="mt-3 text-slate-400 text-lg">Empezar a aprender solo te tomará unos minutos.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-7">
            <div className="bg-slate-800/70 backdrop-blur border border-slate-700 p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-brand-600 font-extrabold text-xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/30">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Busca y compara</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Explora perfiles, lee opiniones de alumnos y compara tarifas por hora en tiempo real.
              </p>
            </div>
            <div className="bg-slate-800/70 backdrop-blur border border-slate-700 p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-brand-600 font-extrabold text-xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/30">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Reserva tu clase</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Elige modalidad (Online o Presencial) y selecciona el horario disponible que mejor se ajuste.
              </p>
            </div>
            <div className="bg-slate-800/70 backdrop-blur border border-slate-700 p-8 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-brand-600 font-extrabold text-xl flex items-center justify-center mb-6 shadow-lg shadow-brand-500/30">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Aprende y avanza</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Lo que dicen nuestros estudiantes
            </h2>
            <p className="mt-3 text-slate-600 text-lg">Cientos de alumnos han superado sus metas académicas.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-7">
            <div className="bg-slate-50 p-7 rounded-2xl border border-slate-200/60 space-y-4">
              <div className="flex text-amber-400 text-sm gap-0.5">
                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed italic">
                "Estaba sufriendo con Cálculo Integral. Encontré a la profesora Elena y en solo 4 sesiones logré entender conceptos que llevaba meses sin captar."
              </p>
              <div className="flex items-center gap-3 pt-1">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
                  className="w-10 h-10 rounded-full object-cover"
                  alt="Camila"
                />
                <div>
                  <p className="font-bold text-slate-900 text-sm">Camila Torres</p>
                  <p className="text-xs text-slate-500">Ingeniería Civil</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-7 rounded-2xl border border-slate-200/60 space-y-4">
              <div className="flex text-amber-400 text-sm gap-0.5">
                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed italic">
                "Necesitaba preparar mi entrevista técnica en inglés. Carlos me ayudó con conversación fluida enfocado en términos de software. Súper recomendado."
              </p>
              <div className="flex items-center gap-3 pt-1">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80"
                  className="w-10 h-10 rounded-full object-cover"
                  alt="Mateo"
                />
                <div>
                  <p className="font-bold text-slate-900 text-sm">Mateo Ríos</p>
                  <p className="text-xs text-slate-500">Desarrollador Web</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-7 rounded-2xl border border-slate-200/60 space-y-4">
              <div className="flex text-amber-400 text-sm gap-0.5">
                <i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i><i className="fa-solid fa-star"></i>
              </div>
              <p className="text-slate-700 text-sm leading-relaxed italic">
                "La garantía de la primera clase me dio confianza para probar. Ahora tomo clases semanales de Física y mis notas mejoraron notablemente."
              </p>
              <div className="flex items-center gap-3 pt-1">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80"
                  className="w-10 h-10 rounded-full object-cover"
                  alt="Sofía"
                />
                <div>
                  <p className="font-bold text-slate-900 text-sm">Sofía Mendoza</p>
                  <p className="text-xs text-slate-500">Bachillerato</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tutor CTA */}
      <section className="py-16 bg-gradient-to-r from-brand-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-5">
              <span className="bg-white/20 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                ¿Eres profesor o especialista?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold">
                Enseña en EduConnect y genera ingresos compartiendo tu conocimiento
              </h2>
              <div className="flex flex-wrap gap-5">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <i className="fa-solid fa-circle-check text-brand-accent"></i> Sin cuotas de inscripción
                </span>
                <span className="flex items-center gap-2 text-sm font-medium">
                  <i className="fa-solid fa-circle-check text-brand-accent"></i> Cobros semanales seguros
                </span>
                <span className="flex items-center gap-2 text-sm font-medium">
                  <i className="fa-solid fa-circle-check text-brand-accent"></i> Herramientas para tus clases
                </span>
              </div>
            </div>
            <div className="lg:col-span-4">
              <Link
                to="/registro-tutor"
                className="block w-full py-4 bg-white text-brand-600 hover:bg-brand-50 font-extrabold text-center rounded-2xl shadow-xl transition-all duration-200 text-lg"
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
