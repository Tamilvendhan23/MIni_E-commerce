import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock users database
let users = [];

// Register a new user
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: Date.now().toString(),
      firstName,
      lastName,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    // Add to users array
    users.push(newUser);
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(user => user.email === email);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '30d' }
    );
    
    // Return user data without password
    const { password: _, ...userData } = user;
    
    res.json({
      ...userData,
      token
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user profile
export const getProfile = (req, res) => {
  try {
    // User is already attached to req by the protect middleware
    const { password, ...userData } = req.user;
    
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateProfile = (req, res) => {
  try {
    const { firstName, lastName, phone, address, city, state, zipCode } = req.body;
    
    // Find user index
    const userIndex = users.findIndex(user => user.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Update user data
    users[userIndex] = {
      ...users[userIndex],
      firstName: firstName || users[userIndex].firstName,
      lastName: lastName || users[userIndex].lastName,
      phone: phone || users[userIndex].phone,
      address: address || users[userIndex].address,
      city: city || users[userIndex].city,
      state: state || users[userIndex].state,
      zipCode: zipCode || users[userIndex].zipCode,
      updatedAt: new Date().toISOString()
    };
    
    // Return updated user without password
    const { password, ...userData } = users[userIndex];
    
    res.json(userData);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};