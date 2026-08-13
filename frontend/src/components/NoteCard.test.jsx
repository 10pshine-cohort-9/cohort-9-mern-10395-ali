import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NoteCard from './NoteCard';

test('renders note content', () => {
  const note = { title: 'Test', content: 'Body', updated_at: new Date() };
  render(<BrowserRouter><NoteCard note={note} /></BrowserRouter>);
  expect(screen.getByText('Test')).toBeInTheDocument();
});