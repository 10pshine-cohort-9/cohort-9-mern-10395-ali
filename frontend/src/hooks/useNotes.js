import { useState, useCallback } from 'react';
import { deleteNote } from '../api/notesApi';
import api from '../api/authApi';
import logger from '../api/logger';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotes = useCallback(async (search = '') => {
    setLoading(true);
    try {
      const { data } = await api.get('/notes', {
        params: search ? { search } : {}
      });
      setNotes(data.data.notes);
      setError(null);
    } catch (err) {
      setError('Failed to load notes');
      logger.error({ err }, 'Fetch notes error');
    } finally {
      setLoading(false);
    }
  }, []);

  const removeNote = async (id) => {
    try {
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
      return true;
    } catch (err) {
      logger.error({ err }, 'Delete note error');
      return false;
    }
  };

  return { notes, loading, error, fetchNotes, removeNote };
};