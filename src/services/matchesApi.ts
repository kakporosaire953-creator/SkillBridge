import { apiClient } from './apiClient';

export const matchesApi = {
  getMatch: (opportunityId: string, userId: string) => apiClient.get(`/api/opportunities/${opportunityId}/match/${userId}`),
  getUserMatches: (userId: string) => apiClient.get(`/api/users/${userId}/matches`),
};
