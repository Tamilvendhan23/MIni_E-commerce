import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import sharp from 'sharp';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, brand, stock } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Please upload at least one product image' });
    }
    
    const processedImages = await Promise.all(
      req.files.map(file => 
        sharp(file.buffer)
          .resize(800, 800, { fit: 'inside' })
          .jpeg({ quality: 90 })
          .toBuffer()
      )
    );
    
    // In a real app, save to cloud storage and get URLs
    const imageUrls = processedImages.map(
      buffer => `data:image/jpeg;base64,${buffer.toString('base64')}`
    );
    
    const product = await Product.create({
      name,
      description,
      price,
      images: imageUrls,
      category,
      brand,
      stock
    });
    
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const updates = req.body;
    
    if (req.files && req.files.length > 0) {
      const processedImages = await Promise.all(
        req.files.map(file => 
          sharp(file.buffer)
            .resize(800, 800, { fit: 'inside' })
            .jpeg({ quality: 90 })
            .toBuffer()
        )
      );
      
      updates.images = processedImages.map(
        buffer => `data:image/jpeg;base64,${buffer.toString('base64')}`
      );
    }
    
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );
    
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingNumber, estimatedDeliveryDate } = req.body;
    
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    order.status = status || order.status;
    order.trackingNumber = trackingNumber || order.trackingNumber;
    order.estimatedDeliveryDate = estimatedDeliveryDate || order.estimatedDeliveryDate;
    
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrderAnalytics = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$total' } } }
    ]);
    
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    
    const recentOrders = await Order.find()
      .sort('-createdAt')
      .limit(10)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name price');
    
    res.json({
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersByStatus,
      recentOrders
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};