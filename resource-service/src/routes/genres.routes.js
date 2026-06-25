import express from 'express';
import Genre from '../models/Genre.js';

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const genres = await Genre.find();
    res.json({
      genres: genres.map((genre) => ({ id: genre.tmdbId, name: genre.name })),
    });
  } catch (error) {
    next(error);
  }
});

export default router;
