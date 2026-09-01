import api from './authApi';

export const getProfile = () => api.get('/users/me');