import { expect, test, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock the supabaseClient module
vi.mock('./utils/supabaseClient', () => ({
  getPlayers: vi.fn().mockResolvedValue([]),
  getAssessments: vi.fn().mockResolvedValue([]),
  savePlayer: vi.fn(),
  deletePlayer: vi.fn(),
  saveAssessment: vi.fn(),
  deleteAssessmentsForPlayer: vi.fn(),
  importData: vi.fn(),
  exportData: vi.fn(),
  supabase: {
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnValue({
        unsubscribe: vi.fn()
      })
    })
  }
}));

beforeEach(() => {
  vi.clearAllMocks();
});

test('renders Hockey Baseline Development Tracker header', async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  await waitFor(() => {
    const headerElement = screen.getByText(/Hockey Baseline Development Tracker/i);
    expect(headerElement).toBeInTheDocument();
  });
});

test('renders navigation tabs', async () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  await waitFor(() => {
    // Check for navigation tabs specifically by role and name
    const navTabs = screen.getAllByRole('link');
    const tabTexts = navTabs.map(tab => tab.textContent);

    expect(tabTexts).toContain('Dashboard');
    expect(tabTexts).toContain('Players');
    expect(tabTexts).toContain('New Assessment');
    expect(tabTexts).toContain('Reports');
    expect(tabTexts).toContain('Export Data');
  });
});
