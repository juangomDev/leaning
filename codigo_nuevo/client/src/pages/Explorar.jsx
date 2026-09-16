import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { tutorsService } from '../services/tutorsService';

export const Explorar = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchFilter, setSearchFilter] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('categoria') || '');
  const [selectedModality, setSelectedModality] = useState(searchParams.get('modalidad') || 'todas');
  const [maxPrice, setMaxPrice] = useState(60);
  const [minRating, setMinRating] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  useEffect(() => {
    tutorsService.getTutors().then((data) => {
      setTutors(data);
      setLoading(false);
    });
  }, []);

  // Filter logic
  const filteredTutors = tutors.filter((t) => {
    const q = searchFilter.toLowerCase();
    const matchesQuery =
      !q ||
      t.full_name?.toLowerCase().includes(q) ||
      t.name?.toLowerCase().includes(q) ||
      t.headline?.toLowerCase().includes(q) ||
      t.subject?.toLowerCase().includes(q) ||
      t.bio?.toLowerCase().includes(q);

    const matchesCategory =
      !selectedCategory ||
      (t.subject_category && t.subject_category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      (t.category && t.category.toLowerCase().includes(selectedCategory.toLowerCase())) ||
      (t.subject_name && t.subject_name.toLowerCase().includes(selectedCategory.toLowerCase()));

    const matchesModality =
      selectedModality === 'todas' ||
      t.modality === selectedModality ||
      (selectedModality === 'online' && t.modality === 'online') ||
      (selectedModality === 'presencial' && t.modality === 'presencial');

    const price = t.price_per_hour || t.hourly_rate || t.price || 25;
    const matchesPrice = price <= maxPrice;

    const rating = t.rating || 4.9;
    const matchesRating = !minRating || rating >= parseFloat(minRating);

    return matchesQuery && matchesCategory && matchesModality && matchesPrice && matchesRating;
  });

  // Sorting
  const sortedTutors = [...filteredTutors].sort((a, b) => {
    const priceA = a.price_per_hour || a.hourly_rate || a.price || 25;
    const priceB = b.price_per_hour || b.hourly_rate || b.price || 25;
    const ratingA = a.rating || 4.9;
    const ratingB = b.rating || 4.9;

    if (sortBy === 'price_asc') return priceA - priceB;
    if (sortBy === 'price_desc') return priceB - priceA;
    if (sortBy === 'rating') return ratingB - ratingA;
    return 0; // recommended
  });

  const handleClearFilters = () => {
    setSearchFilter('');
    setSelectedCategory('');
    setSelectedModality('todas');
    setMaxPrice(60);
    setMinRating('');
    setSortBy('recommended');
    setSearchParams({});
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Explorar Tutores</h1>
          <p className="text-slate-500 mt-1.5">
            Mostrando <span className="font-bold text-slate-700">{sortedTutors.length}</span> tutores disponibles
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ======= SIDEBAR FILTERS ======= */}
          <aside className="lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-7 sticky top-24">
              <div className="flex items-center justify-between">
                <h2 className="font-bold text-slate-900 text-base">Filtros</h2>
                <button
                  onClick={handleClearFilters}
                  className="text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors"
                >
                  Limpiar todo
                </button>
              </div>

              {/* Search */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-2">
                  Buscar
                </label>
                <div className="relative">
                  <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Ej. Álgebra, Python..."
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">
                  Materia
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="categoria"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="accent-brand-600"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-brand-600 transition-colors">
                      Todas las materias
                    </span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="categoria"
                      value="matematicas"
                      checked={selectedCategory === 'matematicas'}
                      onChange={() => setSelectedCategory('matematicas')}
                      className="accent-brand-600"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-brand-600 transition-colors">
                      Matemáticas
                    </span>
                    <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">320</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="categoria"
                      value="programacion"
                      checked={selectedCategory === 'programacion'}
                      onChange={() => setSelectedCategory('programacion')}
                      className="accent-brand-600"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-brand-600 transition-colors">
                      Programación
                    </span>
                    <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">210</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="categoria"
                      value="ingles"
                      checked={selectedCategory === 'ingles'}
                      onChange={() => setSelectedCategory('ingles')}
                      className="accent-brand-600"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-brand-600 transition-colors">
                      Idiomas
                    </span>
                    <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">450</span>
                  </label>
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <input
                      type="radio"
                      name="categoria"
                      value="ciencias"
                      checked={selectedCategory === 'ciencias'}
                      onChange={() => setSelectedCategory('ciencias')}
                      className="accent-brand-600"
                    />
                    <span className="text-sm text-slate-700 group-hover:text-brand-600 transition-colors">
                      Ciencias
                    </span>
                    <span className="ml-auto text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">180</span>
                  </label>
                </div>
              </div>

              {/* Modality */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">
                  Modalidad
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedModality('todas')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      selectedModality === 'todas'
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'border-slate-200 text-slate-600 hover:border-brand-400'
                    }`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setSelectedModality('online')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      selectedModality === 'online'
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'border-slate-200 text-slate-600 hover:border-brand-400'
                    }`}
                  >
                    <i className="fa-solid fa-laptop mr-1"></i>Online
                  </button>
                  <button
                    onClick={() => setSelectedModality('presencial')}
                    className={`flex-1 py-2 text-xs font-semibold rounded-lg border transition-all ${
                      selectedModality === 'presencial'
                        ? 'bg-brand-600 text-white border-brand-600'
                        : 'border-slate-200 text-slate-600 hover:border-brand-400'
                    }`}
                  >
                    <i className="fa-solid fa-location-dot mr-1"></i>Presencial
                  </button>
                </div>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">
                  Precio por hora — hasta <span className="text-brand-600">${maxPrice} USD</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={maxPrice}
                  step="5"
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  className="w-full accent-brand-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5">
                  <span>$10</span>
                  <span>$100</span>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase tracking-wide mb-3">
                  Calificación mínima
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value=""
                      checked={minRating === ''}
                      onChange={() => setMinRating('')}
                      className="accent-brand-600"
                    />
                    <span className="text-sm text-slate-700">Cualquier calificación</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value="4.5"
                      checked={minRating === '4.5'}
                      onChange={() => setMinRating('4.5')}
                      className="accent-brand-600"
                    />
                    <span className="flex text-amber-400 text-xs gap-0.5">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star-half-stroke"></i>
                    </span>
                    <span className="text-sm text-slate-700">4.5+</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      value="4"
                      checked={minRating === '4'}
                      onChange={() => setMinRating('4')}
                      className="accent-brand-600"
                    />
                    <span className="flex text-amber-400 text-xs gap-0.5">
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </span>
                    <span className="text-sm text-slate-700">4.0+</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* ======= MAIN CONTENT ======= */}
          <main className="flex-1 min-w-0">
            {/* Sort & View Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 bg-white px-5 py-3.5 rounded-2xl border border-slate-200/80 shadow-sm">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 -mx-1 px-1">
                <span className="text-xs font-semibold text-slate-500 shrink-0">Ordenar:</span>
                <button
                  onClick={() => setSortBy('recommended')}
                  className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    sortBy === 'recommended'
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Recomendados
                </button>
                <button
                  onClick={() => setSortBy('rating')}
                  className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    sortBy === 'rating'
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Mejor valorados
                </button>
                <button
                  onClick={() => setSortBy('price_asc')}
                  className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    sortBy === 'price_asc'
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Precio: menor a mayor
                </button>
                <button
                  onClick={() => setSortBy('price_desc')}
                  className={`shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                    sortBy === 'price_desc'
                      ? 'bg-brand-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Precio: mayor a menor
                </button>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                  aria-label="Vista cuadrícula"
                >
                  <i className="fa-solid fa-grip"></i>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list' ? 'bg-brand-600 text-white' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                  aria-label="Vista lista"
                >
                  <i className="fa-solid fa-list"></i>
                </button>
              </div>
            </div>

            {/* Tutor List / Grid */}
            {sortedTutors.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-16 text-center text-slate-400">
                <i className="fa-solid fa-magnifying-glass-slash text-4xl mb-3 block text-slate-300"></i>
                <p className="font-bold text-slate-700 text-base">No encontramos tutores con esos filtros</p>
                <p className="text-sm text-slate-500 mt-1">Prueba cambiando tu búsqueda o limpiando los filtros</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 bg-brand-50 text-brand-700 text-xs font-bold rounded-xl hover:bg-brand-100 transition-colors"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {sortedTutors.map((t) => (
                  <div
                    key={t.id}
                    className="tutor-card bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col"
                  >
                    <div className="p-5 flex-1">
                      <div className="flex items-start gap-3.5 mb-4">
                        <div className="relative shrink-0">
                          <img
                            src={t.avatar_url || t.avatar}
                            className="w-14 h-14 rounded-xl object-cover border-2 border-brand-100"
                            alt={t.full_name || t.name}
                          />
                          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 text-sm leading-tight truncate">
                            {t.full_name || t.name}
                          </h3>
                          <p className="text-xs font-semibold text-brand-600 mt-0.5 truncate">
                            {t.subject_name || t.headline || t.subject}
                          </p>
                          <div className="flex items-center gap-1 mt-1 text-xs">
                            <div className="flex text-amber-400 gap-0.5">
                              <i className="fa-solid fa-star"></i>
                              <i className="fa-solid fa-star"></i>
                              <i className="fa-solid fa-star"></i>
                              <i className="fa-solid fa-star"></i>
                              <i className="fa-solid fa-star-half-stroke"></i>
                            </div>
                            <span className="font-bold text-amber-500">{t.rating || 4.9}</span>
                            <span className="text-slate-400">({t.reviews_count || t.reviews || 50})</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-3">
                        {t.bio}
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-semibold rounded-md">
                          <i
                            className={`fa-solid ${
                              t.modality === 'online' ? 'fa-laptop' : 'fa-location-dot'
                            } text-brand-500 mr-1`}
                          ></i>
                          {t.modality === 'online' ? 'En Línea' : 'Presencial'}
                        </span>
                        <span className="px-2 py-0.5 bg-brand-50 text-brand-700 text-[10px] font-semibold rounded-md">
                          Verificado
                        </span>
                      </div>
                    </div>
                    <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400">Precio/hora</p>
                        <p className="font-extrabold text-slate-900 text-base">
                          ${t.price_per_hour || t.hourly_rate || t.price || 25}{' '}
                          <span className="text-xs font-normal text-slate-400">USD</span>
                        </p>
                      </div>
                      <Link
                        to={`/tutores/${t.id}`}
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
                      >
                        Ver Perfil
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List Mode */
              <div className="space-y-4">
                {sortedTutors.map((t) => (
                  <div
                    key={t.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col sm:flex-row items-center justify-between gap-5 hover:border-brand-300 shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                      <img
                        src={t.avatar_url || t.avatar}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-100 shrink-0"
                        alt={t.full_name || t.name}
                      />
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-base">{t.full_name || t.name}</h3>
                        <p className="text-xs font-semibold text-brand-600">{t.subject_name || t.headline || t.subject}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-1">{t.bio}</p>
                      </div>
                    </div>
                    <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div>
                        <span className="text-xl font-extrabold text-slate-900">${t.price_per_hour || t.hourly_rate || t.price || 25}</span>
                        <span className="text-xs text-slate-400"> / hr</span>
                      </div>
                      <Link
                        to={`/tutores/${t.id}`}
                        className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
                      >
                        Ver Perfil
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
