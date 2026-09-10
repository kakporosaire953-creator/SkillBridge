const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export const isApiConfigured = () => {
  return BASE_URL !== '' && BASE_URL !== undefined;
};

const getAuthToken = () => {
  // Temporary: In the future, you may want to extract this directly from a more secure storage or context
  // But for now we rely on the localStorage key used by AuthContext to store the session if needed
  return localStorage.getItem('sb_access_token') || null;
};

export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    if (!isApiConfigured()) {
      throw new Error('API_NOT_CONFIGURED');
    }

    const url = `${BASE_URL}${endpoint}`;
    const token = getAuthToken();

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        if (response.status === 401) {
          console.error('Erreur 401: Non autorisé');
          // Implémenter la logique de déconnexion ou refresh token ici
        } else if (response.status === 403) {
          console.error('Erreur 403: Accès refusé');
        } else if (response.status === 404) {
          console.error('Erreur 404: Ressource introuvable');
        } else if (response.status >= 500) {
          console.error('Erreur 500: Erreur interne du serveur');
        }

        let errorMessage = `HTTP Error ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.message) errorMessage = errorData.message;
        } catch (e) {
          // Ignorer si le corps n'est pas du JSON
        }
        
        throw new Error(errorMessage);
      }

      // Handle 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if ((error as Error).message === 'API_NOT_CONFIGURED') {
        throw error; // Let the caller fallback to Mocks
      }
      console.error('Network Error or fetch failed:', error);
      throw error;
    }
  },

  get<T>(endpoint: string, headers?: HeadersInit) {
    return this.request<T>(endpoint, { method: 'GET', headers });
  },

  post<T>(endpoint: string, body: any, headers?: HeadersInit) {
    return this.request<T>(endpoint, { method: 'POST', body: JSON.stringify(body), headers });
  },

  patch<T>(endpoint: string, body: any, headers?: HeadersInit) {
    return this.request<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body), headers });
  },

  delete<T>(endpoint: string, headers?: HeadersInit) {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
};
