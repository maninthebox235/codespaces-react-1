import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const getRandomColor = () => {
  const colors = [
    '#4299E1', // blue
    '#48BB78', // green
    '#ED8936', // orange
    '#9F7AEA', // purple
    '#F56565', // red
    '#38B2AC', // teal
    '#ED64A6', // pink
    '#ECC94B'  // yellow
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

const PlayerProgress = ({ playerId, assessments, selectedSeason = 'all', players }) => {
  const [chartData, setChartData] = useState(null);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const currentPlayer = players.find(p => p.id === playerId);
    setPlayer(currentPlayer);

    let playerAssessments = assessments
      .filter(a => a.player_id === playerId)
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    // Filter by season if not "all"
    if (selectedSeason !== 'all') {
      playerAssessments = playerAssessments.filter(a => a.season === selectedSeason);
    }

    const datasets = generateDatasets(playerAssessments);
    setChartData(datasets);
  }, [playerId, assessments, selectedSeason, players]);

  const generateDatasets = (playerAssessments) => {
    if (!playerAssessments.length) return null;

    const labels = playerAssessments.map(a => new Date(a.date).toLocaleDateString());
    const datasets = Object.keys(playerAssessments[0].skill_ratings).map(category => ({
      label: category.charAt(0).toUpperCase() + category.slice(1),
      data: playerAssessments.map(a => {
        const skills = Object.values(a.skill_ratings[category]);
        return skills.reduce((sum, val) => sum + val, 0) / skills.length;
      }),
      borderColor: getRandomColor(),
      fill: false,
      tension: 0.3
    }));

    return {
      labels,
      datasets
    };
  };

  if (!player) return <div>No player selected</div>;
  if (!chartData) return <div>No assessment data available for {player.name}</div>;

  const chartTitle = selectedSeason === 'all'
    ? 'Skill Development Over Time'
    : `Skill Development - ${selectedSeason} Season`;

  return (
    <div className="player-progress">
      <h3>{player.name}'s Progress {selectedSeason !== 'all' && `(${selectedSeason})`}</h3>
      <p>Position: {player.position} | Age Group: {player.age_group}</p>

      <div style={{ height: '400px', marginTop: '20px' }}>
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                max: 10,
                title: {
                  display: true,
                  text: 'Skill Level'
                }
              },
              x: {
                title: {
                  display: true,
                  text: 'Assessment Date'
                }
              }
            },
            plugins: {
              title: {
                display: true,
                text: chartTitle,
                font: {
                  size: 16
                }
              },
              legend: {
                position: 'bottom'
              },
              tooltip: {
                callbacks: {
                  label: function(context) {
                    return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}/10`;
                  }
                }
              }
            }
          }}
        />
      </div>

      {chartData.datasets.length > 0 && (
        <div className="progress-summary" style={{ marginTop: '20px' }}>
          <h4>Latest Assessment Summary</h4>
          <div className="skill-grid">
            {chartData.datasets.map(dataset => {
              const latestValue = dataset.data[dataset.data.length - 1];
              const previousValue = dataset.data[dataset.data.length - 2];
              const improvement = previousValue ? (latestValue - previousValue).toFixed(1) : null;
              
              return (
                <div key={dataset.label} className="skill-summary">
                  <strong>{dataset.label}:</strong> {latestValue.toFixed(1)}/10
                  {improvement && (
                    <span className={`change ${improvement > 0 ? 'positive' : improvement < 0 ? 'negative' : ''}`}>
                      {improvement > 0 ? '+' : ''}{improvement}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerProgress;