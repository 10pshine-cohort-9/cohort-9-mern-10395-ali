import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NoteGrid from './NoteGrid';

jest.mock('gsap', () => ({
  context: jest.fn(() => ({ revert: jest.fn() })),
  from: jest.fn(),
}));

test('renders empty state when notes array is empty', () => {
  render(
    <BrowserRouter>
      <NoteGrid notes={[]} onDelete={() => {}} />
    </BrowserRouter>
  );
  expect(screen.getByText(/No notes yet/i)).toBeInTheDocument();
});

test('renders multiple note cards when data is provided', () => {
  const mockNotes = [
    { id: '1', title: 'First Note', content: 'Content 1', updated_at: '2026-08-13T10:00:00Z' },
    { id: '2', title: 'Second Note', content: 'Content 2', updated_at: '2026-08-13T10:00:00Z' }
  ];

  render(
    <BrowserRouter>
      <NoteGrid notes={mockNotes} onDelete={() => {}} />
    </BrowserRouter>
  );

  expect(screen.getByText('First Note')).toBeInTheDocument();
  expect(screen.getByText('Second Note')).toBeInTheDocument();
});