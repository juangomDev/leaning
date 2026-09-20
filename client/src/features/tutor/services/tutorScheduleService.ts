export interface TimeSlot {
  id: string;
  startTime: string; // "09:00"
  endTime: string;   // "11:00"
  enabled: boolean;
}

export interface DaySchedule {
  dayId: number; // 1 = Lunes, ..., 7 = Domingo
  dayName: string;
  active: boolean;
  slots: TimeSlot[];
}

const DEFAULT_SCHEDULE: DaySchedule[] = [
  {
    dayId: 1,
    dayName: 'Lunes',
    active: true,
    slots: [
      { id: 's1_1', startTime: '09:00', endTime: '12:00', enabled: true },
      { id: 's1_2', startTime: '15:00', endTime: '19:00', enabled: true },
    ],
  },
  {
    dayId: 2,
    dayName: 'Martes',
    active: true,
    slots: [
      { id: 's2_1', startTime: '09:00', endTime: '12:00', enabled: true },
      { id: 's2_2', startTime: '16:00', endTime: '20:00', enabled: true },
    ],
  },
  {
    dayId: 3,
    dayName: 'Miércoles',
    active: true,
    slots: [
      { id: 's3_1', startTime: '10:00', endTime: '14:00', enabled: true },
      { id: 's3_2', startTime: '15:00', endTime: '18:00', enabled: true },
    ],
  },
  {
    dayId: 4,
    dayName: 'Jueves',
    active: true,
    slots: [
      { id: 's4_1', startTime: '09:00', endTime: '12:00', enabled: true },
      { id: 's4_2', startTime: '16:00', endTime: '20:00', enabled: true },
    ],
  },
  {
    dayId: 5,
    dayName: 'Viernes',
    active: true,
    slots: [
      { id: 's5_1', startTime: '09:00', endTime: '13:00', enabled: true },
      { id: 's5_2', startTime: '14:00', endTime: '18:00', enabled: true },
    ],
  },
  {
    dayId: 6,
    dayName: 'Sábado',
    active: true,
    slots: [
      { id: 's6_1', startTime: '10:00', endTime: '14:00', enabled: true },
    ],
  },
  {
    dayId: 7,
    dayName: 'Domingo',
    active: false,
    slots: [
      { id: 's7_1', startTime: '10:00', endTime: '13:00', enabled: false },
    ],
  },
];

export const tutorScheduleService = {
  async getWeeklySchedule(): Promise<DaySchedule[]> {
    const saved = localStorage.getItem('educonnect_tutor_schedule');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    localStorage.setItem('educonnect_tutor_schedule', JSON.stringify(DEFAULT_SCHEDULE));
    return DEFAULT_SCHEDULE;
  },

  async toggleDayActive(dayId: number): Promise<DaySchedule[]> {
    const schedule = await this.getWeeklySchedule();
    const updated = schedule.map(d => d.dayId === dayId ? { ...d, active: !d.active } : d);
    localStorage.setItem('educonnect_tutor_schedule', JSON.stringify(updated));
    return updated;
  },

  async toggleSlot(dayId: number, slotId: string): Promise<DaySchedule[]> {
    const schedule = await this.getWeeklySchedule();
    const updated = schedule.map(d => {
      if (d.dayId === dayId) {
        return {
          ...d,
          slots: d.slots.map(s => s.id === slotId ? { ...s, enabled: !s.enabled } : s),
        };
      }
      return d;
    });
    localStorage.setItem('educonnect_tutor_schedule', JSON.stringify(updated));
    return updated;
  },

  async addSlot(dayId: number, startTime: string, endTime: string): Promise<DaySchedule[]> {
    const schedule = await this.getWeeklySchedule();
    const updated = schedule.map(d => {
      if (d.dayId === dayId) {
        const newSlot: TimeSlot = {
          id: `s_${dayId}_${Date.now()}`,
          startTime,
          endTime,
          enabled: true,
        };
        return {
          ...d,
          active: true,
          slots: [...d.slots, newSlot],
        };
      }
      return d;
    });
    localStorage.setItem('educonnect_tutor_schedule', JSON.stringify(updated));
    return updated;
  },

  async deleteSlot(dayId: number, slotId: string): Promise<DaySchedule[]> {
    const schedule = await this.getWeeklySchedule();
    const updated = schedule.map(d => {
      if (d.dayId === dayId) {
        return {
          ...d,
          slots: d.slots.filter(s => s.id !== slotId),
        };
      }
      return d;
    });
    localStorage.setItem('educonnect_tutor_schedule', JSON.stringify(updated));
    return updated;
  },
};
