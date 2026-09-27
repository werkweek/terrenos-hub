import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, ExternalLink, Edit3, Info } from 'lucide-react';

// Custom Gold Pin Marker Icon
const goldPinIcon = new L.DivIcon({
  className: 'custom-gold-pin',
  html: `<div style="
    background: #e5a93c;
    width: 28px;
    height: 28px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    border: 2px solid #0a0c10;
    box-shadow: 0 4px 10px rgba(0,0,0,0.5);
    display: flex;
    align-items: center;
    justify-content: center;
  "><div style="
    width: 8px;
    height: 8px;
    background: #0a0c10;
    border-radius: 50%;
  "></div></div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 28],
  popupAnchor: [0, -28]
});

export default function MapView({ terrenos, onSelectTerreno }) {
  const geolocatedTerrenos = terrenos.filter(
    (t) => t.coordinates && Array.isArray(t.coordinates) && t.coordinates.length === 2 && !isNaN(t.coordinates[0]) && !isNaN(t.coordinates[1])
  );

  // Center of Chihuahua by default
  const defaultCenter = [28.6353, -106.0889];
  const mapCenter = geolocatedTerrenos.length > 0 ? geolocatedTerrenos[0].coordinates : defaultCenter;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Notice Banner */}
      <div style={{
        background: 'rgba(229, 169, 60, 0.08)',
        border: '1px solid rgba(229, 169, 60, 0.25)',
        borderRadius: 'var(--radius-md)',
        padding: '12px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
          <Info size={18} style={{ color: 'var(--gold)', flexShrink: 0 }} />
          <span>
            Mostrando <strong>{geolocatedTerrenos.length}</strong> terrenos con coordenadas en el mapa. Puedes asignar coordenadas a cualquier lote desde la vista de <strong>Tabla</strong> o abriendo los detalles.
          </span>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="solid-panel" style={{ overflow: 'hidden' }}>
        <MapContainer
          center={mapCenter}
          zoom={geolocatedTerrenos.length > 0 ? 12 : 11}
          scrollWheelZoom={true}
          style={{ height: '580px', width: '100%' }}
        >
          {/* Dark Minimalist Map Tiles */}
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {geolocatedTerrenos.map((item) => (
            <Marker
              key={item.id}
              position={item.coordinates}
              icon={goldPinIcon}
            >
              <Popup>
                <div style={{ minWidth: '220px', padding: '4px' }}>
                  <div style={{ fontSize: '0.75rem', color: '#06b6d4', fontWeight: '600', marginBottom: '4px' }}>
                    {item.city} &bull; {item.id}
                  </div>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: '700', marginBottom: '8px', color: '#1e293b' }}>
                    {item.title}
                  </h4>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.82rem' }}>
                    <span>Precio:</span>
                    <strong style={{ color: '#d97706' }}>${item.price.toLocaleString('es-MX')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.82rem' }}>
                    <span>Superficie:</span>
                    <strong>{item.meters} m²</strong>
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => onSelectTerreno(item)}
                      style={{
                        flex: '1',
                        padding: '5px 8px',
                        background: '#1e293b',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        cursor: 'pointer'
                      }}
                    >
                      Editar Ubicación
                    </button>
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          padding: '5px 8px',
                          background: '#e2e8f0',
                          color: '#334155',
                          borderRadius: '4px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          textDecoration: 'none'
                        }}
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
