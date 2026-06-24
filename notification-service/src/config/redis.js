import Redis from 'ioredis';

const subscriber = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

subscriber.on('connect', () => {
  console.log('[notification-service] Conectado ao Redis.');
});

subscriber.on('error', (err) => {
  console.error('[notification-service] Erro no Redis:', err.message);
});

export default subscriber;
