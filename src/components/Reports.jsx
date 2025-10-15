import React, { useState, useMemo } from 'react';
import PlayerProgress from './PlayerProgress';

const Reports = ({ players, assessments }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedSeason, setSelectedSeason] = useState('all');

  // Get unique seasons from assessments for the filter
  const availableSeasons = useMemo(() => {
    const seasons = new Set(assessments.map(a => a.season).filter(Boolean));
    return ['all', ...Array.from(seasons).sort().reverse()];
  }, [assessments]);

  const generateReport = () => {
    if (!selectedPlayer) return null;

    const player = players.find(p => p.id === selectedPlayer);
    let playerAssessments = assessments
      .filter(a => a.player_id === selectedPlayer || a.playerId === selectedPlayer) // Support both field names
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Filter by season if not "all"
    if (selectedSeason !== 'all') {
      playerAssessments = playerAssessments.filter(a => a.season === selectedSeason);
    }

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
        <p><strong>Position:</strong> {player.position} | <strong>Age Group:</strong> {player.age_group}</p>
        <p><strong>Total Assessments:</strong> {playerAssessments.length}</p>
        
        <h4>Assessment History {selectedSeason !== 'all' && `(${selectedSeason} Season)`}</h4>
        {playerAssessments.map((assessment, index) => (
          <div key={assessment.id} className="assessment-detail" style={{marginBottom: '30px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px'}}>
            <h5>Assessment #{index + 1} - {assessment.date} ({assessment.type})</h5>
            <p><strong>Season:</strong> {assessment.season || 'Not specified'} | <strong>Assessor:</strong> {assessment.assessor}</p>

            {player.position === 'Goalie' ? (
              <>
                <h6>Save Percentages</h6>
                <div className="assessment-grid">
                  <div><strong>Glove High:</strong> {assessment.metrics.gloveHigh}/20</div>
                  <div><strong>Glove Low:</strong> {assessment.metrics.gloveLow}/20</div>
                  <div><strong>Blocker High:</strong> {assessment.metrics.blockerHigh}/20</div>
                  <div><strong>Blocker Low:</strong> {assessment.metrics.blockerLow}/20</div>
                  <div><strong>Five Hole:</strong> {assessment.metrics.fiveHole}/20</div>
                  <div><strong>Overall:</strong> {assessment.metrics.overallSavePct}%</div>
                </div>
                <h6>Performance Metrics</h6>
                <div className="assessment-grid">
                  <div><strong>Recovery Time:</strong> {assessment.metrics.recoveryTime}s</div>
                  <div><strong>Depth Management:</strong> {assessment.metrics.depthScore}/5</div>
                  <div><strong>Angle Management:</strong> {assessment.metrics.angleScore}/5</div>
                  <div><strong>Rebound Control:</strong> {assessment.metrics.reboundControl}/30</div>
                  <div><strong>Lateral Movement:</strong> {assessment.metrics.lateralMovement}s</div>
                </div>
              </>
            ) : (
              <>
                <h6>Skater Metrics</h6>
                <div className="assessment-grid">
                  <div><strong>Skating Speed:</strong> {assessment.metrics.skating_speed}/10</div>
                  <div><strong>Edgework:</strong> {assessment.metrics.skating_edgework}/10</div>
                  <div><strong>Shot Accuracy:</strong> {assessment.metrics.shot_accuracy}/10</div>
                  <div><strong>Shot Power:</strong> {assessment.metrics.shot_power}/10</div>
                  <div><strong>Stickhandling:</strong> {assessment.metrics.stickhandling}/10</div>
                  <div><strong>Passing Accuracy:</strong> {assessment.metrics.passing_accuracy}/10</div>
                  <div><strong>Hockey IQ:</strong> {assessment.metrics.hockey_iq}/10</div>
                  <div><strong>Physical Strength:</strong> {assessment.metrics.physical_strength}/10</div>
                </div>
              </>
            )}

            {assessment.skill_ratings && Object.keys(assessment.skill_ratings).length > 0 && (
              <>
                <h6>Skill Ratings</h6>
                {Object.entries(assessment.skill_ratings).map(([category, skills]) => (
                  <div key={category} style={{marginBottom: '10px'}}>
                    <strong>{category.charAt(0).toUpperCase() + category.slice(1).replace(/_/g, ' ')}:</strong>
                    <div className="assessment-grid">
                      {Object.entries(skills).map(([skill, value]) => (
                        <div key={skill}>{skill.replace(/_/g, ' ')}: {value}/10</div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}

            {assessment.notes && (
              <div style={{marginTop: '15px'}}>
                <h6>Notes</h6>
                {assessment.notes.strengths && <p><strong>Strengths:</strong> {assessment.notes.strengths}</p>}
                {assessment.notes.devAreas && <p><strong>Development Areas:</strong> {assessment.notes.devAreas}</p>}
                {assessment.notes.goals && <p><strong>Goals:</strong> {assessment.notes.goals}</p>}
                {assessment.notes.comments && <p><strong>Comments:</strong> {assessment.notes.comments}</p>}
              </div>
            )}
          </div>
        ))}

        {playerAssessments.length >= 2 && player.position === 'Goalie' && (
          <div style={{marginTop: '30px'}}>
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
        
        <button className="btn" onClick={() => window.print()}>🖨️ Print Report</button>
      </div>
    );
  };

  return (
    <div>
      <h2>Player Reports</h2>

      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px'}}>
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

        <div className="form-group">
          <label>Filter by Season</label>
          <select
            value={selectedSeason}
            onChange={(e) => setSelectedSeason(e.target.value)}
          >
            <option value="all">All Seasons</option>
            {availableSeasons.filter(s => s !== 'all').map(season => (
              <option key={season} value={season}>{season}</option>
            ))}
          </select>
        </div>
      </div>

      {selectedPlayer && (
        <div>
          <PlayerProgress
            playerId={selectedPlayer}
            assessments={assessments}
            selectedSeason={selectedSeason}
            players={players}
          />
          <div style={{ marginTop: '40px' }}>
            {generateReport()}
          </div>
        </div>
      )}
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