import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: Partial<User>) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      
      login: async (email, password) => {
        // In a real app, this would be an API call
        // For demo purposes, we're simulating a successful login
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data
        const user = {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          email: email,
          phone: '555-123-4567',
          address: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345'
        };
        
        set({ user, isAuthenticated: true });
      },
      
      register: async (userData) => {
        // In a real app, this would be an API call
        // For demo purposes, we're simulating a successful registration
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Registration successful, but user needs to log in
        set({ user: null, isAuthenticated: false });
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      updateProfile: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null
        }));
      }
    }),
    {
      name: 'auth-storage'
    }
  )
);