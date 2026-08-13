import api from './authApi';

export const getNotes = () => api.get('/notes');

export const getNoteById = (id) => {
  if (!id) throw new Error('Note ID is required');
  return api.get(`/notes/${id}`);
};

export const createNote = ({ title, content } = {}) => {
  if (!title) throw new Error('Note title is required');
  return api.post('/notes', { title, content });
};

export const updateNote = (id, { title, content } = {}) => {
  if (!id || !title) throw new Error('Valid Note ID and title are required');
  return api.put(`/notes/${id}`, { title, content });
};

export const deleteNote = (id) => {
  if (!id) throw new Error('Note ID is required');
  return api.delete(`/notes/${id}`);
};