import { apiClient } from './apiClient';

export const passportApi = {
  getPassport: (identifiantPublic: string) => apiClient.get(`/api/passport/${identifiantPublic}`),
};
