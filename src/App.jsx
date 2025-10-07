import { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import PlayerManagement from './components/PlayerManagement';
import NewAssessment from './components/NewAssessment';
import Reports from './components/Reports';
import ExportData from './components/ExportData';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [appData, setAppData] = useState({
    players: [],
    assessments: []
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('hockeyTrackerData');
    if (savedData) {
      setAppData(JSON.parse(savedData));
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hockeyTrackerData', JSON.stringify(appData));
  }, [appData]);

  const handleAddPlayer = (newPlayer) => {
    setAppData(prev => ({
      ...prev,
      players: [...prev.players, newPlayer]
    }));
  };

  const handleDeletePlayer = (playerId) => {
    if (!window.confirm('Are you sure you want to delete this player and all their assessments?')) {
      return;
    }
    setAppData(prev => ({
      players: prev.players.filter(p => p.id !== playerId),
      assessments: prev.assessments.filter(a => a.playerId !== playerId)
    }));
  };

  const handleSaveAssessment = (assessment) => {
    setAppData(prev => ({
      ...prev,
      assessments: [...prev.assessments, assessment]
    }));
    setActiveTab('dashboard');
  };

  const handleImportData = (importedData) => {
    setAppData(importedData);
  };

  const handleClearData = () => {
    setAppData({ players: [], assessments: [] });
  };

  return (
    <div className="App">
      <div className="container">
        <div className="header">
          <h1>🏒 Hockey Baseline Development Tracker</h1>
          <p>Individual player development tracking system - Measuring progress, not rankings</p>
        </div>

        <div className="nav-tabs">
          <button 
            className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`nav-tab ${activeTab === 'players' ? 'active' : ''}`}
            onClick={() => setActiveTab('players')}
          >
            Players
          </button>
          <button 
            className={`nav-tab ${activeTab === 'assess' ? 'active' : ''}`}
            onClick={() => setActiveTab('assess')}
          >
            New Assessment
          </button>
          <button 
            className={`nav-tab ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Reports
          </button>
          <button 
            className={`nav-tab ${activeTab === 'export' ? 'active' : ''}`}
            onClick={() => setActiveTab('export')}
          >
            Export Data
          </button>
        </div>

        <div className="content-section active">
          {activeTab === 'dashboard' && (
            <Dashboard 
              players={appData.players}
              assessments={appData.assessments}
            />
          )}
          {activeTab === 'players' && (
            <PlayerManagement 
              players={appData.players}
              onAddPlayer={handleAddPlayer}
              onDeletePlayer={handleDeletePlayer}
            />
          )}
          {activeTab === 'assess' && (
            <NewAssessment 
              players={appData.players}
              onSaveAssessment={handleSaveAssessment}
            />
          )}
          {activeTab === 'reports' && (
            <Reports 
              players={appData.players}
              assessments={appData.assessments}
            />
          )}
          {activeTab === 'export' && (
            <ExportData 
              appData={appData}
              onImport={handleImportData}
              onClear={handleClearData}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
