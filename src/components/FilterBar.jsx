import React from 'react';
import { Search, Table, Grid, Map, SlidersHorizontal, X } from 'lucide-react';

export default function FilterBar({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  cities,
  sortBy,
  setSortBy,
  viewMode,
  setViewMode,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onResetFilters
}) {
  return (
    <div className="solid-panel" style={{ padding: '16px 20px', marginBottom: '24px' }}>
      {/* Row 1: Search & View Mode Switcher */}
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
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* View Mode Switcher */}
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

      {/* Row 2: City Pills & Sort Selector */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        paddingTop: '12px',
        borderTop: '1px solid rgba(34, 41, 56, 0.6)'
      }}>
        {/* City Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginRight: '4px' }}>
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
              cursor: 'pointer'
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
                cursor: 'pointer'
              }}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Sort selector & Price filter shortcut */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ordenar por:</span>
            <select
              className="input-control"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{ padding: '4px 10px', fontSize: '0.8rem', cursor: 'pointer' }}
            >
              <option value="price_asc">Precio: Menor a Mayor</option>
              <option value="price_desc">Precio: Mayor a Menor</option>
              <option value="ppm_asc">$/m²: Más Barato</option>
              <option value="ppm_desc">$/m²: Más Alto</option>
              <option value="meters_desc">Superficie: Mayor a Menor</option>
              <option value="meters_asc">Superficie: Menor a Mayor</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
