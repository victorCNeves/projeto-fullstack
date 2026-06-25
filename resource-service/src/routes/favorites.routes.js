import express from 'express';
import {
  body,
  param,
  validationResult,
  query,
  matchedData,
} from 'express-validator';
import Favorite from '../models/Favorite.js';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

const getAll = async (req, res, next) => {
  try {
    const { page, limit } = matchedData(req, { locations: ['query'] });

    const pageNumber = parseInt(page ?? 1, 10);
    const limitNumber = parseInt(limit ?? 20, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const [total, results] = await Promise.all([
      Favorite.countDocuments({ userId: req.userId }),
      Favorite.find({ userId: req.userId }).skip(skip).limit(limitNumber),
    ]);

    res.json({
      page: pageNumber,
      total_results: total,
      total_pages: Math.ceil(total / limitNumber),
      results,
    });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const favorite = await Favorite.create({
      userId: req.userId,
      movieId: req.body.movieId,
    });
    res.status(201).json(favorite);
  } catch (error) {
    if (error.code === 11000)
      return res.status(400).json({ error: 'Filme já favoritado.' });
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      movieId: req.params.movieId,
      userId: req.userId,
    });
    if (!favorite)
      return res.status(404).json({ error: 'Favorito não encontrado.' });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

router.get(
  '/',
  [
    query('page').optional().isInt({ min: 1 }).withMessage('Página inválida.'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limite inválido.'),
  ],
  validate,
  getAll
);
router.post(
  '/',
  [body('movieId').notEmpty().isMongoId().withMessage('movieId inválido.')],
  validate,
  create
);
router.delete(
  '/:movieId',
  [param('movieId').isMongoId().withMessage('movieId inválido.')],
  validate,
  remove
);

export default router;
