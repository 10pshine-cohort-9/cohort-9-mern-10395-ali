import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import SignUp from './SignUp';

test('renders signup heading and all input fields', () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <SignUp />
      </BrowserRouter>
    </AuthProvider>
  );
  
  const heading = screen.getByRole('heading', { name: /Create Account/i });
  const nameInput = screen.getByLabelText(/Full Name/i);
  const emailInput = screen.getByLabelText(/Email Address/i);
  const passwordInput = screen.getByLabelText(/Create Password/i);
  const confirmInput = screen.getByLabelText(/Confirm Password/i);

  expect(heading).toBeInTheDocument();
  expect(nameInput).toBeInTheDocument();
  expect(emailInput).toBeInTheDocument();
  expect(passwordInput).toBeInTheDocument();
  expect(confirmInput).toBeInTheDocument();
});