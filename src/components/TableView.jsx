import React, { useState } from 'react';
import { Edit3, MapPin, CheckCircle2, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import FacebookIcon from './FacebookIcon';

export default function TableView({ terrenos, onSelectTerreno }) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 25;

  const totalPages = Math.ceil(terrenos.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = terrenos.slice(startIndex, startIndex + pageSize);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>ID</th>
              <th style={{ width: '60px', textAlign: 'center' }}>
                <FacebookIcon size={16} color="#1877F2" />
              </th>
              <th style={{ width: '110px' }}>Ciudad</th>
              <th>Propiedad / Título</th>
              <th style={{ textAlign: 'right', width: '130px' }}>Superficie</th>
              <th style={{ textAlign: 'right', width: '140px' }}>Precio ($ MXN)</th>
              <th style={{ textAlign: 'right', width: '130px' }}>Precio / m²</th>
              <th>Zona / Ubicación</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Mapa</th>
              <th style={{ width: '90px', textAlign: 'center' }}>Detalles</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((item) => {
              const hasCoords = item.coordinates && item.coordinates.length === 2;
              return (
                <tr key={item.id}>
                  {/* Col 1: ID */}
                  <td style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {item.id}
                  </td>

                  {/* Col 2: Facebook Icon Direct Link (Between ID and Ciudad) */}
                  <td style={{ textAlign: 'center' }}>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        title="Abrir publicación en Facebook Marketplace"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '30px',
                          height: '30px',
                          borderRadius: 'var(--radius-sm)',
                          background: 'rgba(24, 119, 242, 0.1)',
                          border: '1px solid rgba(24, 119, 242, 0.3)',
                          transition: 'all 0.15s ease',
                          cursor: 'pointer'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = '#1877F2';
                          const svg = e.currentTarget.querySelector('svg');
                          if (svg) svg.style.fill = '#ffffff';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'rgba(24, 119, 242, 0.1)';
                          const svg = e.currentTarget.querySelector('svg');
                          if (svg) svg.style.fill = '#1877F2';
                        }}
                      >
                        <FacebookIcon size={16} color="#1877F2" />
                      </a>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>-</span>
                    )}
                  </td>

                  {/* Col 3: Ciudad */}
                  <td>
                    <span className="badge badge-city">{item.city}</span>
                  </td>

                  {/* Col 4: Titulo */}
                  <td style={{ maxWidth: '280px' }}>
                    <div style={{
                      fontWeight: '600',
                      color: '#ffffff',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }} title={item.title}>
                      {item.title}
                    </div>
                  </td>

                  {/* Col 5: Superficie */}
                  <td style={{ textAlign: 'right', fontWeight: '600' }}>
                    {item.meters > 0 ? (
                      <div>
                        <span style={{ color: '#ffffff' }}>{item.meters.toLocaleString('es-MX')} m²</span>
                        {item.meters >= 10000 && (
                          <div style={{ fontSize: '0.72rem', color: 'var(--emerald)' }}>
                            {(item.meters / 10000).toFixed(1)} ha
                          </div>
                        )}
                      </div>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>N/D</span>
                    )}
                  </td>

                  {/* Col 6: Precio */}
                  <td style={{ textAlign: 'right', fontWeight: '700' }}>
                    {item.price > 0 ? (
                      <span style={{ color: 'var(--gold)', fontSize: '0.95rem' }}>
                        ${item.price.toLocaleString('es-MX')}
                      </span>
                    ) : (
                      <span className="badge badge-gray" style={{ fontSize: '0.72rem' }}>A cotizar</span>
                    )}
                  </td>

                  {/* Col 7: Precio / m2 */}
                  <td style={{ textAlign: 'right', fontWeight: '600' }}>
                    {item.price_per_m2 > 0 ? (
                      <span style={{ color: 'var(--emerald)', fontSize: '0.9rem' }}>
                        ${item.price_per_m2.toLocaleString('es-MX')}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>-</span>
                    )}
                  </td>

                  {/* Col 8: Zona / Ubicacion */}
                  <td>
                    <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                      {item.location_card || 'Chihuahua / Zona'}
                    </span>
                  </td>

                  {/* Col 9: Mapa */}
                  <td style={{ textAlign: 'center' }}>
                    {hasCoords ? (
                      <span className="badge badge-emerald" title={`Lat: ${item.coordinates[0]}, Lng: ${item.coordinates[1]}`}>
                        <CheckCircle2 size={11} /> Listo
                      </span>
                    ) : (
                      <span className="badge badge-gray" title="Pendiente de geolocalizar a mano">
                        Pendiente
                      </span>
                    )}
                  </td>

                  {/* Col 10: Detalles / Accion */}
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => onSelectTerreno(item)}
                      className="btn-icon"
                      title="Ver detalles, fotos y asignar coordenadas"
                      style={{ cursor: 'pointer' }}
                    >
                      <Edit3 size={14} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        padding: '12px 16px',
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        fontSize: '0.85rem'
      }}>
        <div style={{ color: 'var(--text-secondary)' }}>
          Mostrando <strong style={{ color: '#fff' }}>{startIndex + 1}</strong> a <strong style={{ color: '#fff' }}>{Math.min(startIndex + pageSize, terrenos.length)}</strong> de <strong style={{ color: '#fff' }}>{terrenos.length}</strong> lotes
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', opacity: currentPage === 1 ? 0.4 : 1 }}
          >
            <ChevronLeft size={16} /> Anterior
          </button>
          
          <span style={{ color: 'var(--text-primary)', fontWeight: '600', padding: '0 8px' }}>
            Página {currentPage} de {totalPages}
          </span>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn btn-secondary"
            style={{ padding: '6px 12px', opacity: currentPage === totalPages ? 0.4 : 1 }}
          >
            Siguiente <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
