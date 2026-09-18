import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, RotateCcw, Compass } from 'lucide-react';
import { tutorsService } from '../services/tutorsService';
import { TutorCard } from '../components/tutors/TutorCard';
import { Tutor } from '../types';

export const TutorsList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Filters
  const [search, setSearch] = useState<string>('');
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'all');
  const [modality, setModality] = useState<string>(searchParams.get('modality') || 'all');
  const [maxPrice, setMaxPrice] = useState<number>(100);

  useEffect(() => {
    tutorsService.getTutors().then(data => {
      setTutors(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
    const mod = searchParams.get('modality');
    if (mod) setModality(mod);
  }, [searchParams]);

  const filteredTutors = tutors.filter(tutor => {
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchName = tutor.full_name.toLowerCase().includes(q);
      const matchSubject = tutor.subject_name.toLowerCase().includes(q);
      const matchBio = tutor.bio?.toLowerCase().includes(q);
      if (!matchName && !matchSubject && !matchBio) return false;
    }

    if (category !== 'all' && tutor.subject_category !== category) return false;
    if (modality !== 'all' && tutor.modality !== modality && tutor.modality !== 'ambas') return false;
    if (Number(tutor.price_per_hour) > maxPrice) return false;

    return true;
  });

  const handleReset = () => {
    setSearch('');
    setCategory('all');
    setModality('all');
    setMaxPrice(100);
    setSearchParams({});
  };

  return (
    <div className="container" style={{ paddingTop: 40, paddingBottom: 60, display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid var(--border-light)', paddingBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--primary)', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', marginBottom: 8 }}>
          <Compass size={16} />
          <span>Directorio Académico</span>
        </div>
        <h1 style={{ fontSize: 34, fontWeight: 800, color: 'var(--text-main)' }}>
          Encuentra tu Profesor Ideal
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 4 }}>
          Filtra entre profesores certificados por materia, modalidad y tarifas horarias.
        </p>
      </div>

      {/* Filter Box */}
      <div className="card" style={{ padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr auto', gap: 12, alignItems: 'center' }}>
          {/* Text search */}
          <div className="input-with-icon">
            <Search size={16} className="input-icon" />
            <input
              type="text"
              placeholder="Buscar por profesor, materia o tema..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-control"
            />
          </div>

          {/* Category */}
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setSearchParams(prev => {
                if (e.target.value === 'all') prev.delete('category');
                else prev.set('category', e.target.value);
                return prev;
              });
            }}
            className="input-control"
            style={{ fontWeight: 600 }}
          >
            <option value="all">Todas las materias</option>
            <option value="matematicas">Matemáticas & Cálculo</option>
            <option value="programacion">Programación & TI</option>
            <option value="ingles">Inglés & Idiomas</option>
            <option value="ciencias">Ciencias Naturales</option>
          </select>

          {/* Modality */}
          <select
            value={modality}
            onChange={(e) => {
              setModality(e.target.value);
              setSearchParams(prev => {
                if (e.target.value === 'all') prev.delete('modality');
                else prev.set('modality', e.target.value);
                return prev;
              });
            }}
            className="input-control"
            style={{ fontWeight: 600 }}
          >
            <option value="all">Todas las modalidades</option>
            <option value="online">En Línea</option>
            <option value="presencial">Presencial</option>
          </select>

          {/* Reset */}
          <button onClick={handleReset} className="btn btn-secondary btn-sm" style={{ padding: '10px 14px' }}>
            <RotateCcw size={14} />
            <span>Limpiar</span>
          </button>
        </div>

        {/* Price Slider */}
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ fontSize: 13 }}>
            <span style={{ color: 'var(--text-muted)' }}>Tarifa máxima: </span>
            <strong style={{ color: 'var(--primary)', fontSize: 15 }}>${maxPrice} USD / hr</strong>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 280 }}>
            <span style={{ fontSize: 11, color: 'var(--text-light)' }}>$10</span>
            <input
              type="range"
              min="10"
              max="60"
              step="2"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--primary)', cursor: 'pointer' }}
            />
            <span style={{ fontSize: 11, color: 'var(--text-light)' }}>$60</span>
          </div>
        </div>
      </div>

      {/* Results stats */}
      <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>
        Mostrando <strong style={{ color: 'var(--text-main)' }}>{filteredTutors.length}</strong> profesores disponibles
      </div>

      {/* Grid */}
      {loading ? (
        <div className="tutor-grid">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="card" style={{ height: 280, background: 'var(--bg-muted)' }}></div>
          ))}
        </div>
      ) : filteredTutors.length > 0 ? (
        <div className="tutor-grid">
          {filteredTutors.map(tutor => (
            <TutorCard key={tutor.id} tutor={tutor} />
          ))}
        </div>
      ) : (
        <div className="card" style={{ padding: 48, textAlign: 'center', maxWidth: 500, margin: '0 auto' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', color: 'var(--text-light)' }}>
            <Search size={32} />
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 800 }}>No se encontraron tutores</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6, marginBottom: 20 }}>
            Intenta ajustar tus filtros de materia o ampliar el rango de precio.
          </p>
          <button onClick={handleReset} className="btn btn-primary btn-sm">
            Restablecer todos los filtros
          </button>
        </div>
      )}
    </div>
  );
};
