import express from 'express';
import { getProducts, getProductById, searchProducts } from '../controllers/products.js';

const router = express.Router();

// Get all products with optional filtering
router.get('/', getProducts);

// Get a single product by ID
router.get('/:id', getProductById);

// Search products
router.get('/search/:query', searchProducts);

export default router;