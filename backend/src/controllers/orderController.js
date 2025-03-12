import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentInfo,
      shippingCost,
      tax
    } = req.body;
    
    // Validate stock and calculate total
    let subtotal = 0;
    for (const item of items) {
      const product = await Product.findById(item.product);
      
      if (!product) {
        return res.status(404).json({ message: `Product ${item.product} not found` });
      }
      
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
      }
      
      // Update stock
      product.stock -= item.quantity;
      await product.save();
      
      // Calculate item total with discount
      const price = product.discount > 0 
        ? product.price * (1 - product.discount / 100)
        : product.price;
      
      subtotal += price * item.quantity;
    }
    
    const total = subtotal + shippingCost + tax;
    
    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      paymentInfo,
      subtotal,
      shippingCost,
      tax,
      total
    });
    
    const populatedOrder = await order.populate([
      { path: 'user', select: 'firstName lastName email' },
      { path: 'items.product', select: 'name price images' }
    ]);
    
    res.status(201).json(populatedOrder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort('-createdAt')
      .populate([
        { path: 'user', select: 'firstName lastName email' },
        { path: 'items.product', select: 'name price images' }
      ]);
    
    res.json(orders);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate([
        { path: 'user', select: 'firstName lastName email' },
        { path: 'items.product', select: 'name price images' }
      ]);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if the order belongs to the user or user is admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};