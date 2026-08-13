import { renderHook } from '@testing-library/react';
import { useNotes } from './useNotes';

test('useNotes hook manages state correctly', () => {
  const { result } = renderHook(() => useNotes());
  
  expect(Array.isArray(result.current.notes)).toBe(true);
  expect(result.current.loading).toBe(false);
  expect(typeof result.current.fetchNotes).toBe('function');
});