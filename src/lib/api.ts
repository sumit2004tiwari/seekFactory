const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  user?: T;
  token?: string;
  errors?: string[];
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'buyer' | 'supplier';
  companyName?: string;
  businessType?: string;
  phone?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'supplier' | 'admin';
  companyName?: string;
  businessType?: string;
  phone?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    zipCode?: string;
  };
  isVerified: boolean;
  avatar?: string;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

// Mock storage for demo purposes
class MockStorage {
  private static USERS_KEY = 'demo_users';
  private static CURRENT_USER_KEY = 'demo_current_user';

  static getUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  static saveUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  static findUser(email: string): User | null {
    const users = this.getUsers();
    return users.find(u => u.email === email) || null;
  }

  static setCurrentUser(user: User): void {
    localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(user));
  }

  static getCurrentUser(): User | null {
    const user = localStorage.getItem(this.CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static clearCurrentUser(): void {
    localStorage.removeItem(this.CURRENT_USER_KEY);
  }
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;
  private isBackendAvailable: boolean | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('auth_token');
  }

  private async checkBackendAvailability(): Promise<boolean> {
    if (this.isBackendAvailable !== null) {
      return this.isBackendAvailable;
    }

    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      this.isBackendAvailable = response.ok;
    } catch (error) {
      this.isBackendAvailable = false;
    }

    return this.isBackendAvailable;
  }

  private generateMockToken(): string {
    return 'mock_token_' + Math.random().toString(36).substr(2, 9);
  }

  private createMockUser(userData: RegisterData): User {
    return {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email: userData.email,
      role: userData.role || 'buyer',
      companyName: userData.companyName,
      businessType: userData.businessType,
      phone: userData.phone,
      address: {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: ''
      },
      isVerified: false,
      avatar: undefined,
      lastLogin: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'An error occurred');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('auth_token', token);
    } else {
      localStorage.removeItem('auth_token');
    }
  }

  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    const isBackendAvailable = await this.checkBackendAvailability();

    if (isBackendAvailable) {
      try {
        const response = await this.request<User>('/auth/login', {
          method: 'POST',
          body: JSON.stringify(credentials),
        });

        if (response.success && response.token) {
          this.setToken(response.token);
        }

        return response;
      } catch (error) {
        // Fall back to mock if backend fails
      }
    }

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const user = MockStorage.findUser(credentials.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateMockToken();
    this.setToken(token);
    MockStorage.setCurrentUser(user);

    return {
      success: true,
      message: 'Login successful',
      user,
      token
    };
  }

  async register(userData: RegisterData): Promise<ApiResponse<User>> {
    const isBackendAvailable = await this.checkBackendAvailability();

    if (isBackendAvailable) {
      try {
        const response = await this.request<User>('/auth/register', {
          method: 'POST',
          body: JSON.stringify(userData),
        });

        if (response.success && response.token) {
          this.setToken(response.token);
        }

        return response;
      } catch (error) {
        // Fall back to mock if backend fails
      }
    }

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay

    // Check if user already exists
    const existingUser = MockStorage.findUser(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const user = this.createMockUser(userData);
    const token = this.generateMockToken();

    MockStorage.saveUser(user);
    MockStorage.setCurrentUser(user);
    this.setToken(token);

    return {
      success: true,
      message: 'User registered successfully',
      user,
      token
    };
  }

  async logout(): Promise<ApiResponse> {
    const isBackendAvailable = await this.checkBackendAvailability();

    if (isBackendAvailable) {
      try {
        const response = await this.request('/auth/logout', {
          method: 'POST',
        });
        
        this.setToken(null);
        MockStorage.clearCurrentUser();
        return response;
      } catch (error) {
        // Fall back to mock if backend fails
      }
    }

    // Mock implementation
    this.setToken(null);
    MockStorage.clearCurrentUser();

    return {
      success: true,
      message: 'Logout successful'
    };
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    const isBackendAvailable = await this.checkBackendAvailability();

    if (isBackendAvailable && this.token && !this.token.startsWith('mock_token_')) {
      try {
        return await this.request<User>('/auth/me');
      } catch (error) {
        // Fall back to mock if backend fails
      }
    }

    // Mock implementation
    const user = MockStorage.getCurrentUser();
    if (!user) {
      throw new Error('No user found');
    }

    return {
      success: true,
      user
    };
  }

  async updateProfile(userData: Partial<User>): Promise<ApiResponse<User>> {
    const isBackendAvailable = await this.checkBackendAvailability();

    if (isBackendAvailable && this.token && !this.token.startsWith('mock_token_')) {
      try {
        return await this.request<User>('/auth/profile', {
          method: 'PUT',
          body: JSON.stringify(userData),
        });
      } catch (error) {
        // Fall back to mock if backend fails
      }
    }

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

    const currentUser = MockStorage.getCurrentUser();
    if (!currentUser) {
      throw new Error('No user found');
    }

    const updatedUser = { ...currentUser, ...userData };
    MockStorage.setCurrentUser(updatedUser);

    // Update in users array
    const users = MockStorage.getUsers();
    const userIndex = users.findIndex(u => u.id === currentUser.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      localStorage.setItem('demo_users', JSON.stringify(users));
    }

    return {
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    };
  }

  // Health check
  async checkHealth(): Promise<ApiResponse> {
    const isBackendAvailable = await this.checkBackendAvailability();

    if (isBackendAvailable) {
      return this.request('/health');
    }

    return {
      success: true,
      message: 'Mock API is running'
    };
  }
}

export const apiClient = new ApiClient();
export type { User, LoginCredentials, RegisterData, ApiResponse };
