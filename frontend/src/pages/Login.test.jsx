import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from './Login';

test('renders login elements', () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    </AuthProvider>
  );
  
  const heading = screen.getByRole('heading', { name: /Sign In/i });
  const emailInput = screen.getByPlaceholderText(/Email Address/i);
  
  expect(heading).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
});