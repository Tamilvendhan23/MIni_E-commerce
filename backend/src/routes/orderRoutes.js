import express from 'express';
import { body } from 'express-validator';
import {
  createOrder,
  getUserOrders,
  getOrderById
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post(
  '/',
  [
    body('items').isArray(),
    body('items.*.product').isMongoId(),
    body('items.*.quantity').isInt({ min: 1 }),
    body('shippingAddress').notEmpty(),
    body('paymentInfo').notEmpty()
  ],
  createOrder
);

router.get('/', getUserOrders);
router.get('/:id', getOrderById);

export default router;