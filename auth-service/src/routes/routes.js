import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';
import { body, validationResult } from 'express-validator';

import User from '../models/User.js';
import RevokedToken from '../models/RevokedToken.js';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    error:
      'Muitas tentativas de login vindas deste IP. Por favor, tente novamente após 15 minutos.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginValidationRules = [
  body('username').notEmpty().withMessage('O nome de usuário é obrigatório.'),
  body('password').notEmpty().withMessage('A senha é obrigatória.'),
];

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      console.log(`[auth-service] Login falhou para: ${username}`);
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '8h',
    });

    console.log(`[auth-service] Login bem-sucedido para: ${username}`);
    return res.json({ token });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    await RevokedToken.create({
      token,
      expiresAt: new Date(decoded.exp * 1000),
    });

    console.log(`[auth-service] Logout do usuário: ${decoded.id}`);
    return res.status(204).send();
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
    next(error);
  }
};

const validateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token não fornecido.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const revogado = await RevokedToken.findOne({ token });
    if (revogado) {
      return res.status(401).json({ error: 'Token revogado.' });
    }

    return res.json({ id: decoded.id });
  } catch (error) {
    if (
      error.name === 'JsonWebTokenError' ||
      error.name === 'TokenExpiredError'
    ) {
      return res.status(401).json({ error: 'Token inválido ou expirado.' });
    }
    next(error);
  }
};

router.post('/login', loginLimiter, loginValidationRules, validate, login);
router.post('/logout', logout);
router.get('/validate', validateToken);

export default router;
