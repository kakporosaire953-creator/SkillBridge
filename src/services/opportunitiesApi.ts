import { apiClient } from './apiClient';

export const opportunitiesApi = {
  createOpportunity: (data: any) => apiClient.post('/api/opportunities', data),
  getOpportunities: () => apiClient.get('/api/opportunities'),
  getOpportunityById: (id: string) => apiClient.get(`/api/opportunities/${id}`),
  updateOpportunity: (id: string, data: any) => apiClient.patch(`/api/opportunities/${id}`, data),
};
