import { create } from 'zustand';
import { Product } from '../types';
import { mockProducts } from '../data/mockProducts';

interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

interface ProductStore {
  products: Product[];
  featuredProducts: Product[];
  newArrivals: Product[];
  relatedProducts: Product[];
  categories: string[];
  isLoading: boolean;
  error: string | null;
  fetchProducts: (filters?: ProductFilters) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  featuredProducts: [],
  newArrivals: [],
  relatedProducts: [],
  categories: ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty', 'Sports', 'Books'],
  isLoading: false,
  error: null,
  
  fetchProducts: async (filters = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      // In a real app, this would be an API call
      // For demo purposes, we're using mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      let filteredProducts = [...mockProducts];
      
      // Apply filters
      if (filters.category) {
        filteredProducts = filteredProducts.filter(
          product => product.category.toLowerCase() === filters.category?.toLowerCase()
        );
      }
      
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(
          product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
      }
      
      if (filters.minPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          product => {
            const finalPrice = product.discount > 0 
              ? product.price * (1 - product.discount / 100) 
              : product.price;
            return finalPrice >= filters.minPrice!;
          }
        );
      }
      
      if (filters.maxPrice !== undefined) {
        filteredProducts = filteredProducts.filter(
          product => {
            const finalPrice = product.discount > 0 
              ? product.price * (1 - product.discount / 100) 
              : product.price;
            return finalPrice <= filters.maxPrice!;
          }
        );
      }
      
      // Apply sorting
      if (filters.sort) {
        switch (filters.sort) {
          case 'price-low':
            filteredProducts.sort((a, b) => {
              const aPrice = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
              const bPrice = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
              return aPrice - bPrice;
            });
            break;
          case 'price-high':
            filteredProducts.sort((a, b) => {
              const aPrice = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price;
              const bPrice = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price;
              return bPrice - aPrice;
            });
            break;
          case 'newest':
            filteredProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
          default:
            // 'featured' is default
            filteredProducts.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        }
      }
      
      // Set featured products
      const featured = mockProducts.filter(product => product.featured);
      
      // Set new arrivals
      const arrivals = [...mockProducts].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ).slice(0, 8);
      
      // Set related products (random selection for demo)
      const related = [...mockProducts].sort(() => 0.5 - Math.random()).slice(0, 8);
      
      set({ 
        products: filteredProducts,
        featuredProducts: featured,
        newArrivals: arrivals,
        relatedProducts: related,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch products. Please try again.',
        isLoading: false 
      });
    }
  },
  
  getProductById: (id) => {
    // First check in current products
    let product = get().products.find(p => p.id === id);
    
    // If not found, check in mock data
    if (!product) {
      product = mockProducts.find(p => p.id === id);
    }
    
    return product;
  }
}));