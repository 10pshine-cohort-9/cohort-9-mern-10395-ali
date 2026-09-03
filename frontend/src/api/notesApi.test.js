import api from './authApi';
import { getNotes, getNoteById, createNote, updateNote, deleteNote } from './notesApi';

jest.mock('./authApi', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

test('getNotes fetches the notes list', async () => {
  try {
    api.get.mockResolvedValue({ data: { data: { notes: [] } } });

    await getNotes();

    expect(api.get).toHaveBeenCalledWith('/notes');
  } catch (err) {
    throw err;
  }
});

test('getNoteById requires an id', () => {
  expect(() => getNoteById()).toThrow('Note ID is required');
});

test('getNoteById fetches a single note', async () => {
  try {
    api.get.mockResolvedValue({ data: { data: { note: { id: '1' } } } });

    await getNoteById('1');

    expect(api.get).toHaveBeenCalledWith('/notes/1');
  } catch (err) {
    throw err;
  }
});

test('createNote requires a title', () => {
  expect(() => createNote({ content: 'body' })).toThrow('Note title is required');
});

test('createNote posts a new note', async () => {
  try {
    api.post.mockResolvedValue({ data: { data: { note: {} } } });

    await createNote({ title: 'New Note', content: 'Body' });

    expect(api.post).toHaveBeenCalledWith('/notes', { title: 'New Note', content: 'Body' });
  } catch (err) {
    throw err;
  }
});

test('updateNote requires an id and a title', () => {
  expect(() => updateNote()).toThrow(/Note ID and title are required/);
});

test('updateNote sends the changed values', async () => {
  try {
    api.put.mockResolvedValue({ data: { data: { note: {} } } });

    await updateNote('1', { title: 'Edited', content: 'Body' });

    expect(api.put).toHaveBeenCalledWith('/notes/1', { title: 'Edited', content: 'Body' });
  } catch (err) {
    throw err;
  }
});

test('deleteNote requires an id', () => {
  expect(() => deleteNote()).toThrow('Note ID is required');
});

test('deleteNote calls the delete endpoint', async () => {
  try {
    api.delete.mockResolvedValue({ data: {} });

    await deleteNote('5');

    expect(api.delete).toHaveBeenCalledWith('/notes/5');
  } catch (err) {
    throw err;
  }
});
