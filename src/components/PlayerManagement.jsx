import React, { useState } from 'react';

const PlayerManagement = ({ players, onAddPlayer, onDeletePlayer }) => {
  const [playerName, setPlayerName] = useState('');
  const [playerAge, setPlayerAge] = useState('');
  const [playerPosition, setPlayerPosition] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playerName || !playerAge || !playerPosition) {
      alert('Please fill in all required fields');
      return;
    }

    const newPlayer = {
      name: playerName,
      age_group: playerAge,
      position: playerPosition
    };

    onAddPlayer(newPlayer);
    setPlayerName('');
    setPlayerAge('');
    setPlayerPosition('');
  };

  return (
    <div>
      <h2>Player Management</h2>
      
      <div className="player-form">
        <h3>Add New Player</h3>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="form-group">
              <label>Player Name *</label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter full name"
              />
            </div>
            <div className="form-group">
              <label>Age Group *</label>
              <select value={playerAge} onChange={(e) => setPlayerAge(e.target.value)}>
                <option value="">Select...</option>
                <option value="Mite">Mite</option>
                <option value="Squirt">Squirt</option>
                <option value="PeeWee">PeeWee</option>
                <option value="Bantam">Bantam</option>
                <option value="U16">U16</option>
                <option value="U18">U18</option>
              </select>
            </div>
            <div className="form-group">
              <label>Position *</label>
              <select value={playerPosition} onChange={(e) => setPlayerPosition(e.target.value)}>
                <option value="">Select...</option>
                <option value="Goalie">Goalie</option>
                <option value="Defense">Defense</option>
                <option value="Forward">Forward</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn">Add Player</button>
        </form>
      </div>

      <h3>Current Players</h3>
      <div className="players-list">
        {players.length === 0 ? (
          <div className="empty-state">
            <h3>No Players Added Yet</h3>
            <p>Add your first player using the form above</p>
          </div>
        ) : (
          players.map(player => (
            <div key={player.id} className="player-card">
              <h3>{player.name}</h3>
              <p><strong>Age Group:</strong> {player.age_group} | <strong>Position:</strong> {player.position}</p>
              <button
                className="btn btn-danger"
                onClick={() => onDeletePlayer(player.id)}
              >
                Delete Player
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlayerManagement;