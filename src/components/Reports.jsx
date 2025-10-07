import React, { useState } from 'react';

const Reports = ({ players, assessments }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('');

  const generateReport = () => {
    if (!selectedPlayer) return null;

    const player = players.find(p => p.id === selectedPlayer);
    const playerAssessments = assessments
      .filter(a => a.playerId === selectedPlayer)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    if (!player || playerAssessments.length === 0) {
      return (
        <div className="empty-state">
          <h3>No Assessments Found</h3>
          <p>This player hasn't been assessed yet</p>
        </div>
      );
    }

    const latest = playerAssessments[playerAssessments.length - 1];

    return (
      <div className="report-section">
        <h3>{player.name} - Development Report</h3>
        <p><strong>Position:</strong> {player.position} | <strong>Age Group:</strong> {player.age}</p>
        <p><strong>Total Assessments:</strong> {playerAssessments.length}</p>
        
        <h4>Assessment History</h4>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Save %</th>
              <th>Recovery (s)</th>
              <th>Rebound Control</th>
              <th>Assessor</th>
            </tr>
          </thead>
          <tbody>
            {playerAssessments.map(assessment => (
              <tr key={assessment.id}>
                <td>{assessment.date}</td>
                <td>{assessment.type}</td>
                <td>{assessment.metrics.overallSavePct}%</td>
                <td>{assessment.metrics.recoveryTime}</td>
                <td>{assessment.metrics.reboundControl}/30</td>
                <td>{assessment.assessor}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {playerAssessments.length >= 2 && (
          <div>
            <h4>Progress Summary</h4>
            <div className="assessment-grid">
              <ProgressMetric
                title="Save Percentage"
                first={playerAssessments[0].metrics.overallSavePct}
                last={latest.metrics.overallSavePct}
                unit="%"
                higherIsBetter={true}
              />
              <ProgressMetric
                title="Recovery Time"
                first={playerAssessments[0].metrics.recoveryTime}
                last={latest.metrics.recoveryTime}
                unit="s"
                higherIsBetter={false}
              />
            </div>
          </div>
        )}

        <h4>Latest Assessment Notes</h4>
        <div className="latest-notes">
          <p><strong>Date:</strong> {latest.date} ({latest.type})</p>
          {latest.notes.strengths && <p><strong>Strengths:</strong> {latest.notes.strengths}</p>}
          {latest.notes.devAreas && <p><strong>Development Areas:</strong> {latest.notes.devAreas}</p>}
          {latest.notes.goals && <p><strong>Goals:</strong> {latest.notes.goals}</p>}
          {latest.notes.comments && <p><strong>Coach Comments:</strong> {latest.notes.comments}</p>}
        </div>
        
        <button className="btn" onClick={() => window.print()}>🖨️ Print Report</button>
      </div>
    );
  };

  return (
    <div>
      <h2>Player Reports</h2>
      
      <div className="form-group">
        <label>Select Player</label>
        <select 
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value)}
        >
          <option value="">Choose a player...</option>
          {players.map(player => (
            <option key={player.id} value={player.id}>{player.name}</option>
          ))}
        </select>
      </div>

      {generateReport()}
    </div>
  );
};

const ProgressMetric = ({ title, first, last, unit, higherIsBetter }) => {
  const change = (parseFloat(last) - parseFloat(first)).toFixed(1);
  const isPositive = higherIsBetter ? change >= 0 : change <= 0;
  
  return (
    <div className="metric-card">
      <h4>{title}</h4>
      <p>{first}{unit} → {last}{unit}</p>
      <span className={`progress-indicator ${isPositive ? 'progress-positive' : 'progress-negative'}`}>
        {change >= 0 ? '+' : ''}{change}{unit}
      </span>
    </div>
  );
};

export default Reports;