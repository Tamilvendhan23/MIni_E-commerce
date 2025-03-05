import jwt from 'jsonwebtoken';

// Mock users database (same as in auth controller)
let users = [];

// Protect routes middleware
export const protect = (req, res, next) => {
  try {
    let token;
    
    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    
    // Find user
    const user = users.find(user => user.id === decoded.id);
    
    if (!user) {
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }
    
    // Attach user to request
    req.user = user;
    
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};