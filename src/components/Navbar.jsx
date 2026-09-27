import React from 'react';
import { UploadCloud, Download, RotateCcw, Database, LogOut, UserCheck } from 'lucide-react';

export default function Navbar({ 
  totalCount, 
  onOpenImport, 
  onExportExcel, 
  onResetData, 
  isModified,
  currentUser,
  onLogout
}) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '16px',
      paddingBottom: '24px',
      borderBottom: '1px solid var(--border-subtle)',
      marginBottom: '24px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{
          width: '42px',
          height: '42px',
          borderRadius: 'var(--radius-md)',
          background: 'linear-gradient(135deg, #1c2230 0%, #0d1017 100%)',
          border: '1px solid var(--border-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--gold)',
          fontWeight: '700',
          fontSize: '1.2rem'
        }}>
          💎
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h1 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#ffffff' }}>
              Terrenos Hub
            </h1>
            <span className="badge badge-gold">Vercel Ready</span>
            {currentUser && (
              <span className="badge badge-emerald" title="Usuario activo">
                <UserCheck size={11} /> {currentUser.username}
              </span>
            )}
            {isModified && (
              <span className="badge badge-gray" title="Cambios guardados localmente">
                <Database size={11} /> Sincronizado
              </span>
            )}
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Chihuahua · Delicias · Aldama &bull; Base de Datos Inmobiliaria
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={onOpenImport} 
          className="btn btn-primary"
          title="Importar archivo .xlsx o .xls"
        >
          <UploadCloud size={16} />
          <span>Subir Excel (.xlsx)</span>
        </button>

        <button 
          onClick={onExportExcel} 
          className="btn btn-secondary"
          title="Descargar datos actuales a Excel"
        >
          <Download size={16} />
          <span>Exportar XLS</span>
        </button>

        {isModified && (
          <button 
            onClick={onResetData} 
            className="btn btn-secondary"
            style={{ color: 'var(--text-muted)' }}
            title="Restablecer dataset original"
          >
            <RotateCcw size={15} />
            <span>Restablecer</span>
          </button>
        )}

        {onLogout && (
          <button 
            onClick={onLogout} 
            className="btn btn-icon"
            title="Cerrar Sesión"
            style={{ color: 'var(--danger)' }}
          >
            <LogOut size={16} />
          </button>
        )}
      </div>
    </header>
  );
}
