const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const logger = require('../utils/logger');

// Metodo para registro de usuario
const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, username, password, role } = req.body;
    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hashedPassword, role });
    logger.info(`User registered: ${username}`);
    const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '1d' });
    res.status(201).json({ message: 'User registered successfully!', token });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
};

// Metodo para loguearse
const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      logger.warn(`User not found: ${email}`);
      return res.status(404).json({ error: 'User not found!' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      logger.warn(`Invalid password for user: ${email}`);
      return res.status(401).json({ error: 'Invalid password!' });
    }
    const token = jwt.sign({ id: user.id, role: user.role }, 'your_jwt_secret', { expiresIn: '1d' });
    logger.info(`User logged in: ${email}`);
    res.json({ token });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ error: error.message });
  }
};


module.exports = { register, login }; 