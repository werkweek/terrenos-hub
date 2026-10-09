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
import { getDaysCount, getTimestamp } from './utils/dateHelper';

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
  const [selectedAge, setSelectedAge] = useState('all'); // 'all', 'today', '2days', 'week', '15days', 'month', 'older30'
  const [sortBy, setSortBy] = useState('date_desc'); // default to most recent first
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

  // Reset all active filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('all');
    setSelectedAge('all');
    setSortBy('date_desc');
  };

  // Filter and Sort Data
  const filteredTerrenos = useMemo(() => {
    let result = [...terrenos];

    // City Filter
    if (selectedCity !== 'all') {
      result = result.filter(t => t.city?.toLowerCase() === selectedCity.toLowerCase());
    }

    // Age / Antigüedad Filter
    if (selectedAge !== 'all') {
      result = result.filter(t => {
        const days = getDaysCount(t.date || t.created_at);
        if (selectedAge === 'today') return days === 0;
        if (selectedAge === '2days') return days <= 2;
        if (selectedAge === 'week') return days <= 7;
        if (selectedAge === '15days') return days <= 15;
        if (selectedAge === 'month') return days <= 30;
        if (selectedAge === 'older30') return days > 30;
        return true;
      });
    }

    // Search Query (title, location, description, id, notes)
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
      if (sortBy === 'date_desc') {
        return getTimestamp(b.date || b.created_at) - getTimestamp(a.date || a.created_at);
      }
      if (sortBy === 'date_asc') {
        return getTimestamp(a.date || a.created_at) - getTimestamp(b.date || b.created_at);
      }
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
  }, [terrenos, selectedCity, selectedAge, searchQuery, sortBy]);

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
    exportToExcel(filteredTerrenos, `Terrenos_${selectedCity}_${Date.now()}.xlsx`);
  };

  // Handler to reset data back to clean factory dataset
  const handleResetData = () => {
    if (window.confirm('¿Deseas restablecer todos los terrenos al estado original sincronizado? Se perderán las coordenadas y notas que no hayas exportado.')) {
      setTerrenos(initialTerrenos);
      localStorage.removeItem(STORAGE_KEY);
      handleResetFilters();
      setIsModified(false);
    }
  };

  if (!currentUser) {
    return <Login onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
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
        selectedAge={selectedAge}
        setSelectedAge={setSelectedAge}
        sortBy={sortBy}
        setSortBy={setSortBy}
        viewMode={viewMode}
        setViewMode={setViewMode}
        onResetFilters={handleResetFilters}
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
          onImport={handleImportData}
        />
      )}
    </div>
  );
}
