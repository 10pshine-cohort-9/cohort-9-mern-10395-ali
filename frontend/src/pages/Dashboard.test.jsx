import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { useNotes } from '../hooks/useNotes';
import { useSocket } from '../hooks/useSocket';
import Dashboard from './Dashboard';

jest.mock('../hooks/useNotes');
jest.mock('../hooks/useSocket');
jest.mock('../api/userApi', () => ({
  getProfile: jest.fn().mockResolvedValue({ data: { data: { user: { deleted_notes_count: 0 } } } })
}));

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});

const renderDashboard = () => {
  return render(
    <AuthProvider>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </AuthProvider>
  );
};

test('renders dashboard layout elements', () => {
  useNotes.mockReturnValue({
    notes: [],
    loading: false,
    error: null,
    fetchNotes: jest.fn(),
    removeNote: jest.fn()
  });

  useSocket.mockReturnValue({
    on: jest.fn(),
    off: jest.fn()
  });

  renderDashboard();
  
  expect(screen.getByRole('heading', { name: /Overview/i, level: 1 })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /Search notes/i })).toBeInTheDocument();
  expect(screen.getByText(/Notes Space/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Log Out/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /View Profile/i })).toBeInTheDocument();
  expect(screen.getByText(/Import .txt/i)).toBeInTheDocument();
});

test('renders error alert when fetch fails', () => {
  useNotes.mockReturnValue({
    notes: [],
    loading: false,
    error: 'Failed to load notes',
    fetchNotes: jest.fn(),
    removeNote: jest.fn()
  });

  useSocket.mockReturnValue({
    on: jest.fn(),
    off: jest.fn()
  });

  renderDashboard();
  
  expect(screen.getByRole('alert')).toHaveTextContent(/Failed to load notes/i);
});