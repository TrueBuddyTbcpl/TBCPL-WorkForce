import apiClient from './apiClient';

export interface LinkedProfile {
  id: number;
  profileId: number;
  profileNumber: string;
  profileName: string;
  linkedBy: string;
  linkedAt: string;
}

export const getLinkedProfiles = async (caseId: number): Promise<LinkedProfile[]> => {
  const res = await apiClient.get(`/operation/cases/${caseId}/linked-profiles`);
  return res.data.data;
};

export const linkProfile = async (
  caseId: number,
  profileId: number,
  profileNumber: string,
  profileName: string
): Promise<LinkedProfile> => {
  const res = await apiClient.post(`/operation/cases/${caseId}/linked-profiles`, {
    profileId, profileNumber, profileName,
  });
  return res.data.data;
};

export const unlinkProfile = async (
  caseId: number,
  profileId: number
): Promise<void> => {
  await apiClient.delete(`/operation/cases/${caseId}/linked-profiles/${profileId}`);
};
