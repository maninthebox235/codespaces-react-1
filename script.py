
# Create the main HTML application file with embedded CSS and JavaScript
html_app = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hockey Baseline Development Tracker</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            background: white;
            border-radius: 12px;
            padding: 30px;
            margin-bottom: 20px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header h1 {
            color: #2d3748;
            font-size: 28px;
            margin-bottom: 10px;
        }

        .header p {
            color: #718096;
            font-size: 14px;
        }

        .nav-tabs {
            display: flex;
            gap: 10px;
            margin-bottom: 20px;
            flex-wrap: wrap;
        }

        .nav-tab {
            background: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            color: #4a5568;
            transition: all 0.3s;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .nav-tab:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .nav-tab.active {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
        }

        .content-section {
            display: none;
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .content-section.active {
            display: block;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #2d3748;
            font-size: 14px;
        }

        input, select, textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.3s;
        }

        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
        }

        .input-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }

        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: transform 0.2s;
            margin-right: 10px;
            margin-top: 10px;
        }

        .btn:hover {
            transform: translateY(-2px);
        }

        .btn-secondary {
            background: #718096;
        }

        .btn-danger {
            background: #e53e3e;
        }

        .player-card {
            background: #f7fafc;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 15px;
            border-left: 4px solid #667eea;
            cursor: pointer;
            transition: all 0.3s;
        }

        .player-card:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .player-card h3 {
            color: #2d3748;
            margin-bottom: 8px;
        }

        .player-card p {
            color: #718096;
            font-size: 14px;
            margin: 4px 0;
        }

        .assessment-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }

        .metric-card {
            background: #f7fafc;
            padding: 15px;
            border-radius: 8px;
            border: 2px solid #e2e8f0;
        }

        .metric-card h4 {
            color: #2d3748;
            margin-bottom: 10px;
            font-size: 14px;
        }

        .progress-indicator {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            margin-left: 10px;
        }

        .progress-positive {
            background: #c6f6d5;
            color: #22543d;
        }

        .progress-negative {
            background: #fed7d7;
            color: #742a2a;
        }

        .report-section {
            margin-top: 30px;
            padding: 20px;
            background: #f7fafc;
            border-radius: 8px;
        }

        .report-section h3 {
            color: #2d3748;
            margin-bottom: 15px;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
        }

        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #e2e8f0;
        }

        th {
            background: #edf2f7;
            font-weight: 600;
            color: #2d3748;
        }

        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #718096;
        }

        .empty-state h3 {
            margin-bottom: 10px;
            color: #4a5568;
        }

        @media (max-width: 768px) {
            .input-group {
                grid-template-columns: 1fr;
            }
            
            .assessment-grid {
                grid-template-columns: 1fr;
            }
        }

        .export-buttons {
            margin-top: 20px;
            padding-top: 20px;
            border-top: 2px solid #e2e8f0;
        }

        .stats-overview {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }

        .stat-box {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
        }

        .stat-box h4 {
            font-size: 32px;
            margin-bottom: 5px;
        }

        .stat-box p {
            font-size: 12px;
            opacity: 0.9;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏒 Hockey Baseline Development Tracker</h1>
            <p>Individual player development tracking system - Measuring progress, not rankings</p>
        </div>

        <div class="nav-tabs">
            <button class="nav-tab active" onclick="showTab('dashboard')">Dashboard</button>
            <button class="nav-tab" onclick="showTab('players')">Players</button>
            <button class="nav-tab" onclick="showTab('assess')">New Assessment</button>
            <button class="nav-tab" onclick="showTab('reports')">Reports</button>
            <button class="nav-tab" onclick="showTab('export')">Export Data</button>
        </div>

        <!-- Dashboard Section -->
        <div id="dashboard" class="content-section active">
            <h2 style="margin-bottom: 20px;">Dashboard</h2>
            <div class="stats-overview" id="statsOverview"></div>
            <h3 style="margin: 30px 0 15px 0;">Recent Assessments</h3>
            <div id="recentAssessments"></div>
        </div>

        <!-- Players Section -->
        <div id="players" class="content-section">
            <h2 style="margin-bottom: 20px;">Player Management</h2>
            
            <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="margin-bottom: 15px;">Add New Player</h3>
                <div class="input-group">
                    <div class="form-group">
                        <label>Player Name *</label>
                        <input type="text" id="playerName" placeholder="Enter full name">
                    </div>
                    <div class="form-group">
                        <label>Age Group *</label>
                        <select id="playerAge">
                            <option value="">Select...</option>
                            <option value="Mite">Mite</option>
                            <option value="Squirt">Squirt</option>
                            <option value="PeeWee">PeeWee</option>
                            <option value="Bantam">Bantam</option>
                            <option value="U16">U16</option>
                            <option value="U18">U18</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Position *</label>
                        <select id="playerPosition">
                            <option value="">Select...</option>
                            <option value="Goalie">Goalie</option>
                            <option value="Defense">Defense</option>
                            <option value="Forward">Forward</option>
                        </select>
                    </div>
                </div>
                <button class="btn" onclick="addPlayer()">Add Player</button>
            </div>

            <h3 style="margin-bottom: 15px;">Current Players</h3>
            <div id="playersList"></div>
        </div>

        <!-- Assessment Section -->
        <div id="assess" class="content-section">
            <h2 style="margin-bottom: 20px;">New Assessment</h2>
            
            <div class="form-group">
                <label>Select Player *</label>
                <select id="assessPlayer" onchange="loadPlayerForAssessment()">
                    <option value="">Choose a player...</option>
                </select>
            </div>

            <div id="assessmentForm" style="display: none;">
                <div class="form-group">
                    <label>Assessment Type *</label>
                    <select id="assessType">
                        <option value="Baseline">Baseline</option>
                        <option value="Mid-Season">Mid-Season</option>
                        <option value="End-Season">End-Season</option>
                    </select>
                </div>

                <div class="form-group">
                    <label>Assessment Date *</label>
                    <input type="date" id="assessDate">
                </div>

                <div class="form-group">
                    <label>Assessor Name *</label>
                    <input type="text" id="assessor" placeholder="Coach name">
                </div>

                <h3 style="margin: 30px 0 15px 0;">Save Percentage by Location</h3>
                <div class="assessment-grid">
                    <div class="metric-card">
                        <h4>Glove High</h4>
                        <label style="font-size: 12px;">Saves Made (out of 20)</label>
                        <input type="number" id="gloveHigh" min="0" max="20" placeholder="0-20">
                    </div>
                    <div class="metric-card">
                        <h4>Glove Low</h4>
                        <label style="font-size: 12px;">Saves Made (out of 20)</label>
                        <input type="number" id="gloveLow" min="0" max="20" placeholder="0-20">
                    </div>
                    <div class="metric-card">
                        <h4>Blocker High</h4>
                        <label style="font-size: 12px;">Saves Made (out of 20)</label>
                        <input type="number" id="blockerHigh" min="0" max="20" placeholder="0-20">
                    </div>
                    <div class="metric-card">
                        <h4>Blocker Low</h4>
                        <label style="font-size: 12px;">Saves Made (out of 20)</label>
                        <input type="number" id="blockerLow" min="0" max="20" placeholder="0-20">
                    </div>
                    <div class="metric-card">
                        <h4>Five-Hole</h4>
                        <label style="font-size: 12px;">Saves Made (out of 20)</label>
                        <input type="number" id="fiveHole" min="0" max="20" placeholder="0-20">
                    </div>
                </div>

                <h3 style="margin: 30px 0 15px 0;">Other Metrics</h3>
                <div class="assessment-grid">
                    <div class="metric-card">
                        <h4>Recovery Time (seconds)</h4>
                        <label style="font-size: 12px;">Average of 5 trials</label>
                        <input type="number" id="recoveryTime" step="0.1" placeholder="e.g., 1.5">
                    </div>
                    <div class="metric-card">
                        <h4>Depth Management (1-5)</h4>
                        <label style="font-size: 12px;">1=Poor, 5=Optimal</label>
                        <input type="number" id="depthScore" min="1" max="5" placeholder="1-5">
                    </div>
                    <div class="metric-card">
                        <h4>Angle Management (1-5)</h4>
                        <label style="font-size: 12px;">1=Poor, 5=Perfect</label>
                        <input type="number" id="angleScore" min="1" max="5" placeholder="1-5">
                    </div>
                    <div class="metric-card">
                        <h4>Rebound Control (points)</h4>
                        <label style="font-size: 12px;">Out of 30 points</label>
                        <input type="number" id="reboundControl" min="0" max="30" placeholder="0-30">
                    </div>
                    <div class="metric-card">
                        <h4>Lateral Movement (seconds)</h4>
                        <label style="font-size: 12px;">Post-to-post average</label>
                        <input type="number" id="lateralMovement" step="0.1" placeholder="e.g., 2.3">
                    </div>
                </div>

                <h3 style="margin: 30px 0 15px 0;">Notes & Goals</h3>
                <div class="form-group">
                    <label>Strengths Observed</label>
                    <textarea id="strengths" rows="3" placeholder="What did the player do well?"></textarea>
                </div>
                <div class="form-group">
                    <label>Development Areas</label>
                    <textarea id="devAreas" rows="3" placeholder="What areas need improvement?"></textarea>
                </div>
                <div class="form-group">
                    <label>Goals for Next Assessment</label>
                    <textarea id="goals" rows="3" placeholder="What specific goals should the player work toward?"></textarea>
                </div>
                <div class="form-group">
                    <label>Coach Comments</label>
                    <textarea id="comments" rows="3" placeholder="Additional feedback or observations"></textarea>
                </div>

                <button class="btn" onclick="saveAssessment()">Save Assessment</button>
                <button class="btn btn-secondary" onclick="cancelAssessment()">Cancel</button>
            </div>
        </div>

        <!-- Reports Section -->
        <div id="reports" class="content-section">
            <h2 style="margin-bottom: 20px;">Player Reports</h2>
            
            <div class="form-group">
                <label>Select Player</label>
                <select id="reportPlayer" onchange="generateReport()">
                    <option value="">Choose a player...</option>
                </select>
            </div>

            <div id="reportContent"></div>
        </div>

        <!-- Export Section -->
        <div id="export" class="content-section">
            <h2 style="margin-bottom: 20px;">Export Data</h2>
            
            <p style="color: #718096; margin-bottom: 30px;">
                Export all player data and assessments for backup or analysis.
            </p>

            <div class="export-buttons">
                <button class="btn" onclick="exportToJSON()">📥 Export as JSON</button>
                <button class="btn btn-secondary" onclick="importFromJSON()">📤 Import from JSON</button>
                <button class="btn btn-danger" onclick="clearAllData()">🗑️ Clear All Data</button>
            </div>

            <div id="exportStatus" style="margin-top: 20px;"></div>
        </div>
    </div>

    <script>
        // Initialize data structure
        let appData = {
            players: [],
            assessments: []
        };

        // Load data from localStorage on page load
        function loadData() {
            const saved = localStorage.getItem('hockeyTrackerData');
            if (saved) {
                appData = JSON.parse(saved);
            }
            refreshAllViews();
        }

        // Save data to localStorage
        function saveData() {
            localStorage.setItem('hockeyTrackerData', JSON.stringify(appData));
        }

        // Tab navigation
        function showTab(tabName) {
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.querySelectorAll('.nav-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            document.getElementById(tabName).classList.add('active');
            event.target.classList.add('active');
            
            if (tabName === 'dashboard') refreshDashboard();
            if (tabName === 'players') refreshPlayersList();
            if (tabName === 'assess') refreshAssessPlayerSelect();
            if (tabName === 'reports') refreshReportPlayerSelect();
        }

        // Add new player
        function addPlayer() {
            const name = document.getElementById('playerName').value.trim();
            const age = document.getElementById('playerAge').value;
            const position = document.getElementById('playerPosition').value;

            if (!name || !age || !position) {
                alert('Please fill in all required fields');
                return;
            }

            const player = {
                id: Date.now().toString(),
                name: name,
                age: age,
                position: position,
                createdDate: new Date().toISOString()
            };

            appData.players.push(player);
            saveData();

            document.getElementById('playerName').value = '';
            document.getElementById('playerAge').value = '';
            document.getElementById('playerPosition').value = '';

            refreshPlayersList();
            alert('Player added successfully!');
        }

        // Refresh players list
        function refreshPlayersList() {
            const container = document.getElementById('playersList');
            
            if (appData.players.length === 0) {
                container.innerHTML = '<div class="empty-state"><h3>No Players Added Yet</h3><p>Add your first player using the form above</p></div>';
                return;
            }

            container.innerHTML = appData.players.map(player => {
                const assessmentCount = appData.assessments.filter(a => a.playerId === player.id).length;
                return `
                    <div class="player-card">
                        <h3>${player.name}</h3>
                        <p><strong>Age Group:</strong> ${player.age} | <strong>Position:</strong> ${player.position}</p>
                        <p><strong>Assessments:</strong> ${assessmentCount}</p>
                        <button class="btn btn-danger" style="margin-top: 10px;" onclick="deletePlayer('${player.id}')">Delete Player</button>
                    </div>
                `;
            }).join('');
        }

        // Delete player
        function deletePlayer(playerId) {
            if (!confirm('Are you sure you want to delete this player and all their assessments?')) {
                return;
            }
            appData.players = appData.players.filter(p => p.id !== playerId);
            appData.assessments = appData.assessments.filter(a => a.playerId !== playerId);
            saveData();
            refreshPlayersList();
        }

        // Refresh assessment player select
        function refreshAssessPlayerSelect() {
            const select = document.getElementById('assessPlayer');
            select.innerHTML = '<option value="">Choose a player...</option>' + 
                appData.players.map(p => `<option value="${p.id}">${p.name} (${p.position})</option>`).join('');
        }

        // Load player for assessment
        function loadPlayerForAssessment() {
            const playerId = document.getElementById('assessPlayer').value;
            const form = document.getElementById('assessmentForm');
            
            if (playerId) {
                form.style.display = 'block';
                document.getElementById('assessDate').valueAsDate = new Date();
            } else {
                form.style.display = 'none';
            }
        }

        // Cancel assessment
        function cancelAssessment() {
            document.getElementById('assessPlayer').value = '';
            document.getElementById('assessmentForm').style.display = 'none';
        }

        // Save assessment
        function saveAssessment() {
            const playerId = document.getElementById('assessPlayer').value;
            
            if (!playerId) {
                alert('Please select a player');
                return;
            }

            const gloveHigh = parseInt(document.getElementById('gloveHigh').value) || 0;
            const gloveLow = parseInt(document.getElementById('gloveLow').value) || 0;
            const blockerHigh = parseInt(document.getElementById('blockerHigh').value) || 0;
            const blockerLow = parseInt(document.getElementById('blockerLow').value) || 0;
            const fiveHole = parseInt(document.getElementById('fiveHole').value) || 0;

            const assessment = {
                id: Date.now().toString(),
                playerId: playerId,
                date: document.getElementById('assessDate').value,
                type: document.getElementById('assessType').value,
                assessor: document.getElementById('assessor').value,
                metrics: {
                    gloveHigh: gloveHigh,
                    gloveLow: gloveLow,
                    blockerHigh: blockerHigh,
                    blockerLow: blockerLow,
                    fiveHole: fiveHole,
                    overallSavePct: ((gloveHigh + gloveLow + blockerHigh + blockerLow + fiveHole) / 100 * 100).toFixed(1),
                    recoveryTime: parseFloat(document.getElementById('recoveryTime').value) || 0,
                    depthScore: parseInt(document.getElementById('depthScore').value) || 0,
                    angleScore: parseInt(document.getElementById('angleScore').value) || 0,
                    reboundControl: parseInt(document.getElementById('reboundControl').value) || 0,
                    lateralMovement: parseFloat(document.getElementById('lateralMovement').value) || 0
                },
                notes: {
                    strengths: document.getElementById('strengths').value,
                    devAreas: document.getElementById('devAreas').value,
                    goals: document.getElementById('goals').value,
                    comments: document.getElementById('comments').value
                }
            };

            appData.assessments.push(assessment);
            saveData();

            // Clear form
            document.getElementById('assessPlayer').value = '';
            document.getElementById('assessmentForm').style.display = 'none';
            document.querySelectorAll('#assessmentForm input[type="number"]').forEach(input => input.value = '');
            document.querySelectorAll('#assessmentForm textarea').forEach(textarea => textarea.value = '');

            alert('Assessment saved successfully!');
            showTab('dashboard');
        }

        // Refresh dashboard
        function refreshDashboard() {
            // Update stats
            const statsHTML = `
                <div class="stat-box">
                    <h4>${appData.players.length}</h4>
                    <p>Total Players</p>
                </div>
                <div class="stat-box">
                    <h4>${appData.assessments.length}</h4>
                    <p>Total Assessments</p>
                </div>
                <div class="stat-box">
                    <h4>${appData.players.filter(p => p.position === 'Goalie').length}</h4>
                    <p>Goalies</p>
                </div>
            `;
            document.getElementById('statsOverview').innerHTML = statsHTML;

            // Recent assessments
            const recentContainer = document.getElementById('recentAssessments');
            const recent = appData.assessments.slice(-5).reverse();
            
            if (recent.length === 0) {
                recentContainer.innerHTML = '<div class="empty-state"><h3>No Assessments Yet</h3><p>Conduct your first assessment from the New Assessment tab</p></div>';
                return;
            }

            recentContainer.innerHTML = recent.map(assessment => {
                const player = appData.players.find(p => p.id === assessment.playerId);
                return `
                    <div class="player-card">
                        <h3>${player ? player.name : 'Unknown Player'}</h3>
                        <p><strong>Type:</strong> ${assessment.type} | <strong>Date:</strong> ${assessment.date}</p>
                        <p><strong>Overall Save %:</strong> ${assessment.metrics.overallSavePct}%</p>
                        <p><strong>Assessor:</strong> ${assessment.assessor}</p>
                    </div>
                `;
            }).join('');
        }

        // Refresh report player select
        function refreshReportPlayerSelect() {
            const select = document.getElementById('reportPlayer');
            select.innerHTML = '<option value="">Choose a player...</option>' + 
                appData.players.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
        }

        // Generate report
        function generateReport() {
            const playerId = document.getElementById('reportPlayer').value;
            const container = document.getElementById('reportContent');
            
            if (!playerId) {
                container.innerHTML = '';
                return;
            }

            const player = appData.players.find(p => p.id === playerId);
            const assessments = appData.assessments.filter(a => a.playerId === playerId).sort((a, b) => new Date(a.date) - new Date(b.date));

            if (assessments.length === 0) {
                container.innerHTML = '<div class="empty-state"><h3>No Assessments Found</h3><p>This player hasn\'t been assessed yet</p></div>';
                return;
            }

            let reportHTML = `
                <div class="report-section">
                    <h3>${player.name} - Development Report</h3>
                    <p><strong>Position:</strong> ${player.position} | <strong>Age Group:</strong> ${player.age}</p>
                    <p><strong>Total Assessments:</strong> ${assessments.length}</p>
                    
                    <h4 style="margin-top: 30px; margin-bottom: 15px;">Assessment History</h4>
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
                            ${assessments.map(a => `
                                <tr>
                                    <td>${a.date}</td>
                                    <td>${a.type}</td>
                                    <td>${a.metrics.overallSavePct}%</td>
                                    <td>${a.metrics.recoveryTime}</td>
                                    <td>${a.metrics.reboundControl}/30</td>
                                    <td>${a.assessor}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
            `;

            if (assessments.length >= 2) {
                const first = assessments[0];
                const last = assessments[assessments.length - 1];
                const savePctChange = (parseFloat(last.metrics.overallSavePct) - parseFloat(first.metrics.overallSavePct)).toFixed(1);
                const recoveryChange = (last.metrics.recoveryTime - first.metrics.recoveryTime).toFixed(1);
                
                reportHTML += `
                    <h4 style="margin-top: 30px; margin-bottom: 15px;">Progress Summary</h4>
                    <div class="assessment-grid">
                        <div class="metric-card">
                            <h4>Save Percentage</h4>
                            <p>${first.metrics.overallSavePct}% → ${last.metrics.overallSavePct}%</p>
                            <span class="progress-indicator ${savePctChange >= 0 ? 'progress-positive' : 'progress-negative'}">
                                ${savePctChange >= 0 ? '+' : ''}${savePctChange}%
                            </span>
                        </div>
                        <div class="metric-card">
                            <h4>Recovery Time</h4>
                            <p>${first.metrics.recoveryTime}s → ${last.metrics.recoveryTime}s</p>
                            <span class="progress-indicator ${recoveryChange <= 0 ? 'progress-positive' : 'progress-negative'}">
                                ${recoveryChange >= 0 ? '+' : ''}${recoveryChange}s
                            </span>
                        </div>
                    </div>
                `;
            }

            // Latest assessment details
            const latest = assessments[assessments.length - 1];
            reportHTML += `
                <h4 style="margin-top: 30px; margin-bottom: 15px;">Latest Assessment Notes</h4>
                <div style="background: white; padding: 15px; border-radius: 8px;">
                    <p><strong>Date:</strong> ${latest.date} (${latest.type})</p>
                    ${latest.notes.strengths ? `<p><strong>Strengths:</strong> ${latest.notes.strengths}</p>` : ''}
                    ${latest.notes.devAreas ? `<p><strong>Development Areas:</strong> ${latest.notes.devAreas}</p>` : ''}
                    ${latest.notes.goals ? `<p><strong>Goals:</strong> ${latest.notes.goals}</p>` : ''}
                    ${latest.notes.comments ? `<p><strong>Coach Comments:</strong> ${latest.notes.comments}</p>` : ''}
                </div>
                
                <button class="btn" style="margin-top: 20px;" onclick="printReport()">🖨️ Print Report</button>
            `;

            reportHTML += '</div>';
            container.innerHTML = reportHTML;
        }

        // Print report
        function printReport() {
            window.print();
        }

        // Export to JSON
        function exportToJSON() {
            const dataStr = JSON.stringify(appData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `hockey-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            document.getElementById('exportStatus').innerHTML = '<p style="color: #22543d; background: #c6f6d5; padding: 15px; border-radius: 8px;">✅ Data exported successfully!</p>';
        }

        // Import from JSON
        function importFromJSON() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'application/json';
            input.onchange = e => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = event => {
                    try {
                        const imported = JSON.parse(event.target.result);
                        if (confirm('This will replace all current data. Continue?')) {
                            appData = imported;
                            saveData();
                            refreshAllViews();
                            document.getElementById('exportStatus').innerHTML = '<p style="color: #22543d; background: #c6f6d5; padding: 15px; border-radius: 8px;">✅ Data imported successfully!</p>';
                        }
                    } catch (error) {
                        alert('Error importing file: ' + error.message);
                    }
                };
                reader.readAsText(file);
            };
            input.click();
        }

        // Clear all data
        function clearAllData() {
            if (confirm('⚠️ This will permanently delete ALL players and assessments. This cannot be undone. Are you sure?')) {
                if (confirm('Really sure? This is your last chance!')) {
                    appData = { players: [], assessments: [] };
                    saveData();
                    refreshAllViews();
                    document.getElementById('exportStatus').innerHTML = '<p style="color: #742a2a; background: #fed7d7; padding: 15px; border-radius: 8px;">🗑️ All data has been cleared</p>';
                }
            }
        }

        // Refresh all views
        function refreshAllViews() {
            refreshDashboard();
            refreshPlayersList();
            refreshAssessPlayerSelect();
            refreshReportPlayerSelect();
        }

        // Initialize on page load
        window.onload = loadData;
    </script>
</body>
</html>'''

# Save the HTML file
with open('hockey-tracker-app.html', 'w', encoding='utf-8') as f:
    f.write(html_app)

print("✅ Created: hockey-tracker-app.html")
print("\nThis is a complete web application that:")
print("- Stores all data locally in the browser (no server needed)")
print("- Works offline once loaded")
print("- Can be shared by sending the HTML file or hosting it")
print("- Tracks players, assessments, and generates reports")
print("- Exports/imports data for backup and sharing")
print("\nTo use it:")
print("1. Open the HTML file in any web browser")
print("2. Or host it on a simple web server")
print("3. Or deploy to services like GitHub Pages, Netlify, or Vercel (free)")
