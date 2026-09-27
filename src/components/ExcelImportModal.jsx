import React, { useState } from 'react';
import { X, UploadCloud, FileSpreadsheet, Check, AlertCircle } from 'lucide-react';
import { parseExcelFile } from '../utils/excelHelper';

export default function ExcelImportModal({ onClose, onImportData }) {
  const [file, setFile] = useState(null);
  const [mode, setMode] = useState('merge'); // 'merge' or 'replace'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewCount, setPreviewCount] = useState(null);
  const [parsedItems, setParsedItems] = useState([]);

  const handleFileChange = async (selectedFile) => {
    if (!selectedFile) return;
    setError(null);
    setLoading(true);

    try {
      const items = await parseExcelFile(selectedFile);
      setFile(selectedFile);
      setParsedItems(items);
      setPreviewCount(items.length);
    } catch (err) {
      console.error(err);
      setError('Error al leer el archivo Excel. Asegúrate de que sea un formato válido (.xlsx o .xls).');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleConfirm = () => {
    if (parsedItems.length > 0) {
      onImportData(parsedItems, mode);
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileSpreadsheet size={18} style={{ color: 'var(--emerald)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#fff' }}>
              Importar Archivo Excel (.xlsx)
            </h3>
          </div>
          <button onClick={onClose} className="btn-icon" style={{ padding: '6px', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          {/* Dropzone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            style={{
              border: '2px dashed var(--border-active)',
              borderRadius: 'var(--radius-lg)',
              padding: '36px 20px',
              textAlign: 'center',
              background: 'var(--bg-main)',
              cursor: 'pointer',
              marginBottom: '20px'
            }}
            onClick={() => document.getElementById('excel-file-input').click()}
          >
            <input
              id="excel-file-input"
              type="file"
              accept=".xlsx, .xls"
              style={{ display: 'none' }}
              onChange={(e) => handleFileChange(e.target.files[0])}
            />

            <UploadCloud size={36} style={{ color: 'var(--gold)', margin: '0 auto 12px' }} />
            <p style={{ color: '#fff', fontWeight: '600', marginBottom: '6px' }}>
              {file ? file.name : 'Haz clic o arrastra tu archivo Excel aquí'}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Formatos compatibles: .xlsx, .xls (Detecta automáticamente columnas de precios, metros y enlaces)
            </p>
          </div>

          {loading && (
            <p style={{ textAlign: 'center', color: 'var(--gold)', fontSize: '0.9rem', marginBottom: '16px' }}>
              Procesando hoja de cálculo...
            </p>
          )}

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--danger)',
              padding: '12px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          {previewCount !== null && !error && (
            <div style={{
              background: 'var(--emerald-subtle)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: 'var(--emerald)',
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '20px'
            }}>
              <Check size={16} />
              <span>Se detectaron <strong>{previewCount}</strong> registros de terrenos listos para cargar.</span>
            </div>
          )}

          {/* Mode selector */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
              Modo de Importación
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setMode('merge')}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: mode === 'merge' ? '1px solid var(--gold)' : '1px solid var(--border-subtle)',
                  background: mode === 'merge' ? 'var(--gold-glow)' : 'var(--bg-main)',
                  color: mode === 'merge' ? 'var(--gold)' : 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div>➕ Combinar</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '400', marginTop: '2px' }}>
                  Añadir a los actuales
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode('replace')}
                style={{
                  padding: '10px 14px',
                  borderRadius: 'var(--radius-md)',
                  border: mode === 'replace' ? '1px solid var(--danger)' : '1px solid var(--border-subtle)',
                  background: mode === 'replace' ? 'rgba(239, 68, 68, 0.1)' : 'var(--bg-main)',
                  color: mode === 'replace' ? 'var(--danger)' : 'var(--text-secondary)',
                  fontWeight: '600',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <div>🔄 Reemplazar</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '400', marginTop: '2px' }}>
                  Sustituir toda la base
                </div>
              </button>
            </div>
          </div>

          {/* Footer buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button onClick={onClose} className="btn btn-secondary">
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={parsedItems.length === 0}
              className="btn btn-primary"
              style={{ opacity: parsedItems.length === 0 ? 0.5 : 1 }}
            >
              Aplicar e Importar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
