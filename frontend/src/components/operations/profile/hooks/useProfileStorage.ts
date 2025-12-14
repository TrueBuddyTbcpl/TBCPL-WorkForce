import { useState, useEffect } from 'react';
import type { CulpritProfile } from '../types/profile.types';

const STORAGE_KEY = 'culprit_profiles';

export const useProfileStorage = () => {
  const [profiles, setProfiles] = useState<CulpritProfile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    setLoading(true);
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      const parsed = data ? JSON.parse(data) : [];
      setProfiles(parsed);
    } catch (error) {
      console.error('Failed to load profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = (profile: CulpritProfile) => {
    setLoading(true);
    try {
      const existingProfiles = profiles;
      const updatedProfiles = [...existingProfiles, profile];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfiles));
      setProfiles(updatedProfiles);
      return profile;
    } catch (error) {
      console.error('Failed to save profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = (id: string, profile: CulpritProfile) => {
    setLoading(true);
    try {
      const updatedProfiles = profiles.map(p => p.id === id ? profile : p);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfiles));
      setProfiles(updatedProfiles);
      return profile;
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = (id: string) => {
    setLoading(true);
    try {
      const updatedProfiles = profiles.filter(p => p.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfiles));
      setProfiles(updatedProfiles);
    } catch (error) {
      console.error('Failed to delete profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getProfileById = (id: string): CulpritProfile | undefined => {
    return profiles.find(p => p.id === id);
  };

  return {
    profiles,
    loading,
    saveProfile,
    updateProfile,
    deleteProfile,
    getProfileById,
    refreshProfiles: loadProfiles,
  };
};
