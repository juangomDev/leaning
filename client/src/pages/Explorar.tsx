import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { tutorsService } from '../services/tutorsService';
import { Tutor } from '../types';

export const Explorar: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [_loading, setLoading] = useState<boolean>(true);

  // Filter States
  const [searchFilter, setSearchFilter] = useState<string>(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.get('categoria') || '');
  const [selectedModality, setSelectedModality] = useState<string>(searchParams.get('modalidad') || 'todas');
  const [maxPrice, setMaxPrice] = useState<number>(60);
  const [minRating, setMinRating] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    tutorsService.getTutors().then((data) => {
      setTutors(data);
      setLoading(false);
    });
  }, []);

  // Filter logic
  const filteredTutors = tutors.filter((t: any) => {
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
  const sortedTutors = [...filteredTutors].sort((a: any, b: any) => {
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
    <div className="catalog-page">
      <div className="catalog-container">
        {/* Page Header */}
        <div className="catalog-header">
          <h1 className="catalog-title">Explorar Tutores</h1>
          <p className="catalog-subtitle">
            Mostrando <span className="catalog-count-highlight">{sortedTutors.length}</span> tutores disponibles
          </p>
        </div>

        <div className="catalog-layout">
          {/* ======= SIDEBAR FILTERS ======= */}
          <aside className="catalog-sidebar">
            <div className="catalog-filters-card">
              <div className="filters-header">
                <h2 className="filters-title">Filtros</h2>
                <button
                  onClick={handleClearFilters}
                  className="filters-clear-btn"
                >
                  Limpiar todo
                </button>
              </div>

              {/* Search */}
              <div className="filter-group">
                <label className="filter-label">
                  Buscar
                </label>
                <div className="filter-search-box">
                  <i className="fa-solid fa-magnifying-glass filter-search-icon"></i>
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Ej. Álgebra, Python..."
                    className="filter-search-input"
                  />
                </div>
              </div>

              {/* Category */}
              <div className="filter-group">
                <label className="filter-label">
                  Materia
                </label>
                <div className="filter-options-list">
                  <label className="filter-radio-item">
                    <input
                      type="radio"
                      name="categoria"
                      value=""
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      style={{ accentColor: 'var(--color-brand-600)' }}
                    />
                    <span>Todas las materias</span>
                  </label>
                  <label className="filter-radio-item">
                    <input
                      type="radio"
                      name="categoria"
                      value="matematicas"
                      checked={selectedCategory === 'matematicas'}
                      onChange={() => setSelectedCategory('matematicas')}
                      style={{ accentColor: 'var(--color-brand-600)' }}
                    />
                    <span>Matemáticas</span>
                    <span className="filter-radio-count">320</span>
                  </label>
                  <label className="filter-radio-item">
                    <input
                      type="radio"
                      name="categoria"
                      value="programacion"
                      checked={selectedCategory === 'programacion'}
                      onChange={() => setSelectedCategory('programacion')}
                      style={{ accentColor: 'var(--color-brand-600)' }}
                    />
                    <span>Programación</span>
                    <span className="filter-radio-count">210</span>
                  </label>
                  <label className="filter-radio-item">
                    <input
                      type="radio"
                      name="categoria"
                      value="ingles"
                      checked={selectedCategory === 'ingles'}
                      onChange={() => setSelectedCategory('ingles')}
                      style={{ accentColor: 'var(--color-brand-600)' }}
                    />
                    <span>Idiomas</span>
                    <span className="filter-radio-count">450</span>
                  </label>
                  <label className="filter-radio-item">
                    <input
                      type="radio"
                      name="categoria"
                      value="ciencias"
                      checked={selectedCategory === 'ciencias'}
                      onChange={() => setSelectedCategory('ciencias')}
                      style={{ accentColor: 'var(--color-brand-600)' }}
                    />
                    <span>Ciencias</span>
                    <span className="filter-radio-count">180</span>
                  </label>
                </div>
              </div>

              {/* Modality */}
              <div className="filter-group">
                <label className="filter-label">
                  Modalidad
                </label>
                <div className="filter-modality-tabs">
                  <button
                    onClick={() => setSelectedModality('todas')}
                    className={`filter-modality-btn ${selectedModality === 'todas' ? 'active' : ''}`}
                  >
                    Todas
                  </button>
                  <button
                    onClick={() => setSelectedModality('online')}
                    className={`filter-modality-btn ${selectedModality === 'online' ? 'active' : ''}`}
                  >
                    <i className="fa-solid fa-laptop"></i>Online
                  </button>
                  <button
                    onClick={() => setSelectedModality('presencial')}
                    className={`filter-modality-btn ${selectedModality === 'presencial' ? 'active' : ''}`}
                  >
                    <i className="fa-solid fa-location-dot"></i>Presencial
                  </button>
                </div>
              </div>

              {/* Price Range */}
              <div className="filter-group">
                <label className="filter-label">
                  Precio por hora — hasta <span style={{ color: 'var(--color-brand-600)' }}>${maxPrice} USD</span>
                </label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={maxPrice}
                  step="5"
                  onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-brand-600)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-slate-400)', marginTop: '0.375rem' }}>
                  <span>$10</span>
                  <span>$100</span>
                </div>
              </div>

              {/* Rating */}
              <div className="filter-group">
                <label className="filter-label">
                  Calificación mínima
                </label>
                <div className="filter-options-list">
                  <label className="filter-radio-item">
                    <input
                      type="radio"
                      name="rating"
                      value=""
                      checked={minRating === ''}
                      onChange={() => setMinRating('')}
                      style={{ accentColor: 'var(--color-brand-600)' }}
                    />
                    <span>Cualquier calificación</span>
                  </label>
                  <label className="filter-radio-item">
                    <input
                      type="radio"
                      name="rating"
                      value="4.5"
                      checked={minRating === '4.5'}
                      onChange={() => setMinRating('4.5')}
                      style={{ accentColor: 'var(--color-brand-600)' }}
                    />
                    <span style={{ display: 'flex', color: '#fbbf24', fontSize: '0.75rem', gap: '2px' }}>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star-half-stroke"></i>
                    </span>
                    <span>4.5+</span>
                  </label>
                  <label className="filter-radio-item">
                    <input
                      type="radio"
                      name="rating"
                      value="4"
                      checked={minRating === '4'}
                      onChange={() => setMinRating('4')}
                      style={{ accentColor: 'var(--color-brand-600)' }}
                    />
                    <span style={{ display: 'flex', color: '#fbbf24', fontSize: '0.75rem', gap: '2px' }}>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                      <i className="fa-solid fa-star"></i>
                    </span>
                    <span>4.0+</span>
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* ======= MAIN CONTENT ======= */}
          <main className="catalog-main">
            {/* Sort & View Bar */}
            <div className="catalog-toolbar">
              <div className="catalog-sort-group">
                <span className="sort-label">Ordenar:</span>
                <button
                  onClick={() => setSortBy('recommended')}
                  className={`sort-btn ${sortBy === 'recommended' ? 'active' : ''}`}
                >
                  Recomendados
                </button>
                <button
                  onClick={() => setSortBy('rating')}
                  className={`sort-btn ${sortBy === 'rating' ? 'active' : ''}`}
                >
                  Mejor valorados
                </button>
                <button
                  onClick={() => setSortBy('price_asc')}
                  className={`sort-btn ${sortBy === 'price_asc' ? 'active' : ''}`}
                >
                  Precio: menor a mayor
                </button>
                <button
                  onClick={() => setSortBy('price_desc')}
                  className={`sort-btn ${sortBy === 'price_desc' ? 'active' : ''}`}
                >
                  Precio: mayor a menor
                </button>
              </div>
              <div className="catalog-view-group">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  aria-label="Vista cuadrícula"
                >
                  <i className="fa-solid fa-grip"></i>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  aria-label="Vista lista"
                >
                  <i className="fa-solid fa-list"></i>
                </button>
              </div>
            </div>

            {/* Tutor List / Grid */}
            {sortedTutors.length === 0 ? (
              <div className="catalog-empty-state">
                <i className="fa-solid fa-magnifying-glass-slash empty-state-icon"></i>
                <p className="empty-state-title">No encontramos tutores con esos filtros</p>
                <p className="empty-state-subtitle">Prueba cambiando tu búsqueda o limpiando los filtros</p>
                <button
                  onClick={handleClearFilters}
                  className="empty-state-btn"
                >
                  Restablecer filtros
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="catalog-tutor-grid">
                {sortedTutors.map((t) => (
                  <div
                    key={t.id}
                    className="tutor-catalog-card"
                  >
                    <div className="tutor-catalog-body">
                      <div className="tutor-catalog-header">
                        <div className="tutor-avatar-container">
                          <img
                            src={t.avatar_url || t.avatar}
                            className="tutor-avatar-img"
                            alt={t.full_name || t.name}
                          />
                          <span className="tutor-status-badge"></span>
                        </div>
                        <div className="tutor-header-details">
                          <h3 className="tutor-card-name">
                            {t.full_name || t.name}
                          </h3>
                          <p className="tutor-card-subject">
                            {t.subject_name || t.headline || t.subject}
                          </p>
                          <div className="tutor-card-rating">
                            <div className="tutor-star-icons">
                              <i className="fa-solid fa-star"></i>
                              <i className="fa-solid fa-star"></i>
                              <i className="fa-solid fa-star"></i>
                              <i className="fa-solid fa-star"></i>
                              <i className="fa-solid fa-star-half-stroke"></i>
                            </div>
                            <span className="tutor-rating-num">{t.rating || 4.9}</span>
                            <span className="tutor-reviews-count">({t.reviews_count || t.reviews || 50})</span>
                          </div>
                        </div>
                      </div>
                      <p className="tutor-card-bio">
                        {t.bio}
                      </p>
                      <div className="tutor-badges-row">
                        <span className="badge badge-slate">
                          <i
                            className={`fa-solid ${
                              t.modality === 'online' ? 'fa-laptop' : 'fa-location-dot'
                            }`}
                            style={{ color: 'var(--color-brand-600)', marginRight: '0.25rem' }}
                          ></i>
                          {t.modality === 'online' ? 'En Línea' : 'Presencial'}
                        </span>
                        <span className="badge badge-blue">
                          Verificado
                        </span>
                      </div>
                    </div>
                    <div className="tutor-catalog-footer">
                      <div>
                        <p className="tutor-price-meta">Precio/hora</p>
                        <p className="tutor-price-value">
                          ${t.price_per_hour || t.hourly_rate || t.price || 25}{' '}
                          <span className="tutor-price-currency">USD</span>
                        </p>
                      </div>
                      <Link
                        to={`/tutores/${t.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        Ver Perfil
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* List Mode */
              <div className="catalog-tutor-list">
                {sortedTutors.map((t) => (
                  <div
                    key={t.id}
                    className="tutor-list-item"
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', minWidth: 0, width: '100%' }}>
                      <img
                        src={t.avatar_url || t.avatar}
                        style={{ width: '4rem', height: '4rem', borderRadius: 'var(--radius-2xl)', objectFit: 'cover', border: '2px solid var(--color-brand-100)', flexShrink: 0 }}
                        alt={t.full_name || t.name}
                      />
                      <div style={{ minWidth: 0 }}>
                        <h3 style={{ fontWeight: 700, color: 'var(--color-slate-900)', fontSize: '1rem', margin: 0 }}>{t.full_name || t.name}</h3>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-brand-600)', margin: '0.25rem 0' }}>{t.subject_name || t.headline || t.subject}</p>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-slate-500)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{t.bio}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', gap: '1rem', flexShrink: 0, paddingTop: '0.75rem', borderTop: '1px solid var(--color-slate-100)' }}>
                      <div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-slate-900)' }}>${t.price_per_hour || t.hourly_rate || t.price || 25}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-slate-400)' }}> / hr</span>
                      </div>
                      <Link
                        to={`/tutores/${t.id}`}
                        className="btn btn-primary btn-sm"
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
