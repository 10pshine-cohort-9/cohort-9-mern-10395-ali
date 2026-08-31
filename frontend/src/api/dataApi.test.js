import * as dataApi from './dataApi';

test('dataApi definitions check', () => {
  expect(typeof dataApi.exportNotes).toBe('function');
  expect(typeof dataApi.importNotes).toBe('function');
});