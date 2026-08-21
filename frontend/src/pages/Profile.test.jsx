import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Profile from './Profile';

test('renders profile identity section', async () => {
  try {
    render(
      <AuthProvider>
        <BrowserRouter>
          <Profile />
        </BrowserRouter>
      </AuthProvider>
    );
    
    const heading = await screen.findByText(/User Profile/i);
    expect(heading).toBeInTheDocument();
  } catch (err) {
    throw new Error(`Profile identity section search failed: ${err.message}`);
  }
});