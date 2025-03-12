import express from 'express';
import {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getNewArrivals
} from '../controllers/productController.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/:id', getProductById);

export default router;