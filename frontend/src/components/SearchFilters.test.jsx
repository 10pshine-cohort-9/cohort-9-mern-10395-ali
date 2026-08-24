import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchFilters from './SearchFilters';

test('renders search input and triggers callback on change', () => {
  const onSearchMock = jest.fn();
  render(<SearchFilters onSearch={onSearchMock} value="" />);

  const input = screen.getByRole('textbox', { name: /Search notes/i });
  expect(input).toBeInTheDocument();

  fireEvent.change(input, { target: { value: 'react' } });
  expect(onSearchMock).toHaveBeenCalledWith('react');
});

test('displays and triggers clear button when value is present', () => {
  const onSearchMock = jest.fn();
  render(<SearchFilters onSearch={onSearchMock} value="existing search" />);
  
  const clearButton = screen.getByRole('button', { name: /Clear search/i });
  expect(clearButton).toBeInTheDocument();

  fireEvent.click(clearButton);
  expect(onSearchMock).toHaveBeenCalledWith('');
});