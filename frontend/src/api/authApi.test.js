import axios from 'axios';
import { signup, login } from './authApi';

jest.mock('axios', () => ({
  create: jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
  })),
}));

function api() {
  return axios.create.mock.results[0].value;
}

test('signup posts the credentials to the signup endpoint', async () => {
  const instance = api();
  instance.post.mockResolvedValue({ data: { data: { token: 'abc' } } });

  await signup({ email: 'a@b.com', password: 'password123' });

  expect(instance.post).toHaveBeenCalledWith('/auth/signup', { email: 'a@b.com', password: 'password123' });
});

test('login posts the credentials to the login endpoint', async () => {
  const instance = api();
  instance.post.mockResolvedValue({ data: { data: { token: 'abc' } } });

  await login({ email: 'a@b.com', password: 'password123' });

  expect(instance.post).toHaveBeenCalledWith('/auth/login', { email: 'a@b.com', password: 'password123' });
});
