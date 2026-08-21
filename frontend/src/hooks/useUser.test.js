import { renderHook } from '@testing-library/react';
import { useUser } from './useUser';

test('useUser initial state matches contract', () => {
  const { result } = renderHook(() => useUser());
  expect(result.current.profile).toBeNull();
  expect(result.current.loading).toBe(false);
});