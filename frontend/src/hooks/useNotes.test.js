import { renderHook, act } from '@testing-library/react';
import { useNotes } from './useNotes';

jest.mock('../api/authApi', () => ({
  __esModule: true,
  default: { get: jest.fn() },
}));
jest.mock('../api/notesApi', () => ({ deleteNote: jest.fn() }));
jest.mock('../api/logger', () => ({ error: jest.fn() }));

import api from '../api/authApi';
import { deleteNote } from '../api/notesApi';

afterEach(() => jest.clearAllMocks());

test('loads the notes from the server', async () => {
  api.get.mockResolvedValue({ data: { data: { notes: [{ id: '1', title: 'Hello' }] } } });
  const { result } = renderHook(() => useNotes());

  await act(async () => {
    await result.current.fetchNotes();
  });

  expect(api.get).toHaveBeenCalledWith('/notes', { params: {} });
  expect(result.current.notes).toHaveLength(1);
  expect(result.current.loading).toBe(false);
});

test('passes the search term when listing notes', async () => {
  api.get.mockResolvedValue({ data: { data: { notes: [] } } });
  const { result } = renderHook(() => useNotes());

  await act(async () => {
    await result.current.fetchNotes('work');
  });

  expect(api.get).toHaveBeenCalledWith('/notes', { params: { search: 'work' } });
});

test('reports an error when the fetch fails', async () => {
  api.get.mockRejectedValue(new Error('Network'));
  const { result } = renderHook(() => useNotes());

  await act(async () => {
    await result.current.fetchNotes();
  });

  expect(result.current.error).toBe('Failed to load notes');
});

test('removes the note from the list after a successful delete', async () => {
  deleteNote.mockResolvedValue({ data: {} });
  api.get.mockResolvedValue({
    data: {
      data: {
        notes: [
          { id: '1', title: 'One' },
          { id: '2', title: 'Two' },
        ],
      },
    },
  });
  const { result } = renderHook(() => useNotes());

  await act(async () => {
    await result.current.fetchNotes();
  });
  await act(async () => {
    await result.current.removeNote('1');
  });

  expect(deleteNote).toHaveBeenCalledWith('1');
  expect(result.current.notes.map((n) => n.id)).toEqual(['2']);
});

test('returns false when the delete fails', async () => {
  deleteNote.mockRejectedValue(new Error('boom'));
  const { result } = renderHook(() => useNotes());

  let success;
  await act(async () => {
    success = await result.current.removeNote('1');
  });

  expect(success).toBe(false);
});
