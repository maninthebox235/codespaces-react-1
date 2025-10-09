import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import PlayerManagement from './components/PlayerManagement';
import NewAssessment from './components/NewAssessment';
import Reports from './components/Reports';
import ExportData from './components/ExportData';
import { 
  getPlayers, 
  getAssessments, 
  savePlayer, 
  deletePlayer, 
  saveAssessment, 
  deleteAssessmentsForPlayer,
  importData,
  exportData,
  supabase 
} from './utils/supabaseClient';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appData, setAppData] = useState({
    players: [],
    assessments: []
  });

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [players, assessments] = await Promise.all([
          getPlayers(),
          getAssessments()
        ]);
        setAppData({ players, assessments });
      } catch (error) {
        console.error('Error loading data:', error);
        alert('Error loading data. Please check your connection.');
      }
    };
    loadData();

    // Set up real-time subscriptions
    const playersSubscription = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'players' },
        () => {
          loadData(); // Reload data when changes occur
        }
      )
      .subscribe();

    const assessmentsSubscription = supabase
      .channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'assessments' },
        () => {
          loadData(); // Reload data when changes occur
        }
      )
      .subscribe();

    // Cleanup subscriptions
    return () => {
      playersSubscription.unsubscribe();
      assessmentsSubscription.unsubscribe();
    };
  }, []);

  const handleAddPlayer = async (newPlayer) => {
    try {
      await savePlayer(newPlayer);
      // Data will be updated via real-time subscription
    } catch (error) {
      console.error('Error saving player:', error);
      alert('Failed to save player. Please try again.');
    }
  };

  const handleDeletePlayer = async (playerId) => {
    if (!window.confirm('Are you sure you want to delete this player and all their assessments?')) {
      return;
    }
    try {
      await deletePlayer(playerId);
      // Cascade delete will handle assessments, and data will be updated via real-time subscription
    } catch (error) {
      console.error('Error deleting player:', error);
      alert('Failed to delete player. Please try again.');
    }
  };

  const handleSaveAssessment = async (assessment) => {
    try {
      await saveAssessment(assessment);
      setActiveTab('dashboard');
      // Data will be updated via real-time subscription
    } catch (error) {
      console.error('Error saving assessment:', error);
      alert('Failed to save assessment. Please try again.');
    }
  };

  const handleImportData = async (importedData) => {
    try {
      await importData(importedData);
      // Data will be updated via real-time subscription
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Failed to import data. Please try again.');
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('⚠️ This will permanently delete ALL data. This cannot be undone. Are you sure?')) {
      return;
    }
    try {
      await importData({ players: [], assessments: [] });
      // Data will be updated via real-time subscription
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('Failed to clear data. Please try again.');
    }
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>🏒 Hockey Baseline Development Tracker</h1>
          <p>Individual player development tracking system - Measuring progress, not rankings</p>
        </div>

        <div className="nav-tabs">
          <Link className="nav-tab" to="/">Dashboard</Link>
          <Link className="nav-tab" to="/players">Players</Link>
          <Link className="nav-tab" to="/assess">New Assessment</Link>
          <Link className="nav-tab" to="/reports">Reports</Link>
          <Link className="nav-tab" to="/export">Export Data</Link>
        </div>

        <div className="content-section active">
          <HashRouter>
            <AppRoutes 
              appData={appData}
              onAddPlayer={handleAddPlayer}
              onDeletePlayer={handleDeletePlayer}
              onSaveAssessment={handleSaveAssessment}
              onImportData={handleImportData}
              onClearData={handleClearData}
            />
          </HashRouter>
        </div>
      </div>
    </div>
  );
}

export default App;

function AppRoutes({ appData, onAddPlayer, onDeletePlayer, onSaveAssessment, onImportData, onClearData }) {
  return (
    <Routes>
      <Route path="/" element={<Dashboard players={appData.players} assessments={appData.assessments} />} />
      <Route path="/players" element={<PlayerManagement players={appData.players} onAddPlayer={onAddPlayer} onDeletePlayer={onDeletePlayer} />} />
      <Route path="/assess" element={<NewAssessment players={appData.players} onSaveAssessment={onSaveAssessment} />} />
      <Route path="/reports" element={<Reports players={appData.players} assessments={appData.assessments} />} />
      <Route path="/export" element={<ExportData onImport={onImportData} onClear={onClearData} />} />
      {/* Catch-all route to redirect to dashboard */}
      <Route path="*" element={<Dashboard players={appData.players} assessments={appData.assessments} />} />
    </Routes>
  );
}
