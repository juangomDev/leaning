import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { studentBookingService } from '../services/studentBookingService';
import { studentWalletService } from '../services/studentWalletService';
import { extractErrorMessage } from '../../../api/apiClient';

interface TutorOption {
  id: string;
  name: string;
  avatar: string;
  headline: string;
  hourlyRate: number;
  subjects: string[];
}

const AVAILABLE_TUTORS: TutorOption[] = [
  {
    id: 'tut_01',
    name: 'Dra. Elena Rostova',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    headline: 'PhD en Física y Matemáticas Puras',
    hourlyRate: 25.0,
    subjects: ['Cálculo Diferencial', 'Física Cuántica', 'Álgebra Lineal'],
  },
  {
    id: 'tut_02',
    name: 'Ing. Carlos Mendoza',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    headline: 'Full-Stack Developer & Ex-Google Lead',
    hourlyRate: 35.0,
    subjects: ['Programación Web', 'Estructuras de Datos', 'Python & Machine Learning'],
  },
  {
    id: 'tut_03',
    name: 'Lic. Sarah Jenkins',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    headline: 'Examinadora TOEFL & Especialista en Conversación',
    hourlyRate: 22.0,
    subjects: ['Inglés Conversacional', 'Preparación TOEFL', 'Inglés de Negocios'],
  },
];

export const StudentBookingNewPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedTutorId = searchParams.get('tutorId');

  const [step, setStep] = useState<number>(1);
  const [selectedTutorId, setSelectedTutorId] = useState<string>(preselectedTutorId || AVAILABLE_TUTORS[0].id);
  const [subject, setSubject] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [time, setTime] = useState<string>('16:00');
  const [durationMinutes, setDurationMinutes] = useState<number>(60);
  const [notes, setNotes] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'WALLET' | 'CARD'>('WALLET');

  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    studentWalletService.getBalance()
      .then(res => setWalletBalance(res.balance))
      .catch(() => setWalletBalance(0));

    // Default minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];
    setDate(dateStr);
  }, []);

  const currentTutor = AVAILABLE_TUTORS.find(t => t.id === selectedTutorId) || AVAILABLE_TUTORS[0];

  useEffect(() => {
    if (currentTutor && (!subject || !currentTutor.subjects.includes(subject))) {
      setSubject(currentTutor.subjects[0]);
    }
  }, [selectedTutorId, currentTutor]);

  // Pricing calculations
  const tutorRatePerHour = currentTutor.hourlyRate;
  const subtotal = (tutorRatePerHour * (durationMinutes / 60));
  const serviceFee = 2.50;
  const total = subtotal + serviceFee;
  const hasEnoughBalance = walletBalance >= total;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await studentBookingService.createBooking({
        tutor_id: currentTutor.id,
        tutor_name: currentTutor.name,
        tutor_avatar: currentTutor.avatar,
        subject_name: subject,
        scheduled_date: date,
        scheduled_time: time,
        duration_minutes: durationMinutes,
        price_paid: total,
      });

      // Navegar a Mis Clases
      navigate('/student/bookings');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Breadcrumb & Heading */}
      <div>
        <Link to="/student/bookings" className="text-xs text-brand-600 font-bold hover:underline inline-flex items-center gap-1.5 mb-2">
          <i className="fa-solid fa-arrow-left"></i> Volver a Mis Clases
        </Link>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Agendar Nueva Clase</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configura los detalles de tu sesión y reserva tu horario en pocos pasos
        </p>
      </div>

      {/* Stepper Header */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 1 ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'
          }`}>
            1
          </div>
          <span className="text-xs font-bold text-slate-800 hidden sm:inline">Selección de Tutor</span>
        </div>
        <div className="h-0.5 flex-1 mx-4 bg-slate-100">
          <div className={`h-full bg-brand-600 transition-all ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
        </div>
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
            step >= 2 ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-400'
          }`}>
            2
          </div>
          <span className="text-xs font-bold text-slate-800 hidden sm:inline">Horario y Pago</span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
          <i className="fa-solid fa-circle-exclamation text-rose-500 mt-0.5"></i>
          <div>
            <p className="font-bold">No se pudo completar la reserva</p>
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Step 1: Tutor Selection */}
      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Elige a tu Tutor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {AVAILABLE_TUTORS.map((tutor) => {
              const isSelected = tutor.id === selectedTutorId;
              return (
                <div
                  key={tutor.id}
                  onClick={() => setSelectedTutorId(tutor.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all bg-white flex flex-col justify-between ${
                    isSelected
                      ? 'border-brand-600 shadow-md ring-2 ring-brand-100'
                      : 'border-slate-200/80 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <img
                        src={tutor.avatar}
                        alt={tutor.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{tutor.name}</h3>
                        <span className="text-xs font-bold text-emerald-600">${tutor.hourlyRate}/h USD</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 mb-3">{tutor.headline}</p>
                    <div className="flex flex-wrap gap-1">
                      {tutor.subjects.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-semibold">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    type="button"
                    className={`mt-4 w-full py-1.5 rounded-xl text-xs font-bold transition-colors ${
                      isSelected
                        ? 'bg-brand-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? 'Seleccionado' : 'Elegir'}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 transition-colors shadow-sm flex items-center gap-2"
            >
              <span>Continuar al Horario y Pago</span>
              <i className="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Schedule & Checkout */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Details Form */}
          <div className="lg:col-span-2 space-y-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={currentTutor.avatar}
                  alt={currentTutor.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{currentTutor.name}</h3>
                  <p className="text-xs text-slate-400">Tutor asignado</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs text-brand-600 font-bold hover:underline"
              >
                Cambiar tutor
              </button>
            </div>

            {/* Subject Select */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Materia o Especialidad *
              </label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                required
              >
                {currentTutor.subjects.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* Date & Time Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Fecha de la Clase *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Hora de Inicio *
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  required
                />
              </div>
            </div>

            {/* Duration Options */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Duración de la Sesión
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[60, 90, 120].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDurationMinutes(dur)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      durationMinutes === dur
                        ? 'border-brand-600 bg-brand-50 text-brand-700 shadow-xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {dur} min
                  </button>
                ))}
              </div>
            </div>

            {/* Notes / Objectives */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Notas o temas a tratar con el profesor
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="Ej. Revisión para examen de cálculo sobre derivadas parciales e integrales dobles..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            {/* Payment Method Selector */}
            <div className="pt-2">
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Método de Pago
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setPaymentMethod('WALLET')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'WALLET'
                      ? 'border-brand-600 bg-brand-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <i className="fa-solid fa-wallet text-brand-600"></i> Saldo en Billetera
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">${walletBalance.toFixed(2)} USD</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    {hasEnoughBalance ? 'Saldo suficiente disponible' : 'Saldo insuficiente (se debitará el faltante)'}
                  </p>
                </div>

                <div
                  onClick={() => setPaymentMethod('CARD')}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'CARD'
                      ? 'border-brand-600 bg-brand-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <i className="fa-solid fa-credit-card text-brand-600"></i> Tarjeta / PayPal
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">Inmediato</span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Procesado de forma segura vía Stripe
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Checkout Breakdown Sidebar */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                Resumen del Pedido
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Tarifa tutor ({durationMinutes} min):</span>
                  <span className="font-semibold text-slate-800">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Tarifa de servicio y plataforma:</span>
                  <span className="font-semibold text-slate-800">${serviceFee.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between text-sm font-black text-slate-900">
                  <span>Total a Pagar:</span>
                  <span className="text-brand-600">${total.toFixed(2)} USD</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
                <p className="flex items-center gap-1.5 text-slate-700 font-semibold">
                  <i className="fa-solid fa-shield-check text-emerald-600"></i> Garantía EduConnect
                </p>
                <p>
                  Tu pago se retiene en custodia segura hasta que la clase finalice satisfactoriamente.
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-brand-600 text-white font-bold text-xs hover:bg-brand-700 disabled:opacity-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <i className="fa-solid fa-circle-notch fa-spin"></i>
                      <span>Confirmando Reserva...</span>
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-check"></i>
                      <span>Confirmar y Reservar</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-semibold"
                >
                  Atrás
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
