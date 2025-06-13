import bcrypt from 'bcrypt';
import { supabase } from '../index.js';
import { User } from '../models/user.js';
import { generateToken } from '../utils/jwt.js';

// Đăng ký tài khoản mới
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields: username, email, and password are required' 
      });
    }

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('email')
      .eq('email', email)
      .single();

    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Create new user
    const userData = await User.create({
      username,
      email,
      password,
      role: 'user'
    });

    // Generate JWT token
    const token = generateToken(userData);

    // Remove password from response
    delete userData.password;

    return res.status(201).json({
      message: 'Registration successful',
      user: userData,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      error: error.message || 'Internal server error' 
    });
  }
};

// Đăng nhập
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare password with hashed password in database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);

    // Only return the token
    return res.status(200).json({
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
