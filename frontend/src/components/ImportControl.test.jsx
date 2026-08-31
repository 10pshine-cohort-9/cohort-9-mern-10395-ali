import React from 'react';
import { render, screen } from '@testing-library/react';
import ImportControl from './ImportControl';

test('renders import label for text files', () => {
  render(<ImportControl onComplete={() => {}} />);
  expect(screen.getByText(/Import .txt/i)).toBeInTheDocument();
});