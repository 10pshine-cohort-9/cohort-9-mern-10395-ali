import api from './authApi';

export const exportNotes = () => api.get('/data/export', { responseType: 'blob' });
export const importNotes = (data) => api.post('/data/import', data);