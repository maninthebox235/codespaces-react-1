import { expect, test, describe, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import PlayerManagement from './PlayerManagement';

describe('PlayerManagement', () => {
  test('renders player management form', () => {
    render(<PlayerManagement players={[]} onAddPlayer={vi.fn()} onDeletePlayer={vi.fn()} />);

    expect(screen.getByText('Player Management')).toBeInTheDocument();
    expect(screen.getByText('Add New Player')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter full name')).toBeInTheDocument();
  });

  test('displays empty state when no players', () => {
    render(<PlayerManagement players={[]} onAddPlayer={vi.fn()} onDeletePlayer={vi.fn()} />);

    expect(screen.getByText('No Players Added Yet')).toBeInTheDocument();
  });

  test('displays list of players', () => {
    const players = [
      { id: '1', name: 'John Doe', position: 'Goalie', age_group: 'Bantam' },
      { id: '2', name: 'Jane Smith', position: 'Forward', age_group: 'PeeWee' }
    ];

    render(<PlayerManagement players={players} onAddPlayer={vi.fn()} onDeletePlayer={vi.fn()} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText(/Bantam.*Goalie/i)).toBeInTheDocument();
  });

  test('shows alert when submitting incomplete form', () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    const onAddPlayer = vi.fn();

    render(<PlayerManagement players={[]} onAddPlayer={onAddPlayer} onDeletePlayer={vi.fn()} />);

    const submitButton = screen.getByText('Add Player');
    fireEvent.click(submitButton);

    expect(alertMock).toHaveBeenCalledWith('Please fill in all required fields');
    expect(onAddPlayer).not.toHaveBeenCalled();

    alertMock.mockRestore();
  });

  test('calls onAddPlayer with form data', () => {
    const onAddPlayer = vi.fn();

    render(<PlayerManagement players={[]} onAddPlayer={onAddPlayer} onDeletePlayer={vi.fn()} />);

    // Fill in form
    const nameInput = screen.getByPlaceholderText('Enter full name');
    fireEvent.change(nameInput, { target: { value: 'Test Player' } });

    // Find selects by their display value
    const selects = screen.getAllByRole('combobox');
    const ageSelect = selects[0]; // First select is Age Group
    const positionSelect = selects[1]; // Second select is Position

    fireEvent.change(ageSelect, { target: { value: 'Bantam' } });
    fireEvent.change(positionSelect, { target: { value: 'Goalie' } });

    // Submit form
    const submitButton = screen.getByText('Add Player');
    fireEvent.click(submitButton);

    expect(onAddPlayer).toHaveBeenCalledWith({
      name: 'Test Player',
      age_group: 'Bantam',
      position: 'Goalie'
    });
  });

  test('calls onDeletePlayer when delete button is clicked', () => {
    const onDeletePlayer = vi.fn();

    const players = [
      { id: '1', name: 'John Doe', position: 'Goalie', age_group: 'Bantam' }
    ];

    render(<PlayerManagement players={players} onAddPlayer={vi.fn()} onDeletePlayer={onDeletePlayer} />);

    const deleteButton = screen.getByText('Delete Player');
    fireEvent.click(deleteButton);

    // Component calls the handler directly - confirmation happens in parent
    expect(onDeletePlayer).toHaveBeenCalledWith('1');
  });
});
