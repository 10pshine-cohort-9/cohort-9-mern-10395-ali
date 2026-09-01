import { useState, useCallback } from 'react';
import { getProfile } from '../api/userApi';

export const useUser = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await getProfile();
      setProfile(data.data.user);
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  return { profile, loading, error, fetchProfile };
};