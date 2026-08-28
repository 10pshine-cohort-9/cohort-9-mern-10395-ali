import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NoteCard from './NoteCard';

test('renders note title, processed content, and action buttons', () => {
  const mockNote = { 
    id: '1', 
    title: 'History Note', 
    content: '<p>The Revolution</p>', 
    updated_at: '2026-08-13T10:00:00Z' 
  };
  
  render(
    <BrowserRouter>
      <NoteCard note={mockNote} onDelete={() => {}} />
    </BrowserRouter>
  );
  
  expect(screen.getByText('History Note')).toBeInTheDocument();
  expect(screen.getByText(/The Revolution/i)).toBeInTheDocument();
  
  expect(screen.getByRole('button', { name: /Download note: History Note/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Edit note: History Note/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Delete note: History Note/i })).toBeInTheDocument();
});

test('renders rich text formatting in the preview', () => {
  const mockNote = { 
    id: '2', 
    title: 'Styled Note', 
    content: '<p>Plain <strong>bold</strong> and <em>italic</em> text</p>', 
    updated_at: '2026-08-13T10:00:00Z' 
  };
  
  render(
    <BrowserRouter>
      <NoteCard note={mockNote} onDelete={() => {}} />
    </BrowserRouter>
  );
  
  const bold = screen.getByText('bold');
  const italic = screen.getByText('italic');
  expect(bold.tagName).toBe('STRONG');
  expect(italic.tagName).toBe('EM');
});

test('sanitizes unsafe html in the preview', () => {
  const mockNote = { 
    id: '3', 
    title: 'Unsafe Note', 
    content: '<p>Safe</p><script>window.bad = true</script>', 
    updated_at: '2026-08-13T10:00:00Z' 
  };
  
  render(
    <BrowserRouter>
      <NoteCard note={mockNote} onDelete={() => {}} />
    </BrowserRouter>
  );
  
  expect(screen.getByText('Safe')).toBeInTheDocument();
  expect(document.querySelector('script')).not.toBeInTheDocument();
  expect(window.bad).toBeUndefined();
});