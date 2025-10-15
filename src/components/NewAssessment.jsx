import React, { useState } from 'react';
import { getCurrentSeason, getSeasonFromDate, getSeasonOptions } from '../utils/seasonHelper';

const NewAssessment = ({ players, onSaveAssessment }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const [selectedPlayerData, setSelectedPlayerData] = useState(null);
  const [assessmentData, setAssessmentData] = useState({
    type: 'Baseline',
    date: new Date().toISOString().split('T')[0],
    season: getCurrentSeason(),
    assessor: '',
    metrics: {},
    skill_ratings: {},
    notes: {
      strengths: '',
      devAreas: '',
      goals: '',
      comments: ''
    }
  });

  // Position-specific metrics and skills
  const getMetricsForPosition = (position) => {
    if (position === 'Goalie') {
      return {
        gloveHigh: '',
        gloveLow: '',
        blockerHigh: '',
        blockerLow: '',
        fiveHole: '',
        recoveryTime: '',
        depthScore: '',
        angleScore: '',
        reboundControl: '',
        lateralMovement: ''
      };
    } else {
      // Skaters (Forward and Defense)
      return {
        skating_speed: '',
        skating_edgework: '',
        shot_accuracy: '',
        shot_power: '',
        stickhandling: '',
        passing_accuracy: '',
        hockey_iq: '',
        physical_strength: ''
      };
    }
  };

  const getSkillRatingsForPosition = (position) => {
    if (position === 'Goalie') {
      return {
        technical: {
          stance: 5,
          butterfly: 5,
          recovery: 5,
          tracking: 5
        },
        positioning: {
          depth: 5,
          angle: 5,
          post_play: 5,
          coverage: 5
        },
        mental: {
          focus: 5,
          composure: 5,
          decision_making: 5,
          communication: 5
        }
      };
    } else {
      // Skaters
      return {
        skating: {
          speed: 5,
          agility: 5,
          acceleration: 5,
          balance: 5
        },
        stickhandling: {
          control: 5,
          protection: 5,
          deking: 5
        },
        shooting: {
          accuracy: 5,
          power: 5,
          release: 5
        },
        gameplay: {
          hockey_sense: 5,
          positioning: 5,
          teamwork: 5
        }
      };
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPlayer) {
      alert('Please select a player');
      return;
    }

    let metrics = { ...assessmentData.metrics };

    // Calculate overall save percentage for goalies
    if (selectedPlayerData?.position === 'Goalie') {
      const gloveHigh = parseInt(metrics.gloveHigh) || 0;
      const gloveLow = parseInt(metrics.gloveLow) || 0;
      const blockerHigh = parseInt(metrics.blockerHigh) || 0;
      const blockerLow = parseInt(metrics.blockerLow) || 0;
      const fiveHole = parseInt(metrics.fiveHole) || 0;

      const totalSaves = gloveHigh + gloveLow + blockerHigh + blockerLow + fiveHole;
      metrics.overallSavePct = ((totalSaves / 100) * 100).toFixed(1);
    }

    const assessment = {
      playerId: selectedPlayer,
      ...assessmentData,
      metrics
    };

    onSaveAssessment(assessment);
    resetForm();
  };

  const resetForm = () => {
    setSelectedPlayer('');
    setSelectedPlayerData(null);
    setAssessmentData({
      type: 'Baseline',
      date: new Date().toISOString().split('T')[0],
      season: getCurrentSeason(),
      assessor: '',
      metrics: {},
      skill_ratings: {},
      notes: {
        strengths: '',
        devAreas: '',
        goals: '',
        comments: ''
      }
    });
  };

  const handlePlayerSelection = (playerId) => {
    setSelectedPlayer(playerId);
    const player = players.find(p => p.id === playerId);
    setSelectedPlayerData(player);

    if (player) {
      setAssessmentData(prev => ({
        ...prev,
        metrics: getMetricsForPosition(player.position),
        skill_ratings: getSkillRatingsForPosition(player.position)
      }));
    }
  };

  const handleChange = (e, section, field) => {
    const value = e.target.value;
    if (section) {
      setAssessmentData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      setAssessmentData(prev => {
        const updated = {
          ...prev,
          [field]: value
        };
        // Auto-update season when date changes
        if (field === 'date' && value) {
          updated.season = getSeasonFromDate(value);
        }
        return updated;
      });
    }
  };

  return (
    <div>
      <h2>New Assessment</h2>
      
      <div className="form-group">
        <label>Select Player *</label>
        <select
          value={selectedPlayer}
          onChange={(e) => handlePlayerSelection(e.target.value)}
        >
          <option value="">Choose a player...</option>
          {players.map(player => (
            <option key={player.id} value={player.id}>
              {player.name} ({player.position})
            </option>
          ))}
        </select>
      </div>

      {selectedPlayer && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Assessment Type *</label>
            <select
              value={assessmentData.type}
              onChange={(e) => handleChange(e, null, 'type')}
            >
              <option value="Baseline">Baseline</option>
              <option value="Mid-Season">Mid-Season</option>
              <option value="End-Season">End-Season</option>
            </select>
          </div>

          <div className="form-group">
            <label>Assessment Date *</label>
            <input
              type="date"
              value={assessmentData.date}
              onChange={(e) => handleChange(e, null, 'date')}
            />
          </div>

          <div className="form-group">
            <label>Season *</label>
            <select
              value={assessmentData.season}
              onChange={(e) => handleChange(e, null, 'season')}
            >
              {getSeasonOptions().map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
            <small style={{color: '#666', fontSize: '0.9em'}}>Auto-updates based on assessment date</small>
          </div>

          <div className="form-group">
            <label>Assessor Name *</label>
            <input
              type="text"
              value={assessmentData.assessor}
              onChange={(e) => handleChange(e, null, 'assessor')}
              placeholder="Coach name"
            />
          </div>

          {selectedPlayerData?.position === 'Goalie' ? (
            <>
              <h3>Save Percentage by Location</h3>
              <div className="assessment-grid">
                {['gloveHigh', 'gloveLow', 'blockerHigh', 'blockerLow', 'fiveHole'].map(metric => (
                  <div key={metric} className="metric-card">
                    <h4>{metric.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                    <label>Saves Made (out of 20)</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={assessmentData.metrics[metric]}
                      onChange={(e) => handleChange(e, 'metrics', metric)}
                      placeholder="0-20"
                    />
                  </div>
                ))}
              </div>

              <h3>Other Goalie Metrics</h3>
              <div className="assessment-grid">
                <div className="metric-card">
                  <h4>Recovery Time (seconds)</h4>
                  <label>Average of 5 trials</label>
                  <input
                    type="number"
                    step="0.1"
                    value={assessmentData.metrics.recoveryTime}
                    onChange={(e) => handleChange(e, 'metrics', 'recoveryTime')}
                    placeholder="e.g., 1.5"
                  />
                </div>
                <div className="metric-card">
                  <h4>Depth Management (1-5)</h4>
                  <label>1=Poor, 5=Optimal</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={assessmentData.metrics.depthScore}
                    onChange={(e) => handleChange(e, 'metrics', 'depthScore')}
                    placeholder="1-5"
                  />
                </div>
                <div className="metric-card">
                  <h4>Angle Management (1-5)</h4>
                  <label>1=Poor, 5=Perfect</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={assessmentData.metrics.angleScore}
                    onChange={(e) => handleChange(e, 'metrics', 'angleScore')}
                    placeholder="1-5"
                  />
                </div>
                <div className="metric-card">
                  <h4>Rebound Control (points)</h4>
                  <label>Out of 30 points</label>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    value={assessmentData.metrics.reboundControl}
                    onChange={(e) => handleChange(e, 'metrics', 'reboundControl')}
                    placeholder="0-30"
                  />
                </div>
                <div className="metric-card">
                  <h4>Lateral Movement (seconds)</h4>
                  <label>Post-to-post average</label>
                  <input
                    type="number"
                    step="0.1"
                    value={assessmentData.metrics.lateralMovement}
                    onChange={(e) => handleChange(e, 'metrics', 'lateralMovement')}
                    placeholder="e.g., 2.3"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <h3>Skater Performance Metrics</h3>
              <div className="assessment-grid">
                <div className="metric-card">
                  <h4>Skating Speed (1-10)</h4>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={assessmentData.metrics.skating_speed}
                    onChange={(e) => handleChange(e, 'metrics', 'skating_speed')}
                    placeholder="1-10"
                  />
                </div>
                <div className="metric-card">
                  <h4>Edgework (1-10)</h4>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={assessmentData.metrics.skating_edgework}
                    onChange={(e) => handleChange(e, 'metrics', 'skating_edgework')}
                    placeholder="1-10"
                  />
                </div>
                <div className="metric-card">
                  <h4>Shot Accuracy (1-10)</h4>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={assessmentData.metrics.shot_accuracy}
                    onChange={(e) => handleChange(e, 'metrics', 'shot_accuracy')}
                    placeholder="1-10"
                  />
                </div>
                <div className="metric-card">
                  <h4>Shot Power (1-10)</h4>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={assessmentData.metrics.shot_power}
                    onChange={(e) => handleChange(e, 'metrics', 'shot_power')}
                    placeholder="1-10"
                  />
                </div>
                <div className="metric-card">
                  <h4>Stickhandling (1-10)</h4>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={assessmentData.metrics.stickhandling}
                    onChange={(e) => handleChange(e, 'metrics', 'stickhandling')}
                    placeholder="1-10"
                  />
                </div>
                <div className="metric-card">
                  <h4>Passing Accuracy (1-10)</h4>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={assessmentData.metrics.passing_accuracy}
                    onChange={(e) => handleChange(e, 'metrics', 'passing_accuracy')}
                    placeholder="1-10"
                  />
                </div>
                <div className="metric-card">
                  <h4>Hockey IQ (1-10)</h4>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={assessmentData.metrics.hockey_iq}
                    onChange={(e) => handleChange(e, 'metrics', 'hockey_iq')}
                    placeholder="1-10"
                  />
                </div>
                <div className="metric-card">
                  <h4>Physical Strength (1-10)</h4>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={assessmentData.metrics.physical_strength}
                    onChange={(e) => handleChange(e, 'metrics', 'physical_strength')}
                    placeholder="1-10"
                  />
                </div>
              </div>
            </>
          )}

          <h3>Skill Ratings</h3>
          {Object.entries(assessmentData.skill_ratings).map(([category, skills]) => (
            <div key={category} className="skill-category">
              <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
              <div className="assessment-grid">
                {Object.entries(skills).map(([skill, value]) => (
                  <div key={skill} className="metric-card">
                    <h4>{skill.charAt(0).toUpperCase() + skill.slice(1)}</h4>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      step="0.5"
                      value={value}
                      onChange={(e) => {
                        setAssessmentData(prev => ({
                          ...prev,
                          skill_ratings: {
                            ...prev.skill_ratings,
                            [category]: {
                              ...prev.skill_ratings[category],
                              [skill]: parseFloat(e.target.value)
                            }
                          }
                        }));
                      }}
                    />
                    <div style={{ textAlign: 'center', marginTop: '5px' }}>
                      {value}/10
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <h3>Notes & Goals</h3>
          <div className="form-group">
            <label>Strengths Observed</label>
            <textarea
              value={assessmentData.notes.strengths}
              onChange={(e) => handleChange(e, 'notes', 'strengths')}
              placeholder="What did the player do well?"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Development Areas</label>
            <textarea
              value={assessmentData.notes.devAreas}
              onChange={(e) => handleChange(e, 'notes', 'devAreas')}
              placeholder="What areas need improvement?"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Goals for Next Assessment</label>
            <textarea
              value={assessmentData.notes.goals}
              onChange={(e) => handleChange(e, 'notes', 'goals')}
              placeholder="What specific goals should the player work toward?"
              rows="3"
            />
          </div>
          <div className="form-group">
            <label>Coach Comments</label>
            <textarea
              value={assessmentData.notes.comments}
              onChange={(e) => handleChange(e, 'notes', 'comments')}
              placeholder="Additional feedback or observations"
              rows="3"
            />
          </div>

          <div className="button-group">
            <button type="submit" className="btn">Save Assessment</button>
            <button type="button" className="btn btn-secondary" onClick={resetForm}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default NewAssessment;