import subscriber from '../config/redis.js';
import { broadcast } from '../config/websocket.js';

const CHANNELS = ['resource.created', 'resource.updated', 'resource.deleted'];

export default async () => {
  await subscriber.subscribe(...CHANNELS);

  subscriber.on('message', (channel, message) => {
    console.log(`[notification-service] Evento recebido: ${channel}`);
    try {
      const data = JSON.parse(message);
      broadcast({ event: channel, data });
    } catch (err) {
      console.error(
        '[notification-service] Erro ao processar mensagem:',
        err.message
      );
    }
  });
};
