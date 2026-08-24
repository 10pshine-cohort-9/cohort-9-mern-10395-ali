import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { useNotes } from '../hooks/useNotes';
import Dashboard from './Dashboard';

jest.mock('../hooks/useNotes');

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

test('renders dashboard layout elements', () => {
  useNotes.mockReturnValue({
    notes: [],
    loading: false,
    error: null,
    fetchNotes: jest.fn(),
    removeNote: jest.fn()
  });

  render(
    <AuthProvider>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </AuthProvider>
  );
  
  const overviewHeading = screen.getByRole('heading', { name: /Overview/i, level: 1 });
  const searchInput = screen.getByRole('textbox', { name: /Search notes/i });
  const logoText = screen.getByText(/Notes Space/i);
  const logoutButton = screen.getByRole('button', { name: /Log Out/i });
  const openMenuButton = screen.getByRole('button', { name: /Open sidebar/i });
  const closeMenuButton = screen.getByRole('button', { name: /Close sidebar/i });
  const profileButton = screen.getByRole('button', { name: /View Profile/i });
  
  expect(overviewHeading).toBeInTheDocument();
  expect(searchInput).toBeInTheDocument();
  expect(logoText).toBeInTheDocument();
  expect(logoutButton).toBeInTheDocument();
  expect(openMenuButton).toBeInTheDocument();
  expect(closeMenuButton).toBeInTheDocument();
  expect(profileButton).toBeInTheDocument();
});

test('renders error alert when fetch fails', () => {
  useNotes.mockReturnValue({
    notes: [],
    loading: false,
    error: 'Failed to load notes',
    fetchNotes: jest.fn(),
    removeNote: jest.fn()
  });

  render(
    <AuthProvider>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </AuthProvider>
  );
  
  expect(screen.getByRole('alert')).toHaveTextContent(/Failed to load notes/i);
});