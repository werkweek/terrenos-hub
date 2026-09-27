import React from 'react';
import { Layers, TrendingDown, DollarSign, MapPin } from 'lucide-react';

export default function MetricsBar({ terrenos, filteredCount }) {
  // Calculations
  const total = terrenos.length;
  const withPrice = terrenos.filter(t => t.price > 0);
  const withMeters = terrenos.filter(t => t.meters > 0 && t.price > 0);

  const avgPrice = withPrice.length 
    ? Math.round(withPrice.reduce((acc, t) => acc + t.price, 0) / withPrice.length) 
    : 0;

  const avgPricePerM2 = withMeters.length
    ? Math.round(withMeters.reduce((acc, t) => acc + t.price_per_m2, 0) / withMeters.length)
    : 0;

  const geolocatedCount = terrenos.filter(t => t.coordinates && t.coordinates.length === 2).length;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '16px',
      marginBottom: '24px'
    }}>
      {/* Metric 1: Total Terrenos */}
      <div className="solid-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(229, 169, 60, 0.1)',
          color: 'var(--gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Layers size={22} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Lotes Registrados
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ffffff' }}>
            {filteredCount} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '400' }}>/ {total}</span>
          </div>
        </div>
      </div>

      {/* Metric 2: Precio Promedio / m2 */}
      <div className="solid-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-md)',
          background: 'var(--emerald-subtle)',
          color: 'var(--emerald)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <TrendingDown size={22} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Precio Promedio / m²
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--emerald)' }}>
            ${avgPricePerM2.toLocaleString('es-MX')} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '400' }}>MXN</span>
          </div>
        </div>
      </div>

      {/* Metric 3: Precio Promedio Total */}
      <div className="solid-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(6, 182, 212, 0.1)',
          color: 'var(--cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <DollarSign size={22} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Valor Promedio Lote
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ffffff' }}>
            ${avgPrice.toLocaleString('es-MX')} <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '400' }}>MXN</span>
          </div>
        </div>
      </div>

      {/* Metric 4: Geolocalizados */}
      <div className="solid-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-md)',
          background: 'rgba(148, 163, 184, 0.1)',
          color: 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <MapPin size={22} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Con Coordenadas
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#ffffff' }}>
            {geolocatedCount} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '400' }}>en mapa</span>
          </div>
        </div>
      </div>
    </div>
  );
}
