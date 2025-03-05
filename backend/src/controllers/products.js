import { mockProducts } from '../data/mockProducts.js';

// Get all products with optional filtering
export const getProducts = (req, res) => {
  try {
    const { category, minPrice, maxPrice, sort } = req.query;
    
    let filteredProducts = [...mockProducts];
    
    // Apply category filter
    if (category) {
      filteredProducts = filteredProducts.filter(
        product => product.category.toLowerCase() === category.toLowerCase()
      );
    }
    
    // Apply price filters
    if (minPrice) {
      filteredProducts = filteredProducts.filter(
        product => {
          const finalPrice = product.discount > 0 
            ? product.price * (1 - product.discount / 100) 
            : product.price;
          return finalPrice >= parseFloat(minPrice);
        }
      );
    }
    
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(
        product => {
          const finalPrice = product.discount > 0 
            ? product.price * (1 - product.discount / 100) 
            : product.price;
          return finalPrice <= parseFloat(maxPrice);
        }
      );
    }
    
    // Apply sorting
    if (sort) {
      switch (sort) {
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
    
    res.json(filteredProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single product by ID
export const getProductById = (req, res) => {
  try {
    const product = mockProducts.find(p => p.id === req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Search products
export const searchProducts = (req, res) => {
  try {
    const searchTerm = req.params.query.toLowerCase();
    
    const results = mockProducts.filter(
      product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm)
    );
    
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};