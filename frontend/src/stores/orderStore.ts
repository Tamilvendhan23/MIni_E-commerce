import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from '../types';

interface ShippingInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface PaymentInfo {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered';
  items: CartItem[];
  shippingInfo: ShippingInfo;
  paymentInfo: Partial<PaymentInfo>;
  shippingMethod: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  total: number;
}

interface OrderStore {
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'date' | 'status'>) => void;
  fetchOrders: () => void;
  getOrderById: (id: string) => Order | undefined;
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set, get) => ({
      orders: [],
      
      createOrder: (orderData) => {
        const newOrder: Order = {
          ...orderData,
          id: `ORD-${Math.floor(Math.random() * 100000)}`,
          date: new Date().toISOString(),
          status: 'Pending'
        };
        
        set((state) => ({
          orders: [newOrder, ...state.orders]
        }));
      },
      
      fetchOrders: () => {
        // In a real app, this would be an API call
        // For demo purposes, we're using the persisted orders
        
        // If no orders exist, create a sample order
        const { orders } = get();
        
        if (orders.length === 0) {
          const sampleOrder: Order = {
            id: `ORD-${Math.floor(Math.random() * 100000)}`,
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
            status: 'Delivered',
            items: [
              {
                id: '1',
                name: 'Wireless Headphones',
                price: 79.99,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
                quantity: 1,
                category: 'Electronics',
                description: 'High-quality wireless headphones with noise cancellation.',
                rating: 4.5,
                reviewCount: 120,
                discount: 0
              },
              {
                id: '2',
                name: 'Smart Watch',
                price: 199.99,
                image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1099&q=80',
                quantity: 1,
                category: 'Electronics',
                description: 'Smart watch with fitness tracking and notifications.',
                rating: 4.2,
                reviewCount: 85,
                discount: 10
              }
            ],
            shippingInfo: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john.doe@example.com',
              phone: '555-123-4567',
              address: '123 Main St',
              city: 'Anytown',
              state: 'CA',
              zipCode: '12345',
              country: 'United States'
            },
            paymentInfo: {
              cardName: 'John Doe',
              cardNumber: '****4242'
            },
            shippingMethod: 'standard',
            subtotal: 279.98,
            shippingCost: 0,
            tax: 19.60,
            total: 299.58
          };
          
          set({ orders: [sampleOrder] });
        }
      },
      
      getOrderById: (id) => {
        return get().orders.find(order => order.id === id);
      }
    }),
    {
      name: 'order-storage'
    }
  )
);