import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService, AdminStudent } from '../services/adminService';
import { 
  Search, 
  BookOpen, 
  DollarSign, 
  Eye, 
  User, 
  RotateCcw
} from 'lucide-react';

export const AdminStudentsPage: React.FC = () => {
  const [students, setStudents] = useState<AdminStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await adminService.getStudents();
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filtered = students.filter(s => {
    const studentName = s.user?.name || s.name;
    const studentEmail = s.user?.email || s.email;
    const level = s.gradeLevel || s.academicLevel || '';

    return (
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      studentEmail.toLowerCase().includes(search.toLowerCase()) ||
      level.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Directorio de Estudiantes
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Listado exhaustivo de alumnos registrados, nivel académico y volumen de reservas.
          </p>
        </div>
        <button
          onClick={fetchStudents}
          className="btn btn-secondary inline-flex items-center gap-2 self-start md:self-auto text-xs"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Estudiantes</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{students.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <User className="w-5 h-5" />
          </div>
        </div>
        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Clases Reservadas</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              {students.reduce((acc, s) => acc + (s.totalBookings || 0), 0)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>
        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Saldo en Custodia</span>
            <p className="text-2xl font-black text-purple-600 mt-1">
              ${students.reduce((acc, s) => acc + (s.walletBalance || 0), 0).toFixed(2)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nombre de alumno, email o grado educativo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 text-xs w-full bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-xs font-semibold">Cargando directorio de estudiantes...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <User className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-700">No se encontraron estudiantes</p>
            <p className="text-xs text-slate-400 mt-1">No hay alumnos que coincidan con la búsqueda actual.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-table-th">Estudiante</th>
                  <th className="admin-table-th">Nivel Académico</th>
                  <th className="admin-table-th">Intereses Principales</th>
                  <th className="admin-table-th">Clases Tomadas</th>
                  <th className="admin-table-th">Saldo Monedero</th>
                  <th className="admin-table-th">Fecha Alta</th>
                  <th className="admin-table-th text-right">Ficha</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const name = s.user?.name || s.name;
                  const email = s.user?.email || s.email;
                  const avatar = s.user?.avatarUrl || s.avatar;
                  const level = s.gradeLevel || s.academicLevel || 'No especificado';
                  const interests = s.interests || s.learningGoals || [];
                  const date = s.createdAt || s.joinedDate || '2026-02-01';

                  return (
                    <tr key={s.id} className="transition-colors hover:bg-slate-50/80">
                      <td className="admin-table-td">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs border border-slate-200 overflow-hidden">
                            {avatar ? (
                              <img src={avatar} alt={name} className="w-full h-full object-cover" />
                            ) : (
                              name.charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900 text-sm">{name}</div>
                            <div className="text-slate-400 text-xs font-mono">{email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="admin-table-td">
                        <span className="font-semibold text-slate-700">{level}</span>
                      </td>

                      <td className="admin-table-td">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {interests.length > 0 ? (
                            interests.slice(0, 3).map((item: string, i: number) => (
                              <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-medium">
                                {item}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-400 text-xs italic">Sin preferencias</span>
                          )}
                          {interests.length > 3 && (
                            <span className="text-[10px] text-slate-400">+{interests.length - 3}</span>
                          )}
                        </div>
                      </td>

                      <td className="admin-table-td">
                        <span className="font-bold text-slate-900 font-mono text-xs">{s.totalBookings || 0}</span>
                      </td>

                      <td className="admin-table-td">
                        <span className="font-bold text-slate-900 font-mono text-xs">
                          ${(s.walletBalance || 0).toFixed(2)} USD
                        </span>
                      </td>

                      <td className="admin-table-td">
                        <span className="text-slate-500 text-xs font-mono">
                          {date}
                        </span>
                      </td>

                      <td className="admin-table-td text-right">
                        <Link
                          to={`/admin/users/${s.userId}`}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors inline-block"
                          title="Ver Perfil Global de Usuario"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
