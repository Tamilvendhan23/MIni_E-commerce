import express from 'express';
import { createOrder, getOrders, getOrderById } from '../controllers/orders.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Create a new order (protected route)
router.post('/', protect, createOrder);

// Get all orders for the logged-in user (protected route)
router.get('/', protect, getOrders);

// Get a single order by ID (protected route)
router.get('/:id', protect, getOrderById);

export default router;