import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import SignUp from './SignUp';

test('renders signup heading', () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    </AuthProvider>
  );
  const heading = screen.getByText(/Create Account/i);
  expect(heading).toBeInTheDocument();
});