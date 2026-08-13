import * as notesApi from './notesApi';

test('notesApi exports expected crud functions', () => {
  const functions = ['getNotes', 'createNote', 'updateNote', 'deleteNote'];
  functions.forEach(fn => {
    expect(typeof notesApi[fn]).toBe('function');
  });
});