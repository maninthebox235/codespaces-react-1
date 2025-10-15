import { expect, test, describe } from 'vitest';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard', () => {
  test('renders dashboard with no data', () => {
    render(<Dashboard players={[]} assessments={[]} />);

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Total Players')).toBeInTheDocument();
    expect(screen.getByText('No Assessments Yet')).toBeInTheDocument();
  });

  test('displays correct player count', () => {
    const players = [
      { id: '1', name: 'John Doe', position: 'Goalie', age_group: 'Bantam' },
      { id: '2', name: 'Jane Smith', position: 'Forward', age_group: 'PeeWee' }
    ];

    render(<Dashboard players={players} assessments={[]} />);

    // Find the stat box with "2" as h4 content
    const statBoxes = screen.getAllByRole('heading', { level: 4 });
    const playerCountBox = statBoxes.find(h4 => h4.textContent === '2');
    expect(playerCountBox).toBeInTheDocument();
  });

  test('displays goalie count correctly', () => {
    const players = [
      { id: '1', name: 'John Doe', position: 'Goalie', age_group: 'Bantam' },
      { id: '2', name: 'Jane Smith', position: 'Forward', age_group: 'PeeWee' },
      { id: '3', name: 'Bob Johnson', position: 'Goalie', age_group: 'Squirt' }
    ];

    render(<Dashboard players={players} assessments={[]} />);

    expect(screen.getByText('Goalies')).toBeInTheDocument();
    const statBoxes = screen.getAllByRole('heading', { level: 4 });
    const goalieCountBox = statBoxes.find(h4 => h4.textContent === '2');
    expect(goalieCountBox).toBeInTheDocument();
  });

  test('displays recent assessments', () => {
    const players = [
      { id: '1', name: 'John Doe', position: 'Goalie', age_group: 'Bantam' }
    ];

    const assessments = [
      {
        id: 'a1',
        player_id: '1',
        date: '2024-01-15',
        season: '2024-25',
        type: 'Baseline',
        assessor: 'Coach Smith',
        metrics: { overallSavePct: 85.5 }
      }
    ];

    render(<Dashboard players={players} assessments={assessments} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText(/Coach Smith/i)).toBeInTheDocument();
  });

  test('filters assessments by current season', () => {
    const players = [{ id: '1', name: 'John Doe', position: 'Goalie', age_group: 'Bantam' }];

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    // Season format is YYYY-YYYY (full year)
    const currentSeason = currentMonth >= 8 ? `${currentYear}-${currentYear + 1}` : `${currentYear - 1}-${currentYear}`;

    const assessments = [
      { id: 'a1', player_id: '1', date: '2024-01-15', season: currentSeason, type: 'Baseline', assessor: 'Coach', metrics: {} },
      { id: 'a2', player_id: '1', date: '2023-01-15', season: '2023-2024', type: 'Baseline', assessor: 'Coach', metrics: {} }
    ];

    render(<Dashboard players={players} assessments={assessments} />);

    // Check that season stat box exists - text is split across elements
    expect(screen.getByText(new RegExp(currentSeason.replace('-', '.*') + '.*Season', 'i'))).toBeInTheDocument();
  });
});
