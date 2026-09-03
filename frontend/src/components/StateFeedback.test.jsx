import React from 'react';
import { render, screen } from '@testing-library/react';
import Loader from './Loader';
import EmptyState from './EmptyState';
import { BrowserRouter } from 'react-router-dom';

test('loader renders animation', () => {
  render(<Loader />);
  const spinner = screen.getByRole('status');
  expect(spinner).toBeInTheDocument();
});

test('empty state renders create button', () => {
  render(<BrowserRouter><EmptyState /></BrowserRouter>);
  expect(screen.getByText(/Create First Note/i)).toBeInTheDocument();
});