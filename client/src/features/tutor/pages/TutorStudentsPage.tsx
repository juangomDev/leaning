import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface StudentItem {
  id: string;
  name: string;
  avatar: string;
  email: string;
  subject: string;
  totalClasses: number;
  totalHours: number;
  lastClassDate: string;
  academicLevel: string;
}

const DEFAULT_STUDENTS: StudentItem[] = [
  {
    id: 'stu_101',
    name: 'Mateo González',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    email: 'mateo.gonzalez@example.com',
    subject: 'Cálculo Diferencial',
    totalClasses: 6,
    totalHours: 7.5,
    lastClassDate: '2026-09-18',
    academicLevel: 'Pregrado Universitario',
  },
  {
    id: 'stu_102',
    name: 'Valeria Mendoza',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    email: 'valeria.m@example.com',
    subject: 'Física Cuántica',
    totalClasses: 3,
    totalHours: 4.5,
    lastClassDate: '2026-09-12',
    academicLevel: 'Bachillerato',
  },
  {
    id: 'stu_103',
    name: 'Camila Rodriguez',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    email: 'camila.r@example.com',
    subject: 'Álgebra Lineal',
    totalClasses: 4,
    totalHours: 5.0,
    lastClassDate: '2026-09-15',
    academicLevel: 'Pregrado Universitario',
  },
];

export const TutorStudentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [students] = useState<StudentItem[]>(DEFAULT_STUDENTS);

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Directorio de Alumnos</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Consulta el historial formativo y seguimiento pedagógico de tus estudiantes
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="relative">
          <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar alumno por nombre o materia..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500"
          />
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((stu) => (
          <div
            key={stu.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-xs hover:border-purple-200 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                <img
                  src={stu.avatar}
                  alt={stu.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <h3 className="text-sm font-black text-slate-900">{stu.name}</h3>
                  <p className="text-[11px] text-slate-400">{stu.email}</p>
                  <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px]">
                    {stu.subject}
                  </span>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Clases Tomadas</span>
                  <span className="font-bold text-slate-800">{stu.totalClasses} ({stu.totalHours}h)</span>
                </div>
                <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">Última Clase</span>
                  <span className="font-bold text-slate-800">{stu.lastClassDate}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex gap-2">
              <Link
                to={`/tutor/students/${stu.id}`}
                className="w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs text-center transition-colors border border-purple-200/60 flex items-center justify-center gap-1.5"
              >
                <i className="fa-solid fa-clipboard-user text-xs"></i>
                <span>Ver Ficha y Notas</span>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
