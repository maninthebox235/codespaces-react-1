import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Dashboard from './components/Dashboard';
import PlayerManagement from './components/PlayerManagement';
import NewAssessment from './components/NewAssessment';
// Lazy load Reports since it includes Chart.js (large dependency)
const Reports = lazy(() => import('./components/Reports'));
const ExportData = lazy(() => import('./components/ExportData'));
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load data from Supabase on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [players, assessments] = await Promise.all([
          getPlayers(),
          getAssessments()
        ]);
        setAppData({ players, assessments });
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load data. Please check your connection and try refreshing the page.');
      } finally {
        setLoading(false);
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
      console.log('Attempting to save assessment:', assessment);
      await saveAssessment(assessment);
      setActiveTab('dashboard');
      alert('Assessment saved successfully!');
      // Data will be updated via real-time subscription
    } catch (error) {
      console.error('Error saving assessment:', error);
      console.error('Error details:', error.message, error.details);
      alert(`Failed to save assessment: ${error.message || 'Unknown error'}. Check console for details.`);
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

  if (loading) {
    return (
      <div className="App">
        <div className="container">
          <div className="header">
            <h1>🏒 Hockey Baseline Development Tracker</h1>
            <p>Loading data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <div className="container">
          <div className="header">
            <h1>🏒 Hockey Baseline Development Tracker</h1>
          </div>
          <div className="empty-state" style={{ marginTop: '40px', color: '#e53e3e' }}>
            <h3>Error Loading Data</h3>
            <p>{error}</p>
            <button className="btn" onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          <AppRoutes
            appData={appData}
            onAddPlayer={handleAddPlayer}
            onDeletePlayer={handleDeletePlayer}
            onSaveAssessment={handleSaveAssessment}
            onImportData={handleImportData}
            onClearData={handleClearData}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

function AppRoutes({ appData, onAddPlayer, onDeletePlayer, onSaveAssessment, onImportData, onClearData }) {
  return (
    <Suspense fallback={<div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Dashboard players={appData.players} assessments={appData.assessments} />} />
        <Route path="/players" element={<PlayerManagement players={appData.players} onAddPlayer={onAddPlayer} onDeletePlayer={onDeletePlayer} />} />
        <Route path="/assess" element={<NewAssessment players={appData.players} onSaveAssessment={onSaveAssessment} />} />
        <Route path="/reports" element={<Reports players={appData.players} assessments={appData.assessments} />} />
        <Route path="/export" element={<ExportData appData={appData} onImport={onImportData} onClear={onClearData} />} />
        {/* Catch-all route to redirect to dashboard */}
        <Route path="*" element={<Dashboard players={appData.players} assessments={appData.assessments} />} />
      </Routes>
    </Suspense>
  );
}
