import { WebSocketServer, WebSocket } from 'ws';

let wss;

export const initWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', async (ws, req) => {
    const token = new URL(req.url, 'http://localhost').searchParams.get(
      'token'
    );

    if (!token) {
      ws.close(1008, 'Token não fornecido.');
      return;
    }

    try {
      const response = await fetch(`${process.env.AUTH_SERVICE_URL}/validate`, {
        headers: { authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        ws.close(1008, 'Token inválido.');
        return;
      }
    } catch {
      ws.close(1011, 'Erro ao validar token.');
      return;
    }

    console.log('[notification-service] Cliente WebSocket conectado.');

    ws.on('close', () => {
      console.log('[notification-service] Cliente WebSocket desconectado.');
    });
  });
};

export const broadcast = (data) => {
  if (!wss) return;
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
};
