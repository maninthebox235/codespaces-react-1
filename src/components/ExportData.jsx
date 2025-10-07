import React, { useState } from 'react';

const ExportData = ({ appData, onImport, onClear }) => {
  const exportToJSON = () => {
    const dataStr = JSON.stringify(appData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `hockey-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const importFromJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (window.confirm('This will replace all current data. Continue?')) {
          onImport(imported);
        }
      } catch (error) {
        alert('Error importing file: ' + error.message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h2>Export Data</h2>
      
      <p style={{ color: '#718096', marginBottom: '30px' }}>
        Export all player data and assessments for backup or analysis.
      </p>

      <div className="export-buttons">
        <button className="btn" onClick={exportToJSON}>
          📥 Export as JSON
        </button>
        <label className="btn btn-secondary">
          📤 Import from JSON
          <input
            type="file"
            accept="application/json"
            style={{ display: 'none' }}
            onChange={importFromJSON}
          />
        </label>
        <button 
          className="btn btn-danger"
          onClick={() => {
            if (window.confirm('⚠️ This will permanently delete ALL players and assessments. This cannot be undone. Are you sure?')) {
              if (window.confirm('Really sure? This is your last chance!')) {
                onClear();
              }
            }
          }}
        >
          🗑️ Clear All Data
        </button>
      </div>
    </div>
  );
};

export default ExportData;