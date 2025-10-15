import React, { useMemo } from 'react';
import { getCurrentSeason } from '../utils/seasonHelper';

const Dashboard = ({ players, assessments }) => {
  const currentSeason = getCurrentSeason();

  const recentAssessments = [...assessments]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const currentSeasonAssessments = useMemo(() =>
    assessments.filter(a => a.season === currentSeason),
    [assessments, currentSeason]
  );

  return (
    <div>
      <h2>Dashboard</h2>

      <div className="stats-overview">
        <div className="stat-box">
          <h4>{players.length}</h4>
          <p>Total Players</p>
        </div>
        <div className="stat-box">
          <h4>{assessments.length}</h4>
          <p>Total Assessments</p>
        </div>
        <div className="stat-box">
          <h4>{currentSeasonAssessments.length}</h4>
          <p>{currentSeason} Season</p>
        </div>
        <div className="stat-box">
          <h4>{players.filter(p => p.position === 'Goalie').length}</h4>
          <p>Goalies</p>
        </div>
      </div>

      <h3>Recent Assessments</h3>
      <div className="recent-assessments">
        {recentAssessments.length === 0 ? (
          <div className="empty-state">
            <h3>No Assessments Yet</h3>
            <p>Conduct your first assessment from the New Assessment tab</p>
          </div>
        ) : (
          recentAssessments.map(assessment => {
            const player = players.find(p => p.id === assessment.player_id || p.id === assessment.playerId);
            return (
              <div key={assessment.id} className="player-card">
                <h3>{player ? player.name : 'Unknown Player'}</h3>
                <p><strong>Season:</strong> {assessment.season || 'Not specified'} | <strong>Type:</strong> {assessment.type} | <strong>Date:</strong> {assessment.date}</p>
                {assessment.metrics.overallSavePct && <p><strong>Overall Save %:</strong> {assessment.metrics.overallSavePct}%</p>}
                <p><strong>Assessor:</strong> {assessment.assessor}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Dashboard;