import { useState, useCallback, useRef } from 'react';
import { deleteNote } from '../api/notesApi';
import api from '../api/authApi';
import logger from '../api/logger';

export const useNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestVersion = useRef(0);

  const fetchNotes = useCallback(async (search = '') => {
    const currentVersion = ++requestVersion.current;
    setLoading(true);
    
    try {
      const { data } = await api.get('/notes', {
        params: search ? { search } : {}
      });

      if (currentVersion === requestVersion.current) {
        setNotes(data.data.notes);
        setError(null);
      }
    } catch (err) {
      if (currentVersion === requestVersion.current) {
        setError('Failed to load notes');
        logger.error({ err }, 'Fetch notes error');
      }
    } finally {
      if (currentVersion === requestVersion.current) {
        setLoading(false);
      }
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