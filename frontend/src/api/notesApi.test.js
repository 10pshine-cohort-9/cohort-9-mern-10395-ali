import * as notesApi from './notesApi';

test('api functions are defined', () => {
  expect(notesApi.getNotes).toBeDefined();
  expect(notesApi.createNote).toBeDefined();
});