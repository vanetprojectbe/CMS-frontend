import { api, API_BASE_URL } from '@/lib/apiClient';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface LoginResponse {
  token: string;
  user: AuthUser;
}

export const authApi = {
  login: (email: string, password: string) =>
    api.post<LoginResponse>('/auth/login', { email, password }),

  logout: () => api.post<void>('/auth/logout', {}),

  me: () => api.get<AuthUser>('/auth/me'),
};
