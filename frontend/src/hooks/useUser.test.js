import { renderHook, act } from '@testing-library/react';
import { useUser } from './useUser';
import { getProfile } from '../api/userApi';

jest.mock('../api/userApi', () => ({ getProfile: jest.fn() }));

test('starts with no profile and idle state', () => {
  const { result } = renderHook(() => useUser());

  expect(result.current.profile).toBeNull();
  expect(result.current.loading).toBe(false);
  expect(result.current.error).toBeNull();
});

test('loads the profile from the server', async () => {
  try {
    getProfile.mockResolvedValue({ data: { data: { user: { id: '1', name: 'Ali' } } } });
    const { result } = renderHook(() => useUser());

    await act(async () => {
      await result.current.fetchProfile();
    });

    expect(result.current.profile).toEqual({ id: '1', name: 'Ali' });
  } catch (err) {
    throw err;
  }
});

test('sets an error when the profile cannot be loaded', async () => {
  try {
    getProfile.mockRejectedValue(new Error('Network'));
    const { result } = renderHook(() => useUser());

    await act(async () => {
      await result.current.fetchProfile();
    });

    expect(result.current.error).toBe('Failed to load profile');
  } catch (err) {
    throw err;
  }
});
