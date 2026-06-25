import redis from './redis.js';

const CACHE_TTL = 60;

export const cacheMiddleware = async (req, res, next) => {
  const key = `movies:${JSON.stringify(req.query)}`;

  try {
    const cached = await redis.get(key);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    const originalJson = res.json.bind(res);
    res.json = (data) => {
      redis
        .setex(key, CACHE_TTL, JSON.stringify(data))
        .catch((err) =>
          console.error('[resource-service] Erro ao salvar cache:', err.message)
        );
      return originalJson(data);
    };

    next();
  } catch (err) {
    console.error('[resource-service] Erro no cache:', err.message);
    next();
  }
};

export const invalidateCache = async () => {
  try {
    const keys = await redis.keys('movies:*');
    if (keys.length) await redis.del(...keys);
  } catch (err) {
    console.error('[resource-service] Erro ao invalidar cache:', err.message);
  }
};
