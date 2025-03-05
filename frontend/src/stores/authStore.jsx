// src/stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Define the shape of our auth state
interface AuthState {
  isAuthenticated: boolean;
  user: {
    id?: string;
    email?: string;
    name?: string;
  } | null;
  login: (userData: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  setUser: (user: AuthState['user']) => void;
}

// Create the store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      // Login function (mock implementation - replace with actual API call)
      login: async (userData: { email: string; password: string }) => {
        try {
          // Simulate API call
          // In a real app, this would be an API call to your backend
          const mockResponse = {
            id: '1',
            email: userData.email,
            name: 'User Name', // This would come from your backend
            token: 'mock-jwt-token' // This would be a real JWT token
          };

          set({
            isAuthenticated: true,
            user: {
              id: mockResponse.id,
              email: mockResponse.email,
              name: mockResponse.name
            }
          });
          
          // Store token in localStorage if needed
          localStorage.setItem('token', mockResponse.token);
        } catch (error) {
          console.error('Login failed:', error);
          throw error;
        }
      },

      // Logout function
      logout: () => {
        set({
          isAuthenticated: false,
          user: null
        });
        localStorage.removeItem('token');
      },

      // Set user manually (useful for initial load or after registration)
      setUser: (user) => {
        set({
          isAuthenticated: !!user,
          user: user
        });
      }
    }),
    {
      name: 'auth-storage', // name of the item in localStorage
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          return str ? JSON.parse(str) : null;
        },
        setItem: (name, value) => localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

// Optional: Add a function to check auth status on app load
export const checkAuthStatus = () => {
  const token = localStorage.getItem('token');
  if (token) {
    // Here you could verify the token with your backend
    // For this example, we'll just set a mock user
    useAuthStore.getState().setUser({
      id: '1',
      email: 'user@example.com',
      name: 'User Name'
    });
  }
};