// Mock orders database
let orders = [];

// Create a new order
export const createOrder = (req, res) => {
  try {
    const { items, shippingInfo, paymentInfo, shippingMethod, subtotal, shippingCost, tax, total } = req.body;
    
    // Create new order
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 100000)}`,
      userId: req.user.id,
      date: new Date().toISOString(),
      status: 'Pending',
      items,
      shippingInfo,
      paymentInfo,
      shippingMethod,
      subtotal,
      shippingCost,
      tax,
      total
    };
    
    // Add to orders array
    orders.push(newOrder);
    
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all orders for the logged-in user
export const getOrders = (req, res) => {
  try {
    // Filter orders by user ID
    const userOrders = orders.filter(order => order.userId === req.user.id);
    
    res.json(userOrders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single order by ID
export const getOrderById = (req, res) => {
  try {
    // Find order
    const order = orders.find(order => order.id === req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    
    // Check if order belongs to user
    if (order.userId !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};