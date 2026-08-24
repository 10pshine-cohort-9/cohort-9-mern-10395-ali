import { renderHook, act } from '@testing-library/react';
import { useUser } from './useUser';
import { updateProfile } from '../api/userApi';

jest.mock('../api/userApi');

test('useUser initial state matches contract', () => {
  const { result } = renderHook(() => useUser());
  expect(result.current.profile).toBeNull();
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeNull();
});

test('editProfile captures error message on rejection', async () => {
  updateProfile.mockRejectedValue(new Error('Network Error'));
  const { result } = renderHook(() => useUser());

  await act(async () => {
    const success = await result.current.editProfile('Test Name');
    expect(success).toBe(false);
  });

  expect(result.current.error).toBe('Failed to update profile');
});