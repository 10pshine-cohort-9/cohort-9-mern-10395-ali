import { useContext } from 'react';
import { render, screen, act } from '@testing-library/react';
import { AuthProvider, AuthContext } from './AuthContext';

jest.mock('../api/logger', () => ({ info: jest.fn(), error: jest.fn() }));
jest.mock('../api/authApi', () => ({
  __esModule: true,
  default: { defaults: { headers: { common: {} } } },
}));

const Probe = () => {
  const { user, loginUser, logout } = useContext(AuthContext);
  return (
    <div>
      <span data-testid="user">{user ? user.name : 'none'}</span>
      <button onClick={() => loginUser({ user: { name: 'Ali' }, token: 'tok-1' })}>login</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
};

beforeEach(() => localStorage.clear());

test('stores the session when a user logs in', async () => {
  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );

  act(() => {
    screen.getByText('login').click();
  });

  expect(screen.getByTestId('user').textContent).toBe('Ali');
  expect(JSON.parse(localStorage.getItem('user')).token).toBe('tok-1');
});

test('clears the session on logout', async () => {
  localStorage.setItem('user', JSON.stringify({ user: { name: 'Ali' }, token: 'tok-1' }));

  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );

  act(() => {
    screen.getByText('logout').click();
  });

  expect(screen.getByTestId('user').textContent).toBe('none');
  expect(localStorage.getItem('user')).toBeNull();
});

test('restores a saved session on mount', async () => {
  localStorage.setItem('user', JSON.stringify({ user: { name: 'Sara' }, token: 'tok-9' }));

  render(
    <AuthProvider>
      <Probe />
    </AuthProvider>
  );

  expect(screen.getByTestId('user').textContent).toBe('Sara');
});
