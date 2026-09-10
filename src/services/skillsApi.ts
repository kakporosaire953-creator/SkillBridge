import { apiClient } from './apiClient';

export const skillsApi = {
  createSkill: (data: any) => apiClient.post('/api/skills', data),
  deleteSkill: (id: string) => apiClient.delete(`/api/skills/${id}`),
  getUserSkills: (userId: string) => apiClient.get(`/api/users/${userId}/skills`),
};
