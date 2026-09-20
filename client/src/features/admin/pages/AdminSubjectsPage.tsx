import React, { useState, useEffect } from 'react';
import { 
  adminOperationsService, 
  AdminSubject 
} from '../services/adminOperationsService';
import { SubjectFormModal } from '../components/SubjectFormModal';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  RotateCcw, 
  AlertCircle 
} from 'lucide-react';

export const AdminSubjectsPage: React.FC = () => {
  const [subjects, setSubjects] = useState<AdminSubject[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<AdminSubject | null>(null);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const data = await adminOperationsService.getSubjects();
      setSubjects(data);
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error al cargar las materias'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const categories = Array.from(new Set(subjects.map(s => s.category).filter(Boolean)));

  const filtered = subjects.filter(s => {
    const matchesSearch = 
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(search.toLowerCase())) ||
      (s.category && s.category.toLowerCase().includes(search.toLowerCase()));

    if (!matchesSearch) return false;
    if (categoryFilter !== 'all' && s.category !== categoryFilter) return false;

    return true;
  });

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar permanentemente la materia "${name}"?`)) {
      return;
    }
    try {
      await adminOperationsService.deleteSubject(id);
      setNotification({
        type: 'success',
        message: `Materia "${name}" eliminada correctamente.`
      });
      fetchSubjects();
    } catch (err: any) {
      setNotification({
        type: 'error',
        message: err.message || 'Error al eliminar la materia'
      });
    }
  };

  const handleOpenCreate = () => {
    setSubjectToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (subject: AdminSubject) => {
    setSubjectToEdit(subject);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Catálogo General de Materias
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Administra las áreas del conocimiento, categorías y competencias disponibles en EduConnect.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="btn btn-primary inline-flex items-center gap-2 text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            Nueva Materia
          </button>
          <button
            onClick={fetchSubjects}
            className="btn btn-secondary inline-flex items-center gap-2 text-xs"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div 
          className={`p-4 rounded-xl border flex items-center justify-between text-xs font-semibold ${
            notification.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            <span>{notification.message}</span>
          </div>
          <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-700">✕</button>
        </div>
      )}

      {/* Quick KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Materias</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{subjects.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <BookOpen className="w-5 h-5" />
          </div>
        </div>

        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Categorías Activas</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">{categories.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">Total Docentes Adscritos</span>
            <p className="text-2xl font-black text-purple-600 mt-1">
              {subjects.reduce((acc, s) => acc + (s.activeTutorsCount || s.totalTutors || 0), 0)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-filter-bar">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar por nombre de materia, código o descripción..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 text-xs w-full bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Categoría:</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="input text-xs py-1.5 px-3 bg-white border-slate-200 font-semibold text-slate-700"
          >
            <option value="all">Todas las Categorías</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-xs font-semibold">Cargando catálogo curricular...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <BookOpen className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-700">No se encontraron materias</p>
            <p className="text-xs text-slate-400 mt-1">Prueba agregando una nueva disciplina o modificando los filtros.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-table-th">Materia</th>
                  <th className="admin-table-th">Categoría</th>
                  <th className="admin-table-th">Descripción Curricular</th>
                  <th className="admin-table-th">Tutores Disponibles</th>
                  <th className="admin-table-th text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="transition-colors hover:bg-slate-50/80">
                    <td className="admin-table-td">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500 inline-block"></span>
                        {s.name}
                      </div>
                    </td>

                    <td className="admin-table-td">
                      <span className="admin-badge admin-badge-info">
                        {s.category || 'General'}
                      </span>
                    </td>

                    <td className="admin-table-td max-w-sm">
                      <p className="text-xs text-slate-600 line-clamp-2">
                        {s.description || 'Sin descripción curricular proporcionada.'}
                      </p>
                    </td>

                    <td className="admin-table-td">
                      <span className="font-mono font-bold text-slate-800 text-xs">
                        {s.activeTutorsCount || s.totalTutors || 0} tutores
                      </span>
                    </td>

                    <td className="admin-table-td text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(s)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar Materia"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.id, s.name)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Eliminar Materia"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Subject Form Modal */}
      <SubjectFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSubjectToEdit(null);
        }}
        subject={subjectToEdit}
        onSaved={() => {
          setIsModalOpen(false);
          setSubjectToEdit(null);
          setNotification({
            type: 'success',
            message: subjectToEdit ? 'Materia actualizada exitosamente' : 'Materia creada satisfactoriamente'
          });
          fetchSubjects();
        }}
      />
    </div>
  );
};
