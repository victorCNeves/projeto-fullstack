import express from 'express';
import {
  body,
  param,
  query,
  validationResult,
  matchedData,
} from 'express-validator';
import Movie from '../models/Movie.js';
import { publish } from '../config/redis.js';
import { cacheMiddleware, invalidateCache } from '../config/cache.js';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  next();
};

const commonMovieRules = [
  body('overview').optional().trim(),
  body('original_title').optional().trim(),
  body('original_language').optional().trim(),
  body('release_date')
    .optional()
    .isISO8601()
    .withMessage('Data de lançamento inválida.'),
  body('genre_ids')
    .optional()
    .isArray()
    .withMessage('genre_ids deve ser um array.'),
  body('genre_ids.*')
    .optional()
    .isInt()
    .withMessage('genre_ids deve conter números inteiros.'),
  body('popularity')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Popularidade inválida.'),
  body('vote_average')
    .optional()
    .isFloat({ min: 0, max: 10 })
    .withMessage('vote_average deve estar entre 0 e 10.'),
  body('vote_count')
    .optional()
    .isInt({ min: 0 })
    .withMessage('vote_count inválido.'),
  body('poster_path').optional().trim(),
  body('backdrop_path').optional().trim(),
];

const createRules = [
  body('title').notEmpty().withMessage('O título é obrigatório.').trim(),
  ...commonMovieRules,
];

const updateRules = [
  param('id').isMongoId().withMessage('ID inválido.'),
  body('title').optional().trim(),
  ...commonMovieRules,
];

const getAll = async (req, res, next) => {
  try {
    const {
      query,
      with_genres,
      primary_release_date_gte,
      primary_release_date_lte,
      page,
      limit,
    } = matchedData(req, {
      locations: ['query'],
    });

    const pageNumber = parseInt(page ?? 1, 10);
    const limitNumber = parseInt(limit ?? 20, 10);
    const skip = (pageNumber - 1) * limitNumber;

    const matchStage = {};

    if (query) {
      matchStage.title = { $regex: query, $options: 'i' };
    } else {
      if (with_genres) matchStage.genre_ids = Number(with_genres);
      if (primary_release_date_gte || primary_release_date_lte) {
        matchStage.release_date = {};
        if (primary_release_date_gte)
          matchStage.release_date.$gte = new Date(primary_release_date_gte);
        if (primary_release_date_lte)
          matchStage.release_date.$lte = new Date(primary_release_date_lte);
      }
    }

    const pipeline = [
      { $match: matchStage },
      { $sort: { popularity: -1, _id: 1 } },
      {
        $facet: {
          metadata: [{ $count: 'total' }],
          results: [{ $skip: skip }, { $limit: limitNumber }],
        },
      },
    ];

    const [facetResult] = await Movie.aggregate(pipeline);
    const total = facetResult?.metadata[0]?.total ?? 0;
    const results = facetResult?.results ?? [];

    console.log(
      `[resource-service] Busca realizada: ${JSON.stringify(req.query)}`
    );

    res.json({
      page: pageNumber,
      total_results: total,
      total_pages: Math.ceil(total / limitNumber),
      results: results.map((movie) => ({ id: movie._id, ...movie })),
    });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id).lean();
    if (!movie) return res.status(404).json({ error: 'Filme não encontrado.' });
    res.json({ ...movie, id: movie._id });
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const data = matchedData(req, { locations: ['body'] });
    const movie = await Movie.create({ ...data, created_by: req.userId });

    await publish('resource.created', movie);
    await invalidateCache();

    console.log(
      `[resource-service] Filme criado: "${movie.title}" por ${req.userId}`
    );
    res.status(201).json(movie);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Filme não encontrado.' });

    if (!movie.created_by || movie.created_by.toString() !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    const data = matchedData(req, { locations: ['body'] });
    const updated = await Movie.findByIdAndUpdate(
      req.params.id,
      { $set: data },
      { new: true }
    );

    await publish('resource.updated', updated);
    await invalidateCache();

    console.log(
      `[resource-service] Filme atualizado: "${updated.title}" por ${req.userId}`
    );
    res.json(updated);
  } catch (error) {
    next(error);
  }
};

const remove = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ error: 'Filme não encontrado.' });

    if (!movie.created_by || movie.created_by.toString() !== req.userId) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }

    await Movie.findByIdAndDelete(req.params.id);

    await publish('resource.deleted', { _id: req.params.id });
    await invalidateCache();

    console.log(
      `[resource-service] Filme excluído: "${movie.title}" por ${req.userId}`
    );
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
    query('with_genres').optional().isNumeric().withMessage('Gênero inválido.'),
    query('primary_release_date_gte')
      .optional()
      .isISO8601()
      .withMessage('primary_release_date_gte inválido.'),
    query('primary_release_date_lte')
      .optional()
      .isISO8601()
      .withMessage('primary_release_date_lte inválido.'),
    query('query').optional().trim(),
  ],
  validate,
  cacheMiddleware,
  getAll
);

router.get(
  '/:id',
  [param('id').isMongoId().withMessage('ID inválido.')],
  validate,
  getById
);
router.post('/', createRules, validate, create);
router.put('/:id', updateRules, validate, update);
router.delete(
  '/:id',
  [param('id').isMongoId().withMessage('ID inválido.')],
  validate,
  remove
);

export default router;
