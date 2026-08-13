import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import NoteEditor from './NoteEditor';

jest.mock('react-quill-new', () => {
  return function MockEditor() { return <div data-testid="quill" />; };
});

test('renders editor and verifies title input exists', () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <NoteEditor />
      </BrowserRouter>
    </AuthProvider>
  );
  
  const titleInput = screen.getByPlaceholderText(/Note Title/i);
  const saveButton = screen.getByRole('button', { name: /Save/i });
  
  expect(titleInput).toBeInTheDocument();
  expect(saveButton).toBeInTheDocument();
});