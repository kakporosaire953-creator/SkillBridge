import { apiClient } from './apiClient';

export const projectsApi = {
  createProject: (data: any) => apiClient.post('/api/projects', data),
  updateProject: (id: string, data: any) => apiClient.patch(`/api/projects/${id}`, data),
  deleteProject: (id: string) => apiClient.delete(`/api/projects/${id}`),
  getUserProjects: (userId: string) => apiClient.get(`/api/users/${userId}/projects`),
};
