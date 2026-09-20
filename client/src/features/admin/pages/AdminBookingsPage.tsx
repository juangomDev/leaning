import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  adminOperationsService, 
  AdminBooking 
} from '../services/adminOperationsService';
import { DisputeModal } from '../components/DisputeModal';
import { 
  Search, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Eye, 
  RotateCcw, 
  DollarSign, 
  Layers 
} from 'lucide-react';

export const AdminBookingsPage: React.FC = () => {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDisputeBooking, setSelectedDisputeBooking] = useState<AdminBooking | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await adminOperationsService.getBookings();
      setBookings(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const filtered = bookings.filter(b => {
    const matchesSearch = 
      b.studentName.toLowerCase().includes(search.toLowerCase()) ||
      b.tutorName.toLowerCase().includes(search.toLowerCase()) ||
      b.subjectName.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;

    return true;
  });

  const disputedCount = bookings.filter(b => b.status === 'DISPUTED').length;
  const completedCount = bookings.filter(b => b.status === 'COMPLETED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Supervisión Global de Reservas
          </h1>
          <p className="text-sm text-slate-500 font-medium">
            Control de clases programadas, auditoría de asistencia y resolución de disputas.
          </p>
        </div>
        <button
          onClick={fetchBookings}
          className="btn btn-secondary inline-flex items-center gap-2 self-start md:self-auto text-xs"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Reservas</span>
            <p className="text-2xl font-black text-slate-900 mt-1">{bookings.length}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center font-bold">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">En Disputa</span>
            <p className="text-2xl font-black text-rose-600 mt-1">{disputedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Completadas</span>
            <p className="text-2xl font-black text-blue-600 mt-1">{completedCount}</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="admin-kpi-card flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Volumen Transado</span>
            <p className="text-2xl font-black text-emerald-600 mt-1">
              ${bookings.reduce((acc, b) => acc + (b.totalPrice || b.grossAmount || 0), 0).toFixed(2)}
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
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
            placeholder="Buscar por ID, nombre de estudiante, tutor o materia..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input pl-10 text-xs w-full bg-slate-50 border-slate-200 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500">Estado:</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input text-xs py-1.5 px-3 bg-white border-slate-200 font-semibold text-slate-700"
          >
            <option value="all">Todos los Estados</option>
            <option value="PENDING">Pendientes</option>
            <option value="CONFIRMED">Confirmadas</option>
            <option value="COMPLETED">Completadas</option>
            <option value="CANCELLED">Canceladas</option>
            <option value="DISPUTED">En Disputa ⚠️</option>
          </select>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="admin-table-container">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-blue-600 border-t-transparent mb-4"></div>
            <p className="text-xs font-semibold">Cargando bitácora de reservas...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Calendar className="w-12 h-12 mx-auto text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-700">No se encontraron reservas</p>
            <p className="text-xs text-slate-400 mt-1">Prueba seleccionando otro filtro de estado o limpiando el buscador.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th className="admin-table-th">ID Reserva</th>
                  <th className="admin-table-th">Estudiante</th>
                  <th className="admin-table-th">Tutor</th>
                  <th className="admin-table-th">Materia & Fecha</th>
                  <th className="admin-table-th">Monto</th>
                  <th className="admin-table-th">Estado</th>
                  <th className="admin-table-th text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => {
                  const price = b.totalPrice || b.grossAmount || 0;
                  const dateStr = b.scheduledDate || (b.startTime ? b.startTime.split('T')[0] : '2026-09-22');
                  const timeStr = b.scheduledTime || (b.startTime ? b.startTime.split('T')[1]?.substring(0, 5) : '16:00');

                  return (
                    <tr key={b.id} className="transition-colors hover:bg-slate-50/80">
                      <td className="admin-table-td font-mono font-bold text-slate-600 text-xs">
                        #{b.id.substring(0, 8)}
                      </td>

                      <td className="admin-table-td font-semibold text-slate-900">
                        {b.studentName}
                      </td>

                      <td className="admin-table-td text-slate-700 font-medium">
                        {b.tutorName}
                      </td>

                      <td className="admin-table-td">
                        <span className="font-bold text-slate-800 block text-xs">{b.subjectName}</span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {dateStr} {timeStr}
                        </span>
                      </td>

                      <td className="admin-table-td">
                        <span className="font-bold text-slate-900 font-mono text-sm">${price.toFixed(2)}</span>
                      </td>

                      <td className="admin-table-td">
                        {b.status === 'CONFIRMED' && (
                          <span className="admin-badge admin-badge-active">Confirmada</span>
                        )}
                        {b.status === 'COMPLETED' && (
                          <span className="admin-badge admin-badge-completed">Completada</span>
                        )}
                        {b.status === 'PENDING' && (
                          <span className="admin-badge admin-badge-pending">Pendiente</span>
                        )}
                        {b.status === 'CANCELLED' && (
                          <span className="admin-badge admin-badge-banned">Cancelada</span>
                        )}
                        {b.status === 'DISPUTED' && (
                          <span className="admin-badge admin-badge-disputed animate-pulse">
                            <AlertCircle className="w-3 h-3" /> Disputa Abierta
                          </span>
                        )}
                      </td>

                      <td className="admin-table-td text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            to={`/admin/bookings/${b.id}`}
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                            title="Ver Ficha y Resolución Arbitral"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          {b.status === 'DISPUTED' && (
                            <button
                              onClick={() => setSelectedDisputeBooking(b)}
                              className="btn btn-secondary text-rose-600 hover:bg-rose-50 text-[11px] font-bold py-1 px-2"
                            >
                              Resolver
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dispute Modal */}
      {selectedDisputeBooking && (
        <DisputeModal
          isOpen={true}
          onClose={() => setSelectedDisputeBooking(null)}
          bookingId={selectedDisputeBooking.id}
          studentName={selectedDisputeBooking.studentName}
          tutorName={selectedDisputeBooking.tutorName}
          totalPrice={selectedDisputeBooking.totalPrice || selectedDisputeBooking.grossAmount || 0}
          disputeReason={selectedDisputeBooking.disputeReason}
          onResolved={() => {
            setSelectedDisputeBooking(null);
            fetchBookings();
          }}
        />
      )}
    </div>
  );
};
