const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const { getDB } = require('../config/db');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().optional(),
  organization: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

async function register(req, res) {
  try {
    const db = await getDB();
    const { name, email, password, role, organization } = req.body;

    const existingUser = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userRole = role || 'Sustainability Officer';
    const userOrg = organization || 'GreenCorp Tech Campus';

    const result = await db.run(
      'INSERT INTO users (name, email, password, role, organization) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, userRole, userOrg]
    );

    const token = jwt.sign(
      { id: result.lastID, email, name, role: userRole, organization: userOrg },
      process.env.JWT_SECRET || 'ecometrics_super_secret_jwt_key_2026_sustainability',
      { expiresIn: '7d' }
    );

    return res.status(201).json({
      message: 'Account registered successfully',
      token,
      user: { id: result.lastID, name, email, role: userRole, organization: userOrg }
    });
  } catch (err) {
    console.error('Registration error:', err);
    return res.status(500).json({ message: 'Internal server error during registration.' });
  }
}

async function login(req, res) {
  try {
    const db = await getDB();
    const { email, password } = req.body;

    const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, name: user.name, role: user.role, organization: user.organization },
      process.env.JWT_SECRET || 'ecometrics_super_secret_jwt_key_2026_sustainability',
      { expiresIn: '7d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, organization: user.organization }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error during login.' });
  }
}

async function getProfile(req, res) {
  try {
    const db = await getDB();
    const user = await db.get('SELECT id, name, email, role, organization, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch user profile.' });
  }
}

module.exports = {
  register,
  login,
  getProfile,
  registerSchema,
  loginSchema
};
