import api from './authApi';
import { getProfile } from './userApi';

jest.mock('./authApi', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn(), delete: jest.fn() },
}));

test('getProfile fetches the current user', async () => {
  try {
    api.get.mockResolvedValue({ data: { data: { user: { id: '1', name: 'Ali' } } } });

    await getProfile();

    expect(api.get).toHaveBeenCalledWith('/users/me');
  } catch (err) {
    throw err;
  }
});
