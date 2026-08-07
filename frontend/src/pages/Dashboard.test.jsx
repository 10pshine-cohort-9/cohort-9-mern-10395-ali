import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Dashboard from './Dashboard';

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
  render(
    <AuthProvider>
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    </AuthProvider>
  );
  
  const overviewHeading = screen.getByRole('heading', { name: /Overview/i, level: 1 });
  const searchInput = screen.getByRole('textbox', { name: /Search through notes/i });
  const logoText = screen.getByText(/Notes Space/i);
  const logoutButton = screen.getByRole('button', { name: /Log Out/i });
  const openMenuButton = screen.getByRole('button', { name: /Open sidebar/i });
  const closeMenuButton = screen.getByRole('button', { name: /Close sidebar/i });
  
  expect(overviewHeading).toBeInTheDocument();
  expect(searchInput).toBeInTheDocument();
  expect(logoText).toBeInTheDocument();
  expect(logoutButton).toBeInTheDocument();
  expect(openMenuButton).toBeInTheDocument();
  expect(closeMenuButton).toBeInTheDocument();
});