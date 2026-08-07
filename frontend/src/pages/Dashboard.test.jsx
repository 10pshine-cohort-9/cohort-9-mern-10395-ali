import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Dashboard from './Dashboard';

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
  
  expect(overviewHeading).toBeInTheDocument();
  expect(searchInput).toBeInTheDocument();
  expect(logoText).toBeInTheDocument();
});