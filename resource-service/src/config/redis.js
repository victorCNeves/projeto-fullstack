import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redis.on('connect', () =>
  console.log('[resource-service] Conectado ao Redis.')
);
redis.on('error', (err) =>
  console.error('[resource-service] Erro no Redis:', err.message)
);

export const publish = async (channel, data) => {
  await redis.publish(channel, JSON.stringify(data));
};

export default redis;
