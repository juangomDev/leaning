import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

interface StudentHistoryRecord {
  id: string;
  date: string;
  time: string;
  duration: number;
  subject: string;
  status: string;
}

export const TutorStudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [notes, setNotes] = useState('');
  const [savedMsg, setSavedMsg] = useState(false);

  // Student mock data
  const student = {
    id: id || 'stu_101',
    name: 'Mateo González',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    email: 'mateo.gonzalez@example.com',
    academicLevel: 'Pregrado Universitario - 3er Semestre',
    phone: '+57 312 456 7890',
    history: [
      { id: 'h1', date: '2026-09-18', time: '16:00', duration: 60, subject: 'Cálculo III: Integrales triples', status: 'Completada' },
      { id: 'h2', date: '2026-09-11', time: '16:00', duration: 90, subject: 'Cálculo III: Derivadas parciales', status: 'Completada' },
      { id: 'h3', date: '2026-09-04', time: '17:00', duration: 60, subject: 'Cálculo II: Sólidos de revolución', status: 'Completada' },
    ] as StudentHistoryRecord[],
  };

  useEffect(() => {
    const saved = localStorage.getItem(`tutor_student_notes_${student.id}`);
    if (saved) {
      setNotes(saved);
    } else {
      setNotes('El alumno presenta excelente base en derivadas, pero requiere reforzar el cambio de variables a coordenadas cilíndricas y esféricas para el examen final.');
    }
  }, [student.id]);

  const handleSaveNotes = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem(`tutor_student_notes_${student.id}`, notes);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          to="/tutor/students"
          className="text-xs text-purple-700 font-bold hover:underline inline-flex items-center gap-1.5 mb-2"
        >
          <i className="fa-solid fa-arrow-left"></i> Volver a Mis Alumnos
        </Link>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Ficha de Seguimiento del Alumno</h1>
      </div>

      {/* Student Profile Overview Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-purple-200"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-black text-slate-900">{student.name}</h2>
              <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px]">
                Alumno Activo
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{student.email} • {student.phone}</p>
            <p className="text-xs text-purple-700 font-semibold mt-1">
              <i className="fa-solid fa-graduation-cap mr-1"></i> {student.academicLevel}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-right sm:border-l border-slate-100 sm:pl-5">
          <div>
            <span className="text-2xl font-black text-slate-900">{student.history.length}</span>
            <span className="text-xs text-slate-400 block font-semibold">Clases tomadas</span>
          </div>
        </div>
      </div>

      {/* Teacher's Private Pedagogical Notes */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-lock text-purple-600"></i>
            <h3 className="text-sm font-black text-slate-900">Bloc de Notas Privadas del Tutor</h3>
          </div>
          {savedMsg && (
            <span className="text-xs font-bold text-emerald-600 animate-fadeIn">
              <i className="fa-solid fa-check mr-1"></i> Guardado
            </span>
          )}
        </div>
        <p className="text-xs text-slate-500">
          Estas anotaciones son 100% privadas y solo tú puedes verlas. Úsalas para planificar la siguiente sesión.
        </p>

        <form onSubmit={handleSaveNotes} className="space-y-3">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 leading-relaxed"
            placeholder="Apunta fortalezas, debilidades y tareas asignadas a este estudiante..."
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-xs"
            >
              Guardar Notas Pedagógicas
            </button>
          </div>
        </form>
      </div>

      {/* Class History Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="text-sm font-black text-slate-900">Historial de Clases con este Alumno</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {student.history.map((h) => (
            <div key={h.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/60 transition-colors">
              <div>
                <p className="font-bold text-slate-800">{h.subject}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  <i className="fa-regular fa-calendar mr-1"></i>{h.date} a las {h.time} ({h.duration} min)
                </p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                {h.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
