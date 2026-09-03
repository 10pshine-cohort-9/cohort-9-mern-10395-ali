import { formatDate } from './dateFormatter';

test('formats a date string into a readable date', () => {
  expect(formatDate('2026-08-13T12:00:00Z')).toMatch(/Aug \d{2}, 2026/);
});
