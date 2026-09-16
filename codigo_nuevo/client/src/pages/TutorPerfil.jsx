import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { tutorsService } from '../services/tutorsService';
import { bookingsService } from '../services/bookingsService';
import { useAuth } from '../context/AuthContext';

export const TutorPerfil = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tutor, setTutor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('sobre'); // 'sobre' | 'curriculum' | 'resenas'
  const [isLiked, setIsLiked] = useState(false);

  // Booking Widget State
  const [selectedModality, setSelectedModality] = useState('online');
  const [selectedDay, setSelectedDay] = useState(0); // index of day
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  const days = [
    { day: 'Lun', num: '22', date: '2026-09-22' },
    { day: 'Mar', num: '23', date: '2026-09-23' },
    { day: 'Mié', num: '24', date: '2026-09-24' },
    { day: 'Jue', num: '25', date: '2026-09-25' },
    { day: 'Vie', num: '26', date: '2026-09-26' },
    { day: 'Sáb', num: '27', date: '2026-09-27' },
  ];

  const timeSlots = [
    { time: '09:00 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '11:30 AM', available: false },
    { time: '03:00 PM', available: true },
    { time: '04:30 PM', available: true },
    { time: '06:00 PM', available: false },
  ];

  useEffect(() => {
    tutorsService.getTutorById(id || '1').then((data) => {
      setTutor(data);
      setLoading(false);
    });
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      navigate('/login-registro?redirect=booking');
      return;
    }

    setIsBooking(true);
    try {
      await bookingsService.createBooking({
        tutor_id: tutor.id,
        session_date: days[selectedDay].date,
        start_time: selectedTime,
        modality: selectedModality,
        price: tutor.hourly_rate || tutor.price || 25,
      });
      setBookingSuccess(true);
      setTimeout(() => {
        setBookingSuccess(false);
        navigate('/dashboard/clases');
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-sm font-semibold text-slate-600">Cargando perfil del tutor...</p>
        </div>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 shadow-sm max-w-md">
          <i className="fa-solid fa-user-xmark text-4xl text-slate-400 mb-3 block"></i>
          <h2 className="text-lg font-bold text-slate-900">Tutor no encontrado</h2>
          <p className="text-xs text-slate-500 mt-1 mb-5">El perfil solicitado no existe o fue desactivado.</p>
          <Link to="/explorar" className="px-4 py-2.5 bg-brand-600 text-white rounded-xl font-bold text-sm">
            Volver a Explorar
          </Link>
        </div>
      </div>
    );
  }

  const tutorName = tutor.full_name || tutor.name || 'Dra. Elena Rostova';
  const tutorHeadline = tutor.headline || tutor.subject || 'Matemáticas & Cálculo';
  const tutorAvatar = tutor.avatar_url || tutor.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80';
  const tutorPrice = tutor.hourly_rate || tutor.price || 25;
  const tutorRating = tutor.rating || 4.9;
  const tutorReviews = tutor.reviews_count || tutor.reviews || 84;

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen pb-16 antialiased selection:bg-brand-500 selection:text-white">
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-brand-600 transition-colors">Inicio</Link>
          <i className="fa-solid fa-chevron-right text-[9px]"></i>
          <Link to="/explorar" className="hover:text-brand-600 transition-colors">Explorar</Link>
          <i className="fa-solid fa-chevron-right text-[9px]"></i>
          <span className="text-slate-700 font-medium">{tutorName}</span>
        </nav>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8">
          {/* ======= LEFT / MAIN COLUMN ======= */}
          <div className="lg:col-span-8 space-y-6">
            {/* Profile Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-7">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="relative shrink-0">
                  <img
                    src={tutorAvatar}
                    alt={tutorName}
                    className="w-28 h-28 rounded-2xl object-cover border-4 border-brand-100 shadow-md"
                  />
                  <span className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span> Disponible
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div>
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="px-2.5 py-0.5 bg-brand-50 text-brand-700 text-xs font-bold rounded-lg">
                          Tutor Verificado
                        </span>
                        <span className="px-2.5 py-0.5 bg-amber-50 text-amber-700 text-xs font-bold rounded-lg border border-amber-200">
                          Tutor Top
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">{tutorName}</h1>
                      <p className="text-slate-500 text-sm mt-1">{tutorHeadline}</p>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => setIsLiked(!isLiked)}
                        className={`w-9 h-9 rounded-xl border transition-all flex items-center justify-center ${
                          isLiked
                            ? 'bg-red-50 text-red-500 border-red-200'
                            : 'border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200'
                        }`}
                        title="Guardar como favorito"
                      >
                        <i className={`fa-${isLiked ? 'solid' : 'regular'} fa-heart`}></i>
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(window.location.href);
                          alert('¡Enlace del perfil copiado al portapapeles!');
                        }}
                        className="w-9 h-9 rounded-xl border border-slate-200 text-slate-500 hover:text-brand-600 hover:border-brand-200 transition-all flex items-center justify-center"
                        title="Compartir perfil"
                      >
                        <i className="fa-solid fa-share-nodes"></i>
                      </button>
                    </div>
                  </div>

                  {/* Fast Specs Row */}
                  <div className="flex flex-wrap items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-sm">
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-400 text-xs gap-0.5">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star-half-stroke"></i>
                      </div>
                      <span className="font-bold text-slate-900">{tutorRating}</span>
                      <span className="text-slate-400 text-xs">({tutorReviews} reseñas)</span>
                    </div>
                    <div className="h-4 w-px bg-slate-200"></div>
                    <span className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                      <i className="fa-solid fa-laptop text-brand-600"></i> Online & Presencial
                    </span>
                    <div className="h-4 w-px bg-slate-200"></div>
                    <span className="text-xs text-slate-600 flex items-center gap-1.5 font-medium">
                      <i className="fa-solid fa-shield-check text-emerald-500"></i> Documentos Validados
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Navigation Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="flex border-b border-slate-200">
                <button
                  onClick={() => setActiveTab('sobre')}
                  className={`px-6 py-4 text-sm font-semibold transition-all border-b-2 ${
                    activeTab === 'sobre'
                      ? 'border-brand-600 text-brand-600 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Sobre mí
                </button>
                <button
                  onClick={() => setActiveTab('curriculum')}
                  className={`px-6 py-4 text-sm font-semibold transition-all border-b-2 ${
                    activeTab === 'curriculum'
                      ? 'border-brand-600 text-brand-600 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Currículum
                </button>
                <button
                  onClick={() => setActiveTab('resenas')}
                  className={`px-6 py-4 text-sm font-semibold transition-all border-b-2 ${
                    activeTab === 'resenas'
                      ? 'border-brand-600 text-brand-600 font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Reseñas ({tutorReviews})
                </button>
              </div>

              {/* Tab 1: Sobre mí */}
              {activeTab === 'sobre' && (
                <div className="p-7 space-y-6 animate-fadeIn">
                  <div>
                    <h2 className="font-bold text-slate-900 mb-3 text-base">Presentación & Metodología</h2>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {tutor.bio || 'Docente con amplia experiencia pedagógica. Mi objetivo es que cada estudiante entienda los conceptos fundamentales y los aplique con seguridad, adaptando las explicaciones al ritmo y necesidades individuales.'}
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      Utilizo pizarra digital colaborativa, guías de ejercicios resueltos paso a paso y simulacros periódicos para medir tu progreso real clase a clase.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 mb-3 text-sm">Temas y especialidades</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Cálculo Diferencial', 'Álgebra Lineal', 'Trigonometría', 'Ecuaciones Diferenciales', 'Geometría Analítica', 'Preparación Exámenes'].map((topic) => (
                        <span
                          key={topic}
                          className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded-full hover:bg-brand-50 hover:text-brand-600 transition-colors"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Presentation Video Placeholder */}
                  <div>
                    <h3 className="font-bold text-slate-900 mb-3 text-sm">Video de presentación</h3>
                    <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video flex items-center justify-center group cursor-pointer">
                      <img
                        src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80"
                        alt="Video Thumbnail"
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity"
                      />
                      <div className="absolute w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-xl shadow-2xl group-hover:scale-110 transition-transform">
                        <i className="fa-solid fa-play ml-1"></i>
                      </div>
                      <span className="absolute bottom-3 right-3 px-2 py-1 rounded bg-black/70 text-white text-[10px] font-mono">
                        1:45 min
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Currículum */}
              {activeTab === 'curriculum' && (
                <div className="p-7 space-y-6 animate-fadeIn">
                  <div>
                    <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
                      <i className="fa-solid fa-graduation-cap text-brand-600"></i> Formación Académica
                    </h3>
                    <div className="space-y-4 border-l-2 border-slate-100 pl-4 ml-2">
                      <div>
                        <span className="text-xs font-bold text-brand-600">2016 — 2020</span>
                        <h4 className="text-sm font-bold text-slate-900">Doctorado en Ciencias Matemáticas</h4>
                        <p className="text-xs text-slate-500">Universidad Nacional Autónoma</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-brand-600">2011 — 2015</span>
                        <h4 className="text-sm font-bold text-slate-900">Licenciatura en Matemáticas Puras</h4>
                        <p className="text-xs text-slate-500">Instituto Politécnico Nacional</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-4 text-sm flex items-center gap-2">
                      <i className="fa-solid fa-briefcase text-brand-600"></i> Experiencia Docente
                    </h3>
                    <div className="space-y-4 border-l-2 border-slate-100 pl-4 ml-2">
                      <div>
                        <span className="text-xs font-bold text-emerald-600">2020 — Presente</span>
                        <h4 className="text-sm font-bold text-slate-900">Profesora Adjunta de Cálculo Superior</h4>
                        <p className="text-xs text-slate-500">Facultad de Ingeniería · Clases teóricas y prácticas</p>
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-400">2018 — 2020</span>
                        <h4 className="text-sm font-bold text-slate-900">Tutor Senior de Bachillerato</h4>
                        <p className="text-xs text-slate-500">Centro de Asesoría Académica · Más de 500 alumnos asesorados</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 3: Reseñas */}
              {activeTab === 'resenas' && (
                <div className="p-7 space-y-6 animate-fadeIn">
                  {/* Rating Breakdown Header */}
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-center sm:text-left shrink-0">
                      <p className="text-4xl font-extrabold text-brand-600">{tutorRating}</p>
                      <div className="flex text-amber-400 text-xs gap-0.5 my-1">
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star"></i>
                        <i className="fa-solid fa-star-half-stroke"></i>
                      </div>
                      <p className="text-xs text-slate-400">{tutorReviews} evaluaciones</p>
                    </div>

                    <div className="flex-1 w-full space-y-1.5">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-12 text-slate-500 font-medium">5 estrellas</span>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="w-[88%] h-full bg-amber-400 rounded-full"></div>
                        </div>
                        <span className="w-8 text-right text-slate-400">88%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-12 text-slate-500 font-medium">4 estrellas</span>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="w-[9%] h-full bg-amber-400 rounded-full"></div>
                        </div>
                        <span className="w-8 text-right text-slate-400">9%</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-12 text-slate-500 font-medium">3 estrellas</span>
                        <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                          <div className="w-[3%] h-full bg-amber-400 rounded-full"></div>
                        </div>
                        <span className="w-8 text-right text-slate-400">3%</span>
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl border border-slate-100 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 font-bold text-xs flex items-center justify-center">
                            MR
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">Martín Rodríguez</h4>
                            <p className="text-[10px] text-slate-400">Hace 3 días · Cálculo Multivariable</p>
                          </div>
                        </div>
                        <div className="flex text-amber-400 text-xs gap-0.5">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Excelente docente. Gracias a ella pude aprobar mi parcial de integrales dobles con la nota más alta del curso. Muy paciente y clara.
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-slate-100 bg-white">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center">
                            AV
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">Ana Valeria Soto</h4>
                            <p className="text-[10px] text-slate-400">Hace 1 semana · Álgebra Lineal</p>
                          </div>
                        </div>
                        <div className="flex text-amber-400 text-xs gap-0.5">
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                          <i className="fa-solid fa-star"></i>
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Muy recomendada. Explica con diagramas visuales y te envía notas en PDF al terminar la sesión.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ======= RIGHT / BOOKING SIDEBAR ======= */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-lg p-6 space-y-6 sticky top-24">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <p className="text-xs text-slate-400">Tarifa de sesión</p>
                  <p className="text-3xl font-extrabold text-slate-900">
                    ${tutorPrice} <span className="text-xs font-normal text-slate-400">USD / hora</span>
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-lg border border-emerald-200">
                  Garantía 100%
                </span>
              </div>

              {/* Modality Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Modalidad
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedModality('online')}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      selectedModality === 'online'
                        ? 'bg-brand-50 border-2 border-brand-600 text-brand-700'
                        : 'border border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <i className="fa-solid fa-laptop"></i> En Línea
                  </button>
                  <button
                    onClick={() => setSelectedModality('presencial')}
                    className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                      selectedModality === 'presencial'
                        ? 'bg-brand-50 border-2 border-brand-600 text-brand-700'
                        : 'border border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <i className="fa-solid fa-location-dot"></i> Presencial
                  </button>
                </div>
              </div>

              {/* Day Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Selecciona Fecha
                </label>
                <div className="grid grid-cols-6 gap-1.5">
                  {days.map((d, index) => (
                    <button
                      key={d.num}
                      onClick={() => setSelectedDay(index)}
                      className={`py-2 rounded-xl text-center transition-all ${
                        selectedDay === index
                          ? 'bg-brand-600 text-white shadow-md'
                          : 'bg-slate-50 border border-slate-200 text-slate-700 hover:border-brand-400'
                      }`}
                    >
                      <span className="block text-[10px] uppercase font-semibold">{d.day}</span>
                      <span className="block text-sm font-extrabold">{d.num}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slots */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
                  Horario Disponible
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold text-center border transition-all ${
                        !slot.available
                          ? 'opacity-40 bg-slate-100 text-slate-400 cursor-not-allowed border-slate-200'
                          : selectedTime === slot.time
                          ? 'bg-brand-600 text-white border-brand-600 shadow-md'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-brand-500 hover:text-brand-600'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Booking Action Button */}
              {bookingSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-emerald-800 animate-fadeIn">
                  <i className="fa-solid fa-circle-check text-2xl text-emerald-600 mb-1 block"></i>
                  <p className="text-xs font-bold">¡Clase agendada con éxito!</p>
                  <p className="text-[11px] text-emerald-600">Redirigiendo a tu panel...</p>
                </div>
              ) : (
                <button
                  onClick={handleBooking}
                  disabled={isBooking}
                  className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white font-extrabold rounded-xl shadow-lg shadow-brand-500/20 hover:shadow-xl transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isBooking ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-calendar-check"></i>
                      <span>Reservar Clase (${tutorPrice} USD)</span>
                    </>
                  )}
                </button>
              )}

              <div className="text-center">
                <p className="text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
                  <i className="fa-solid fa-lock text-[10px]"></i> Pago seguro protegido por EduConnect
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
