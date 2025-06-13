import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import session from 'express-session';
import { createClient } from '@supabase/supabase-js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Initialize Supabase client
export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Import routes
import healthCheckRoutes from './routes/healthCheck.js';
import userRoutes from './routes/user.js';
import authRoutes from './routes/auth.js';
import cultureTestRoutes from './routes/culture_test.js';

// Use routes
app.use('/api', healthCheckRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/culturetest', cultureTestRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});