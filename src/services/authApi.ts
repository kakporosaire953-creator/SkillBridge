import { apiClient } from './apiClient';

export const authApi = {
  register: (data: any) => apiClient.post('/api/auth/register', data),
  login: (data: any) => apiClient.post('/api/auth/login', data),
};
