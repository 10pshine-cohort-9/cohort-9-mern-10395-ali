import { useState, useCallback, useRef } from 'react';
import { deleteNote } from '../api/notesApi';
import api from '../api/authApi';
import logger from '../api/logger';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestVersion = useRef(0);

  const fetchNotes = useCallback(async (searchQuery = '') => {
    const search = typeof searchQuery === 'string' ? searchQuery : '';
    const currentVersion = ++requestVersion.current;

    setLoading(true);
    setError(null);

    try {
      const response = await api.get('/notes', {
        params: search ? { search } : {}
      });

      if (currentVersion === requestVersion.current) {
        const fetchedData = response?.data?.data?.notes;
        setNotes(Array.isArray(fetchedData) ? fetchedData : []);
      }
    } catch (err) {
      if (currentVersion === requestVersion.current) {
        setError('Failed to load notes');
        logger.error({ err }, 'Fetch notes logic failure');
      }
    } finally {
      if (currentVersion === requestVersion.current) {
        setLoading(false);
      }
    }
  }, []);

  const removeNote = async (id) => {
    if (!id) return false;

    try {
      await deleteNote(id);
      requestVersion.current++;
      setNotes((prev) => prev.filter((n) => n && n.id !== id));
      return true;
    } catch (err) {
      logger.error({ err }, 'Delete operation failed');
      return false;
    }
  };

  return { notes, loading, error, fetchNotes, removeNote };
};