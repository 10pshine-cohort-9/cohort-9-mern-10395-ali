import { useState, useCallback } from 'react';
import { getProfile, updateProfile } from '../api/userApi';

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

  const editProfile = async (name) => {
    setError(null);
    try {
      const { data } = await updateProfile({ name });
      setProfile(data.data.user);
      return true;
    } catch (err) {
      setError('Failed to update profile');
      return false;
    }
  };

  return { profile, loading, error, fetchProfile, editProfile };
};