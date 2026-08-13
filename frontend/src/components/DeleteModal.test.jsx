import React from 'react';
import { render, screen } from '@testing-library/react';
import DeleteModal from './DeleteModal';

test('renders modal when open', () => {
  render(<DeleteModal isOpen={true} noteTitle="Test" />);
  expect(screen.getByText(/Delete Note\?/i)).toBeInTheDocument();
});