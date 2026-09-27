import React, { useState, useEffect, useMemo } from 'react';
import initialTerrenos from './data/terrenos.json';
import Navbar from './components/Navbar';
import MetricsBar from './components/MetricsBar';
import FilterBar from './components/FilterBar';
import TableView from './components/TableView';
import CardView from './components/CardView';
import MapView from './components/MapView';
import DetailModal from './components/DetailModal';
import ExcelImportModal from './components/ExcelImportModal';
import Login from './components/Login';
import { exportToExcel } from './utils/excelHelper';
import { getActiveSession, clearSession } from './utils/auth';

const STORAGE_KEY = 'terrenos_db_v3';

export default function App() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState(() => getActiveSession());

  // Initialize from LocalStorage if available, else initial data
  const [terrenos, setTerrenos] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading from localStorage:', e);
    }
    return initialTerrenos;
  });

  const [isModified, setIsModified] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const [sortBy, setSortBy] = useState('meters_desc');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'cards' | 'map'
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [selectedTerrenoForModal, setSelectedTerrenoForModal] = useState(null);

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(terrenos));
      setIsModified(true);
    } catch (e) {
      console.error('Error saving to localStorage:', e);
    }
  }, [terrenos]);

  // Extract unique cities
  const cities = useMemo(() => {
    const set = new Set(terrenos.map(t => t.city).filter(Boolean));
    return Array.from(set);
  }, [terrenos]);

  // Filter and Sort Data
  const filteredTerrenos = useMemo(() => {
    let result = [...terrenos];

    // City Filter
    if (selectedCity !== 'all') {
      result = result.filter(t => t.city?.toLowerCase() === selectedCity.toLowerCase());
    }

    // Search Query (title, location, description, id)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(t => 
        t.title?.toLowerCase().includes(q) ||
        t.location_card?.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.id?.toLowerCase().includes(q) ||
        t.notes?.toLowerCase().includes(q)
      );
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'price_asc') {
        if (!a.price) return 1;
        if (!b.price) return -1;
        return a.price - b.price;
      }
      if (sortBy === 'price_desc') {
        return (b.price || 0) - (a.price || 0);
      }
      if (sortBy === 'ppm_asc') {
        if (!a.price_per_m2) return 1;
        if (!b.price_per_m2) return -1;
        return a.price_per_m2 - b.price_per_m2;
      }
      if (sortBy === 'ppm_desc') {
        return (b.price_per_m2 || 0) - (a.price_per_m2 || 0);
      }
      if (sortBy === 'meters_desc') {
        return (b.meters || 0) - (a.meters || 0);
      }
      if (sortBy === 'meters_asc') {
        if (!a.meters) return 1;
        if (!b.meters) return -1;
        return a.meters - b.meters;
      }
      return 0;
    });

    return result;
  }, [terrenos, selectedCity, searchQuery, sortBy]);

  // Handler to save single updated terreno
  const handleSaveTerreno = (updatedItem) => {
    setTerrenos(prev => prev.map(t => t.id === updatedItem.id ? updatedItem : t));
  };

  // Handler to import data from Excel
  const handleImportData = (newItems, mode) => {
    if (mode === 'replace') {
      setTerrenos(newItems);
    } else {
      // Merge by ID or append
      const existingIds = new Set(terrenos.map(t => t.id));
      const combined = [...terrenos];
      newItems.forEach(item => {
        if (!existingIds.has(item.id)) {
          combined.push(item);
          existingIds.add(item.id);
        }
      });
      setTerrenos(combined);
    }
  };

  // Handler to export current view to Excel
  const handleExportExcel = () => {
    exportToExcel(filteredTerrenos, `Terrenos_${selectedCity !== 'all' ? selectedCity : 'Chihuahua_Delicias_Aldama'}.xlsx`);
  };

  // Handler to reset dataset
  const handleResetData = () => {
    if (window.confirm('¿Seguro que deseas restablecer los datos originales? Se perderán las coordenadas y notas manuales no exportadas.')) {
      localStorage.removeItem(STORAGE_KEY);
      setTerrenos(initialTerrenos);
      setIsModified(false);
    }
  };

  // If user is not authenticated, show Login Wall
  if (!currentUser) {
    return <Login onLoginSuccess={(session) => setCurrentUser(session)} />;
  }

  return (
    <div className="app-container">
      {/* Navbar */}
      <Navbar
        totalCount={terrenos.length}
        onOpenImport={() => setIsImportModalOpen(true)}
        onExportExcel={handleExportExcel}
        onResetData={handleResetData}
        isModified={isModified}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Metrics Bar */}
      <MetricsBar 
        terrenos={terrenos} 
        filteredCount={filteredTerrenos.length} 
      />

      {/* Filter and View Mode Switcher */}
      <FilterBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        cities={cities}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {/* Main View Display */}
      {viewMode === 'table' && (
        <TableView
          terrenos={filteredTerrenos}
          onSelectTerreno={(item) => setSelectedTerrenoForModal(item)}
        />
      )}

      {viewMode === 'cards' && (
        <CardView
          terrenos={filteredTerrenos}
          onSelectTerreno={(item) => setSelectedTerrenoForModal(item)}
        />
      )}

      {viewMode === 'map' && (
        <MapView
          terrenos={filteredTerrenos}
          onSelectTerreno={(item) => setSelectedTerrenoForModal(item)}
        />
      )}

      {/* Detail & Geolocation Modal */}
      {selectedTerrenoForModal && (
        <DetailModal
          terreno={selectedTerrenoForModal}
          onClose={() => setSelectedTerrenoForModal(null)}
          onSave={handleSaveTerreno}
        />
      )}

      {/* Excel Import Modal */}
      {isImportModalOpen && (
        <ExcelImportModal
          onClose={() => setIsImportModalOpen(false)}
          onImportData={handleImportData}
        />
      )}
    </div>
  );
}
