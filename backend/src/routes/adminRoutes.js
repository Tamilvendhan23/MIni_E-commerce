import express from 'express';
import { body } from 'express-validator';
import {
  getAllUsers,
  createProduct,
  updateProduct,
  deleteProduct,
  updateOrderStatus,
  getOrderAnalytics
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

// Apply admin protection to all routes
router.use(protect, admin);

// User management
router.get('/users', getAllUsers);

// Product management
router.post(
  '/products',
  upload.array('images', 5),
  [
    body('name').notEmpty().trim(),
    body('description').notEmpty(),
    body('price').isFloat({ min: 0 }),
    body('category').notEmpty(),
    body('brand').notEmpty(),
    body('stock').isInt({ min: 0 })
  ],
  createProduct
);

router.put(
  '/products/:id',
  upload.array('images', 5),
  [
    body('name').optional().trim(),
    body('price').optional().isFloat({ min: 0 }),
    body('stock').optional().isInt({ min: 0 })
  ],
  updateProduct
);

router.delete('/products/:id', deleteProduct);

// Order management
router.put(
  '/orders/:id',
  [
    body('status').isIn(['pending', 'processing', 'shipped', 'delivered', 'cancelled']),
    body('trackingNumber').optional().trim(),
    body('estimatedDeliveryDate').optional().isISO8601()
  ],
  updateOrderStatus
);

// Analytics
router.get('/analytics', getOrderAnalytics);

export default router;