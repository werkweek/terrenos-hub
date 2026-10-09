import React from 'react';
import { Search, Table, Grid, Map, Clock, RotateCcw, X, Calendar } from 'lucide-react';

const AGE_OPTIONS = [
  { id: 'all', label: 'Todas' },
  { id: 'today', label: 'Hoy' },
  { id: '2days', label: '≤ 48 hrs' },
  { id: 'week', label: '≤ 7 días' },
  { id: '15days', label: '≤ 15 días' },
  { id: 'month', label: '≤ 30 días' },
  { id: 'older30', label: '> 30 días' }
];

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  cities,
  selectedAge,
  setSelectedAge,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  onResetFilters
}) {
  const isFiltered = searchQuery || selectedCity !== 'all' || selectedAge !== 'all' || sortBy !== 'meters_desc';

  return (
    <div className="solid-panel" style={{ padding: '16px 20px', marginBottom: '24px' }}>
      {/* Row 1: Search, View Mode Switcher & Reset */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        marginBottom: '16px'
      }}>
        {/* Search input */}
        <div style={{ position: 'relative', flex: '1 1 320px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="input-control"
            placeholder="Buscar por zona, colonia, título o detalles (ej. Campestre, Granjas, UACH)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', paddingLeft: '38px', paddingRight: searchQuery ? '36px' : '14px' }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer'
              }}
              title="Borrar búsqueda"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* View Mode Switcher & Reset Button */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {isFiltered && (
            <button
              onClick={onResetFilters}
              className="btn btn-secondary"
              style={{ padding: '6px 12px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}
              title="Restablecer todos los filtros"
            >
              <RotateCcw size={13} />
              <span>Limpiar filtros</span>
            </button>
          )}

          <div style={{
            display: 'flex',
            background: 'var(--bg-main)',
            padding: '4px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            gap: '4px'
          }}>
            <button
              onClick={() => setViewMode('table')}
              className={`btn ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 12px', fontSize: '0.8rem', border: 'none' }}
            >
              <Table size={15} />
              <span>Tabla</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`btn ${viewMode === 'cards' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 12px', fontSize: '0.8rem', border: 'none' }}
            >
              <Grid size={15} />
              <span>Tarjetas</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`btn ${viewMode === 'map' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 12px', fontSize: '0.8rem', border: 'none' }}
            >
              <Map size={15} />
              <span>Mapa</span>
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: City Filter Pills */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '8px',
        paddingTop: '12px',
        paddingBottom: '12px',
        borderTop: '1px solid rgba(34, 41, 56, 0.6)'
      }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginRight: '4px', fontWeight: '600' }}>
          Ciudad:
        </span>
        <button
          onClick={() => setSelectedCity('all')}
          style={{
            padding: '4px 12px',
            fontSize: '0.78rem',
            fontWeight: '600',
            borderRadius: '20px',
            border: selectedCity === 'all' ? '1px solid var(--gold)' : '1px solid var(--border-subtle)',
            background: selectedCity === 'all' ? 'var(--gold-glow)' : 'var(--bg-main)',
            color: selectedCity === 'all' ? 'var(--gold)' : 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          Todos
        </button>
        {cities.map(city => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            style={{
              padding: '4px 12px',
              fontSize: '0.78rem',
              fontWeight: '600',
              borderRadius: '20px',
              border: selectedCity === city ? '1px solid var(--gold)' : '1px solid var(--border-subtle)',
              background: selectedCity === city ? 'var(--gold-glow)' : 'var(--bg-main)',
              color: selectedCity === city ? 'var(--gold)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Row 3: Antigüedad Filter Pills & Sort Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(34, 41, 56, 0.4)'
      }}>
        {/* Antiguedad Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          <span style={{
            fontSize: '0.75rem',
            color: 'var(--emerald)',
            textTransform: 'uppercase',
            marginRight: '4px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontWeight: '600'
          }}>
            <Clock size={13} /> Antigüedad:
          </span>
          {AGE_OPTIONS.map(opt => {
            const isSelected = selectedAge === opt.id;
            return (
              <button
                key={opt.id}
                onClick={() => setSelectedAge(opt.id)}
                style={{
                  padding: '3px 10px',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  borderRadius: '16px',
                  border: isSelected ? '1px solid var(--emerald)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-main)',
                  color: isSelected ? 'var(--emerald)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {/* Sort Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ordenar por:</span>
          <select
            className="input-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ padding: '4px 10px', fontSize: '0.8rem', cursor: 'pointer', background: 'var(--bg-main)' }}
          >
            <option value="date_desc">🕒 Más Recientes Primero</option>
            <option value="date_asc">🕒 Más Antiguos Primero</option>
            <option value="meters_desc">📏 Superficie: Mayor a Menor</option>
            <option value="meters_asc">📏 Superficie: Menor a Mayor</option>
            <option value="price_asc">💲 Precio: Menor a Mayor</option>
            <option value="price_desc">💲 Precio: Mayor a Menor</option>
            <option value="ppm_asc">📐 $/m²: Más Barato</option>
            <option value="ppm_desc">📐 $/m²: Más Alto</option>
          </select>
        </div>
      </div>
    </div>
  );
}
