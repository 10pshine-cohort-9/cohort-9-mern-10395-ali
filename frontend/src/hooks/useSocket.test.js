import { useSocket } from './useSocket';

test('useSocket exports a function', () => {
  expect(typeof useSocket).toBe('function');
});