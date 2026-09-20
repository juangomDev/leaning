import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { tutorsService } from '../../../services/tutorsService';
import { bookingsService } from '../../../services/bookingsService';
import { useAuth } from '../../../context/AuthContext';
import { Tutor } from '../../../types';

export const BookingPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [tutor, setTutor] = useState<Tutor | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [selectedTime, setSelectedTime] = useState<string>('16:00');
  const [durationHours, setDurationHours] = useState<number>(1);
  const [modality, setModality] = useState<'online' | 'presencial'>('online');
  const [notes, setNotes] = useState<string>('');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      tutorsService.getTutorById(id).then((data) => {
        setTutor(data);
        setSelectedSubject(data.subject_name || 'Tutoría');
        setModality(data.modality === 'presencial' ? 'presencial' : 'online');
        setLoading(false);
      });
    }
  }, [id]);

  const hourlyRate = tutor?.price_per_hour || 25;
  const totalPrice = hourlyRate * durationHours;

  const timeSlots = ['09:00', '10:30', '14:00', '15:30', '16:00', '17:30', '19:00'];

  const handleConfirmBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate(`/login?redirect=/tutors/${id}/book`);
      return;
    }

    if (!tutor) return;

    setSubmitting(true);
    setErrorMsg(null);

    try {
      const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();

      await bookingsService.createBooking({
        student_id: user.id,
        tutor_id: tutor.id,
        subject: selectedSubject,
        scheduled_at: scheduledDateTime,
        duration_hours: durationHours,
        modality,
        total_price: totalPrice,
        notes,
        student_name: user.profile?.full_name || user.email?.split('@')[0],
        tutor_name: tutor.full_name,
        tutor_avatar: tutor.avatar_url,
      });

      setBookingSuccess(true);
      setTimeout(() => {
        navigate('/dashboard/clases');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al procesar la reserva. Intenta de nuevo.');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 text-slate-500 gap-3">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-bold uppercase tracking-wider">Cargando detalles de reserva...</p>
      </div>
    );
  }

  if (!tutor) {
    return (
      <div className="max-w-xl mx-auto my-20 p-8 bg-white rounded-3xl text-center border border-slate-200">
        <h2 className="text-xl font-extrabold text-slate-900">Tutor no encontrado</h2>
        <p className="text-sm text-slate-500 mt-2 mb-6">No pudimos cargar la información del profesor seleccionado.</p>
        <Link to="/tutors" className="px-5 py-2.5 bg-brand-600 text-white font-bold text-xs rounded-xl">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen py-12 antialiased">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8 flex items-center gap-2 text-xs font-bold text-slate-500">
          <Link to="/tutors" className="hover:text-brand-600">Catálogo</Link>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
          <Link to={`/tutors/${tutor.id}`} className="hover:text-brand-600">{tutor.full_name}</Link>
          <i className="fa-solid fa-chevron-right text-[10px] text-slate-300"></i>
          <span className="text-brand-600">Confirmar Reserva</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Booking Form (Col 7) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
            <h1 className="text-2xl font-extrabold text-slate-900 mb-1">Configura tu sesión de clase</h1>
            <p className="text-xs text-slate-500 mb-6">Completa los datos para coordinar con tu tutor.</p>

            {bookingSuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center text-emerald-800 animate-fadeIn">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fa-solid fa-circle-check text-emerald-600 text-2xl"></i>
                </div>
                <h2 className="text-xl font-extrabold">¡Reserva confirmada con éxito!</h2>
                <p className="text-xs text-emerald-700 mt-2">
                  La clase ha sido agendada con <strong>{tutor.full_name}</strong>. Redirigiendo a tu panel de clases...
                </p>
              </div>
            ) : (
              <form onSubmit={handleConfirmBooking} className="space-y-6">
                {errorMsg && (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-center gap-2">
                    <i className="fa-solid fa-circle-exclamation text-sm"></i>
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Subject selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Materia o Especialidad</label>
                  <input
                    type="text"
                    value={selectedSubject}
                    onChange={(e) => setSelectedSubject(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                {/* Modality toggle */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Modalidad de Clase</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setModality('online')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        modality === 'online'
                          ? 'border-brand-600 bg-brand-50 text-brand-800'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <p className="font-extrabold text-xs flex items-center gap-1.5">
                        <i className="fa-solid fa-laptop text-brand-600"></i> Online
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">En Aula Virtual con videollamada</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setModality('presencial')}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        modality === 'presencial'
                          ? 'border-brand-600 bg-brand-50 text-brand-800'
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <p className="font-extrabold text-xs flex items-center gap-1.5">
                        <i className="fa-solid fa-location-dot text-brand-600"></i> Presencial
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">En punto de encuentro acordado</p>
                    </button>
                  </div>
                </div>

                {/* Date and Time slots */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Fecha</label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2">Duración</label>
                    <select
                      value={durationHours}
                      onChange={(e) => setDurationHours(Number(e.target.value))}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
                    >
                      <option value={1}>1 hora (Sesión estándar)</option>
                      <option value={1.5}>1.5 horas (Revisión intensiva)</option>
                      <option value={2}>2 horas (Preparación de examen)</option>
                    </select>
                  </div>
                </div>

                {/* Time selection */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Horario disponible</label>
                  <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`py-2 text-center text-xs font-bold rounded-xl border transition-all ${
                          selectedTime === slot
                            ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2">Temas específicos que deseas repasar (Opcional)</label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Ej. Ejercicios de integración por partes, preparación para el examen del viernes..."
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  ></textarea>
                </div>

                {/* Submit Action */}
                {!user ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-center space-y-3">
                    <p className="text-xs font-bold text-amber-800">
                      Debes iniciar sesión para completar la reserva
                    </p>
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-extrabold rounded-xl shadow-sm transition-all"
                    >
                      Iniciar sesión y continuar →
                    </button>
                  </div>
                ) : (
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 bg-brand-600 hover:bg-brand-700 disabled:bg-slate-300 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Procesando reserva...</span>
                      </>
                    ) : (
                      <>
                        <i className="fa-solid fa-lock text-xs"></i>
                        <span>Confirmar Reserva (${totalPrice} USD)</span>
                      </>
                    )}
                  </button>
                )}
              </form>
            )}
          </div>

          {/* Tutor Summary Sidebar (Col 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">Resumen del Tutor</span>
              
              <div className="flex items-center gap-4">
                <img
                  src={tutor.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200'}
                  alt={tutor.full_name}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-100"
                />
                <div className="min-w-0">
                  <h3 className="font-extrabold text-slate-900 text-base">{tutor.full_name}</h3>
                  <p className="text-xs text-slate-500">{tutor.subject_name}</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-amber-500 font-bold">
                    <i className="fa-solid fa-star"></i>
                    <span>{tutor.rating}</span>
                    <span className="text-slate-400 font-normal">({tutor.reviews_count} opiniones)</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tarifa por hora:</span>
                  <span className="font-bold text-slate-900">${hourlyRate} USD</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Duración de la clase:</span>
                  <span className="font-bold text-slate-900">{durationHours} {durationHours === 1 ? 'hora' : 'horas'}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Comisión de servicio:</span>
                  <span className="font-bold text-emerald-600">Gratis ($0)</span>
                </div>
                <div className="pt-3 border-t border-slate-100 flex justify-between items-baseline">
                  <span className="font-extrabold text-sm text-slate-900">Total a pagar:</span>
                  <span className="font-black text-2xl text-brand-600">${totalPrice} <span className="text-xs text-slate-400 font-normal">USD</span></span>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2 text-[11px] text-slate-600">
                <div className="flex items-start gap-2">
                  <i className="fa-solid fa-shield-halved text-brand-600 mt-0.5"></i>
                  <span><strong>Pago protegido:</strong> El tutor solo recibe los fondos tras concluir la sesión.</span>
                </div>
                <div className="flex items-start gap-2">
                  <i className="fa-solid fa-rotate-left text-emerald-600 mt-0.5"></i>
                  <span><strong>Cancelación flexible:</strong> 100% de reembolso hasta 12h antes.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
