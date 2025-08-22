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

  static initializeDemoUsers(): void {
    const existingUsers = this.getUsers();
    if (existingUsers.length === 0) {
      // Create demo users for easy testing
      const demoUsers: User[] = [
        {
          id: 'demo_buyer_1',
          name: 'John Buyer',
          email: 'buyer@demo.com',
          role: 'buyer',
          companyName: 'Demo Purchasing Corp',
          businessType: 'Trading',
          phone: '+1-555-0123',
          address: {
            street: '123 Business St',
            city: 'Demo City',
            state: 'Demo State',
            country: 'Demo Country',
            zipCode: '12345'
          },
          isVerified: true,
          avatar: undefined,
          lastLogin: new Date().toISOString(),
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: new Date().toISOString()
        },
        {
          id: 'demo_supplier_1',
          name: 'Sarah Supplier',
          email: 'supplier@demo.com',
          role: 'supplier',
          companyName: 'Demo Manufacturing Ltd',
          businessType: 'Manufacturing',
          phone: '+1-555-0456',
          address: {
            street: '456 Factory Ave',
            city: 'Industrial City',
            state: 'Production State',
            country: 'Manufacturing Country',
            zipCode: '67890'
          },
          isVerified: true,
          avatar: undefined,
          lastLogin: new Date().toISOString(),
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: new Date().toISOString()
        }
      ];
      
      localStorage.setItem(this.USERS_KEY, JSON.stringify(demoUsers));
    }
  }

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
    // Initialize demo users on first load
    MockStorage.initializeDemoUsers();
  }

  private async checkBackendAvailability(): Promise<boolean> {
    if (this.isBackendAvailable !== null) {
      return this.isBackendAvailable;
    }

    try {
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

      const response = await fetch(`${this.baseURL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      this.isBackendAvailable = response.ok;
    } catch (error) {
      // Any error means backend is not available - this is fine for demo mode
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
    let isBackendAvailable = false;
    
    try {
      isBackendAvailable = await this.checkBackendAvailability();
    } catch (error) {
      // If checking backend availability fails, just use mock mode
      isBackendAvailable = false;
    }

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
        console.log('Backend login failed, falling back to mock mode');
      }
    }

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay

    const user = MockStorage.findUser(credentials.email);
    if (!user) {
      throw new Error('Invalid credentials. Try: buyer@demo.com or supplier@demo.com (any password)');
    }

    // In demo mode, any password works
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
    let isBackendAvailable = false;
    
    try {
      isBackendAvailable = await this.checkBackendAvailability();
    } catch (error) {
      // If checking backend availability fails, just use mock mode
      isBackendAvailable = false;
    }

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
        console.log('Backend registration failed, falling back to mock mode');
      }
    }

    // Mock implementation
    await new Promise(resolve => setTimeout(resolve, 1200)); // Simulate network delay

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
    let isBackendAvailable = false;
    
    try {
      isBackendAvailable = await this.checkBackendAvailability();
    } catch (error) {
      // If checking backend availability fails, just use mock mode
      isBackendAvailable = false;
    }

    if (isBackendAvailable && this.token && !this.token.startsWith('mock_token_')) {
      try {
        const response = await this.request('/auth/logout', {
          method: 'POST',
        });
        
        this.setToken(null);
        MockStorage.clearCurrentUser();
        return response;
      } catch (error) {
        // Fall back to mock if backend fails
        console.log('Backend logout failed, falling back to mock mode');
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
    let isBackendAvailable = false;
    
    try {
      isBackendAvailable = await this.checkBackendAvailability();
    } catch (error) {
      // If checking backend availability fails, just use mock mode
      isBackendAvailable = false;
    }

    if (isBackendAvailable && this.token && !this.token.startsWith('mock_token_')) {
      try {
        return await this.request<User>('/auth/me');
      } catch (error) {
        // Fall back to mock if backend fails
        console.log('Backend getCurrentUser failed, falling back to mock mode');
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
    let isBackendAvailable = false;
    
    try {
      isBackendAvailable = await this.checkBackendAvailability();
    } catch (error) {
      // If checking backend availability fails, just use mock mode
      isBackendAvailable = false;
    }

    if (isBackendAvailable && this.token && !this.token.startsWith('mock_token_')) {
      try {
        return await this.request<User>('/auth/profile', {
          method: 'PUT',
          body: JSON.stringify(userData),
        });
      } catch (error) {
        // Fall back to mock if backend fails
        console.log('Backend updateProfile failed, falling back to mock mode');
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
    let isBackendAvailable = false;
    
    try {
      isBackendAvailable = await this.checkBackendAvailability();
    } catch (error) {
      // If checking backend availability fails, just use mock mode
      isBackendAvailable = false;
    }

    if (isBackendAvailable) {
      return this.request('/health');
    }

    return {
      success: true,
      message: 'Mock API is running - Backend not available'
    };
  }
}

export const apiClient = new ApiClient();
export type { User, LoginCredentials, RegisterData, ApiResponse };
