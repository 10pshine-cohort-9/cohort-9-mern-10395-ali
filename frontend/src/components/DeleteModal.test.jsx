import React from 'react';
import { render, screen } from '@testing-library/react';
import DeleteModal from './DeleteModal';

test('shows correct note title in confirmation message', () => {
  render(
    <DeleteModal 
      isOpen={true} 
      noteTitle="Important Ideas" 
      onConfirm={() => {}} 
      onClose={() => {}} 
    />
  );
  
  expect(screen.getByText(/"Important Ideas"/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Delete/i })).toBeInTheDocument();
});