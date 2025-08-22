const API_BASE_URL = '/api';

interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data?: T;
  token?: string;
  errors?: any[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  companyName?: string;
  phone?: string;
  businessType?: string;
  isVerified: boolean;
  isEmailVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  companyName?: string;
  phone?: string;
  businessType?: string;
  role?: string;
}

class ApiClient {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('auth_token');
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      return data;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Network error');
    }
  }

  async register(userData: RegisterData): Promise<{ user: User; token: string }> {
    const response = await this.makeRequest<{ user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return {
      user: response.data!.user,
      token: response.token!,
    };
  }

  async login(credentials: LoginData): Promise<{ user: User; token: string }> {
    const response = await this.makeRequest<{ user: User }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.token) {
      this.setToken(response.token);
    }

    return {
      user: response.data!.user,
      token: response.token!,
    };
  }

  async logout(): Promise<void> {
    try {
      await this.makeRequest('/auth/logout', {
        method: 'POST',
      });
    } finally {
      this.clearToken();
    }
  }

  async getCurrentUser(): Promise<User> {
    const response = await this.makeRequest<{ user: User }>('/auth/me');
    return response.data!.user;
  }

  async updateProfile(updateData: Partial<RegisterData>): Promise<User> {
    const response = await this.makeRequest<{ user: User }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
    return response.data!.user;
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  clearToken(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  getToken(): string | null {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }
}

export const apiClient = new ApiClient();
export type { User, LoginData, RegisterData };
