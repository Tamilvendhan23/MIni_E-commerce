import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      cart: [],
      
      addToCart: (product, quantity = 1) => {
        const { cart } = get();
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
          // Update quantity if item already exists
          set({
            cart: cart.map(item => 
              item.id === product.id 
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          });
        } else {
          // Add new item
          set({
            cart: [...cart, { ...product, quantity }]
          });
        }
      },
      
      removeFromCart: (productId) => {
        const { cart } = get();
        set({
          cart: cart.filter(item => item.id !== productId)
        });
      },
      
      updateQuantity: (productId, quantity) => {
        const { cart } = get();
        set({
          cart: cart.map(item => 
            item.id === productId 
              ? { ...item, quantity }
              : item
          )
        });
      },
      
      clearCart: () => {
        set({ cart: [] });
      }
    }),
    {
      name: 'cart-storage'
    }
  )
);