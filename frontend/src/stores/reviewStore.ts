import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  verified: boolean;
}

interface ReviewStore {
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getProductReviews: (productId: string) => Review[];
  hasUserPurchasedProduct: (userId: string, productId: string) => boolean;
  hasUserReviewedProduct: (userId: string, productId: string) => boolean;
}

export const useReviewStore = create<ReviewStore>()(
  persist(
    (set, get) => ({
      reviews: [],
      
      addReview: (reviewData) => {
        const newReview: Review = {
          ...reviewData,
          id: `rev_${Date.now()}`,
          createdAt: new Date().toISOString()
        };
        
        set((state) => ({
          reviews: [newReview, ...state.reviews]
        }));
      },
      
      getProductReviews: (productId) => {
        return get().reviews.filter(review => review.productId === productId);
      },
      
      hasUserPurchasedProduct: (userId, productId) => {
        // In a real app, this would check the order history
        // For demo purposes, we'll simulate this
        return Math.random() > 0.5;
      },
      
      hasUserReviewedProduct: (userId, productId) => {
        return get().reviews.some(
          review => review.userId === userId && review.productId === productId
        );
      }
    }),
    {
      name: 'review-storage'
    }
  )
);