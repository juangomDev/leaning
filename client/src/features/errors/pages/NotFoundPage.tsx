import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Compass, 
  Search, 
  ArrowLeft, 
  Home, 
  BookOpen, 
  HelpCircle, 
  Sparkles 
} from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/tutors?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="error-page-wrapper">
      <div className="error-bg-glow error-bg-glow-blue" />
      <div className="error-bg-glow error-bg-glow-rose" />

      <div className="error-card">
        {/* Badge */}
        <div className="error-code-badge error-badge-404">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>Error 404 • Recurso no encontrado</span>
        </div>

        {/* Floating Icon */}
        <div className="error-icon-box bg-blue-50 text-blue-600 border border-blue-200">
          <Compass className="w-10 h-10 stroke-[1.75]" />
        </div>

        {/* Hero Code & Title */}
        <h1 className="error-code-number">404</h1>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mb-2">
          ¿Te has desorientado en el campus?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-md mx-auto leading-relaxed mb-6">
          La ruta a la que intentas acceder no existe, ha cambiado de nombre o fue movida durante la última actualización del sistema.
        </p>

        {/* Quick Search */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto mb-6">
          <div className="relative flex items-center">
            <Search className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
            <input
              type="text"
              placeholder="Buscar materia, profesor o tema de clase..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-24 py-2.5 rounded-2xl border border-slate-200 bg-white text-xs font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 shadow-xs"
            />
            <button
              type="submit"
              className="absolute right-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors"
            >
              Buscar
            </button>
          </div>
        </form>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>Volver a Inicio</span>
          </Link>
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Página Anterior</span>
          </button>
        </div>

        {/* Suggested Links */}
        <div className="error-suggested-links">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 w-full mb-1">
            Accesos Rápidos Recomendados
          </span>
          <Link to="/tutors" className="error-suggested-link">
            Explorar Tutores
          </Link>
          <Link to="/subjects" className="error-suggested-link">
            <BookOpen className="w-3 h-3 inline mr-1" />
            Catálogo de Materias
          </Link>
          <Link to="/pricing" className="error-suggested-link">
            Precios y Tarifas
          </Link>
          <Link to="/help" className="error-suggested-link">
            <HelpCircle className="w-3 h-3 inline mr-1" />
            Centro de Ayuda
          </Link>
        </div>
      </div>
    </div>
  );
};
