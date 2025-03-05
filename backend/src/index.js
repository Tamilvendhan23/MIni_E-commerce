import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import ordersRoutes from './routes/orders.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('E-commerce API is running');
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});