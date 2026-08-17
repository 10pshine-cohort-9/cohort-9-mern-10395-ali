import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NoteCard from './NoteCard';

test('renders note title and processed content', () => {
  const mockNote = { 
    id: '1', 
    title: 'History Note', 
    content: '<p>The Revolution</p>', 
    updated_at: '2026-08-13T10:00:00Z' 
  };
  
  render(<BrowserRouter><NoteCard note={mockNote} onDelete={() => {}} /></BrowserRouter>);
  
  expect(screen.getByText('History Note')).toBeInTheDocument();
  expect(screen.getByText(/The Revolution/i)).toBeInTheDocument();
});