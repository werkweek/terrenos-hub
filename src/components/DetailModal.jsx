import React, { useState, useEffect } from 'react';
import { X, Save, MapPin, Check, FileText } from 'lucide-react';
import FacebookIcon from './FacebookIcon';

export default function DetailModal({ terreno, onClose, onSave }) {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [status, setStatus] = useState('Disponible');
  const [notes, setNotes] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (terreno) {
      if (terreno.coordinates && terreno.coordinates.length === 2) {
        setLat(String(terreno.coordinates[0]));
        setLng(String(terreno.coordinates[1]));
      } else {
        setLat('');
        setLng('');
      }
      setStatus(terreno.status || 'Disponible');
      setNotes(terreno.notes || '');
      setSavedSuccess(false);
    }
  }, [terreno]);

  if (!terreno) return null;

  const handleSave = (e) => {
    e.preventDefault();
    let coords = null;
    const parsedLat = parseFloat(lat.trim());
    const parsedLng = parseFloat(lng.trim());

    if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
      coords = [parsedLat, parsedLng];
    }

    const updated = {
      ...terreno,
      coordinates: coords,
      status,
      notes
    };

    onSave(updated);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-city">{terreno.city}</span>
            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>
              {terreno.id}
            </span>
          </div>
          <button
            onClick={onClose}
            className="btn-icon"
            style={{ padding: '6px', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#fff', marginBottom: '16px' }}>
            {terreno.title}
          </h2>

          {/* Quick Metrics Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            background: 'var(--bg-main)',
            padding: '14px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            marginBottom: '20px'
          }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>PRECIO</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--gold)' }}>
                {terreno.price > 0 ? `$${terreno.price.toLocaleString('es-MX')}` : 'N/D'}
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>SUPERFICIE</span>
              <strong style={{ fontSize: '1.1rem', color: '#fff' }}>
                {terreno.meters > 0 ? `${terreno.meters.toLocaleString('es-MX')} m²` : 'N/D'}
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>PRECIO / m²</span>
              <strong style={{ fontSize: '1.1rem', color: 'var(--emerald)' }}>
                {terreno.price_per_m2 > 0 ? `$${terreno.price_per_m2.toLocaleString('es-MX')}` : '-'}
              </strong>
            </div>
          </div>

          {/* Description */}
          {terreno.description && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>
                Descripción Original
              </label>
              <div style={{
                background: 'var(--bg-main)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px',
                fontSize: '0.85rem',
                color: 'var(--text-secondary)',
                maxHeight: '120px',
                overflowY: 'auto',
                whiteSpace: 'pre-line'
              }}>
                {terreno.description}
              </div>
            </div>
          )}

          {/* Edit Form */}
          <form onSubmit={handleSave}>
            <div style={{
              background: 'rgba(229, 169, 60, 0.04)',
              border: '1px solid var(--border-gold)',
              borderRadius: 'var(--radius-md)',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--gold)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} /> Ubicación Manual & Notas
              </h4>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Latitud (ej. 28.6432)
                  </label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="28.6432"
                    value={lat}
                    onChange={(e) => setLat(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Longitud (ej. -106.0745)
                  </label>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="-106.0745"
                    value={lng}
                    onChange={(e) => setLng(e.target.value)}
                    style={{ width: '100%' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Estado de la Propiedad
                </label>
                <select
                  className="input-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ width: '100%' }}
                >
                  <option value="Disponible">🟢 Disponible</option>
                  <option value="Apartado">🟡 Apartado</option>
                  <option value="Vendido">🔴 Vendido / Inactivo</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Notas Privadas
                </label>
                <textarea
                  className="input-control"
                  placeholder="Escribe notas, teléfonos de contacto, condiciones de pago..."
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  style={{ width: '100%', resize: 'none' }}
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
              {terreno.url ? (
                <a
                  href={terreno.url}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-secondary"
                  style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <FacebookIcon size={16} color="#1877F2" />
                  <span>Ver en Facebook Marketplace</span>
                </a>
              ) : <div></div>}

              <button
                type="submit"
                className="btn btn-primary"
                style={{ minWidth: '140px' }}
              >
                {savedSuccess ? (
                  <>
                    <Check size={16} /> ¡Guardado!
                  </>
                ) : (
                  <>
                    <Save size={16} /> Guardar Cambios
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
