import React from 'react';
import { Edit3, MapPin, Maximize2, Calendar, Clock } from 'lucide-react';
import FacebookIcon from './FacebookIcon';
import { getDaysAgo } from '../utils/dateHelper';

export default function CardView({ terrenos, onSelectTerreno }) {
  if (terrenos.length === 0) {
    return (
      <div className="solid-panel" style={{ padding: '60px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
          No se encontraron terrenos con los filtros seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div className="cards-grid">
      {terrenos.map((item) => {
        const hasCoords = item.coordinates && item.coordinates.length === 2;
        const dateInfo = getDaysAgo(item.date || item.created_at);
        return (
          <div key={item.id} className="property-card">
            {/* Header: City, Days Ago & ID */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="badge badge-city">{item.city}</span>
                  <span className={`badge ${dateInfo.badgeClass}`} title={dateInfo.fullDate} style={{ fontSize: '0.72rem' }}>
                    {dateInfo.text}
                  </span>
                </div>
                <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                  {item.id}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '1.05rem',
                fontWeight: '600',
                color: '#ffffff',
                marginBottom: '12px',
                lineHeight: '1.3',
                display: '-webkit-box',
                WebkitLineClamp: '2',
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}>
                {item.title}
              </h3>

              {/* Location */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                <MapPin size={14} style={{ color: 'var(--gold)', flexShrink: 0 }} />
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {item.location_card || 'Zona Metropolitana'}
                </span>
              </div>
            </div>

            {/* Price & Specs Metrics */}
            <div style={{
              background: 'var(--bg-main)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 14px',
              border: '1px solid rgba(34, 41, 56, 0.7)',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Precio</span>
                <span style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--gold)' }}>
                  {item.price > 0 ? `$${item.price.toLocaleString('es-MX')}` : <span className="badge badge-gray" style={{ fontSize: '0.75rem' }}>A cotizar</span>}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Superficie</span>
                  <strong style={{ fontSize: '0.88rem', color: '#fff' }}>
                    {item.meters > 0 ? (
                      item.meters >= 10000 
                        ? `${item.meters.toLocaleString('es-MX')} m² (${(item.meters / 10000).toFixed(1)} ha)`
                        : `${item.meters.toLocaleString('es-MX')} m²`
                    ) : 'N/D'}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>Precio / m²</span>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--emerald)' }}>
                    {item.price_per_m2 > 0 ? `$${item.price_per_m2.toLocaleString('es-MX')}` : '-'}
                  </strong>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <button
                onClick={() => onSelectTerreno(item)}
                className="btn btn-secondary"
                style={{ flex: '1', fontSize: '0.8rem', padding: '8px 12px' }}
              >
                <Edit3 size={14} />
                <span>Detalles & Mapa</span>
              </button>

              {item.url && (
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-icon"
                  title="Ver publicación en Facebook Marketplace"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '8px' }}
                >
                  <FacebookIcon size={16} color="#1877F2" />
                </a>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
