export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  description: string;
  shortDescription?: string;
  rating: number;
  reviewCount: number;
  discount: number;
  featured?: boolean;
  brand?: string;
  createdAt: string;
}

export interface CartItem extends Product {
  quantity: number;
}