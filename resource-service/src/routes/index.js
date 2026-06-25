import { Router } from 'express';
import moviesRouter from './movies.routes.js';
import genresRouter from './genres.routes.js';

const router = Router();

router.use('/discover/movie', moviesRouter);
router.use('/search/movie', moviesRouter);
router.use('/movies', moviesRouter);
router.use('/genre/movie/list', genresRouter);

export default router;
