import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tutorScheduleService, DaySchedule } from '../services/tutorScheduleService';
import { tutorBookingService, TutorBooking } from '../services/tutorBookingService';
import { AvailabilitySlotModal } from '../components/AvailabilitySlotModal';

export const TutorSchedulePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'AVAILABILITY' | 'CALENDAR'>('AVAILABILITY');
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [bookings, setBookings] = useState<TutorBooking[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal for adding slot
  const [modalDay, setModalDay] = useState<{ id: number; name: string } | null>(null);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [schedData, bookingsData] = await Promise.all([
        tutorScheduleService.getWeeklySchedule(),
        tutorBookingService.getBookings(),
      ]);
      setSchedule(schedData);
      setBookings(bookingsData.filter(b => b.status === 'CONFIRMED'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleDay = async (dayId: number) => {
    const updated = await tutorScheduleService.toggleDayActive(dayId);
    setSchedule(updated);
  };

  const handleToggleSlot = async (dayId: number, slotId: string) => {
    const updated = await tutorScheduleService.toggleSlot(dayId, slotId);
    setSchedule(updated);
  };

  const handleDeleteSlot = async (dayId: number, slotId: string) => {
    const updated = await tutorScheduleService.deleteSlot(dayId, slotId);
    setSchedule(updated);
  };

  const openAddSlot = (dayId: number, dayName: string) => {
    setModalDay({ id: dayId, name: dayName });
    setIsSlotModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Agenda y Disponibilidad</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Configura tus horarios semanales de atención y consulta tus clases reservadas
          </p>
        </div>

        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl border border-slate-200/80 shadow-inner shrink-0">
          <button
            onClick={() => setActiveTab('AVAILABILITY')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'AVAILABILITY'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-clock mr-1.5"></i>
            Disponibilidad Semanal
          </button>
          <button
            onClick={() => setActiveTab('CALENDAR')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'CALENDAR'
                ? 'bg-white text-purple-700 shadow-sm'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <i className="fa-solid fa-calendar-check mr-1.5"></i>
            Clases Agendadas ({bookings.length})
          </button>
        </div>
      </div>

      {/* Tab 1: Disponibilidad Semanal */}
      {activeTab === 'AVAILABILITY' && (
        <div className="space-y-4">
          <div className="bg-purple-50/70 border border-purple-200/80 p-4 rounded-2xl flex items-center justify-between text-xs text-purple-900">
            <div className="flex items-center gap-2.5">
              <i className="fa-solid fa-lightbulb text-purple-600 text-sm"></i>
              <span>
                Los estudiantes solo podrán reservar clases durante los bloques que mantengas habilitados en verde.
              </span>
            </div>
            <span className="text-[11px] font-bold text-purple-700 hidden sm:inline">
              Horario recurrente semanal
            </span>
          </div>

          {/* Weekly Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3.5">
            {schedule.map((day) => (
              <div
                key={day.dayId}
                className={`bg-white rounded-3xl p-4 border transition-all flex flex-col justify-between ${
                  day.active ? 'border-slate-200/90 shadow-xs' : 'border-slate-200/40 bg-slate-50/50 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div>
                      <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">{day.dayName}</h3>
                      <span className={`text-[10px] font-bold ${day.active ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {day.active ? 'Activo' : 'Cerrado'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleToggleDay(day.dayId)}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs transition-colors ${
                        day.active ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' : 'bg-slate-200 text-slate-500 hover:bg-slate-300'
                      }`}
                      title={day.active ? 'Desactivar día completo' : 'Activar día'}
                    >
                      <i className={`fa-solid ${day.active ? 'fa-check' : 'fa-power-off'}`}></i>
                    </button>
                  </div>

                  {/* Slots list */}
                  <div className="space-y-2 mt-3">
                    {day.slots.length === 0 ? (
                      <p className="text-[10px] text-slate-400 italic text-center py-4">Sin bloques configurados</p>
                    ) : (
                      day.slots.map((slot) => (
                        <div
                          key={slot.id}
                          className={`p-2 rounded-xl text-xs font-bold flex items-center justify-between border transition-all ${
                            slot.enabled && day.active
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => handleToggleSlot(day.dayId, slot.id)}
                            className="flex-1 text-left flex items-center gap-1.5"
                            title="Haz clic para activar/desactivar bloque"
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${slot.enabled && day.active ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                            <span>{slot.startTime} - {slot.endTime}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteSlot(day.dayId, slot.id)}
                            className="text-slate-400 hover:text-rose-600 pl-1"
                            title="Eliminar bloque"
                          >
                            <i className="fa-solid fa-trash-can text-[10px]"></i>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => openAddSlot(day.dayId, day.dayName)}
                  className="mt-4 w-full py-1.5 rounded-xl border border-dashed border-slate-300 hover:border-purple-500 hover:bg-purple-50/50 text-slate-600 hover:text-purple-700 font-bold text-[11px] transition-colors flex items-center justify-center gap-1"
                >
                  <i className="fa-solid fa-plus text-[10px]"></i>
                  <span>Agregar Bloque</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Clases Agendadas */}
      {activeTab === 'CALENDAR' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-black text-slate-900">Sesiones Confirmadas en Calendario</h2>
              <span className="text-xs font-bold text-purple-700">{bookings.length} clase(s) próximas</span>
            </div>

            {bookings.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <i className="fa-solid fa-calendar-xmark text-3xl mb-2 text-slate-300"></i>
                <p className="text-xs font-semibold">No tienes clases confirmadas en este periodo</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {bookings.map((b) => (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-white hover:border-purple-300 transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={b.studentAvatar}
                        alt={b.studentName}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{b.studentName}</h4>
                        <p className="text-xs text-purple-700 font-semibold">{b.subjectName}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">
                          <i className="fa-regular fa-calendar mr-1"></i>{b.scheduledDate} a las {b.scheduledTime} ({b.durationMinutes} min)
                        </p>
                      </div>
                    </div>

                    <Link
                      to="/aula-virtual"
                      className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 shrink-0"
                    >
                      <i className="fa-solid fa-video text-rose-300"></i>
                      <span>Entrar</span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal to add slot */}
      {modalDay && (
        <AvailabilitySlotModal
          dayId={modalDay.id}
          dayName={modalDay.name}
          isOpen={isSlotModalOpen}
          onClose={() => {
            setIsSlotModalOpen(false);
            setModalDay(null);
          }}
          onSuccess={loadData}
        />
      )}
    </div>
  );
};
