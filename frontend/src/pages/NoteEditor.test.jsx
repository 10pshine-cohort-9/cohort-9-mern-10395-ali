import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import NoteEditor from './NoteEditor';

jest.mock('react-quill-new', () => {
  return function MockEditor({ value, onChange }) {
    return (
      <textarea
        data-testid="mock-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
});

test('renders editor header', () => {
  render(
    <AuthProvider>
      <BrowserRouter>
        <NoteEditor />
      </BrowserRouter>
    </AuthProvider>
  );
  expect(screen.getByText(/Note Editor/i)).toBeInTheDocument();
});