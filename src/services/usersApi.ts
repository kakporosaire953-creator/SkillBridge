import { apiClient } from './apiClient';

export const usersApi = {
  getMe: () => apiClient.get('/api/users/me'),
  updateMe: (data: any) => apiClient.patch('/api/users/me', data),
};
