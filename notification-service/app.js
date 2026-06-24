import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import router from './src/routes/routes.js';
import { initWebSocket } from './src/config/websocket.js';
import initConsumer from './src/models/consumer.js';

const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(
  morgan('[notification-service] :method :url :status :response-time ms')
);
app.use(helmet());

app.use(router);

initWebSocket(server);
await initConsumer();

server.listen(process.env.PORT, () => {
  console.log(`[notification-service] Rodando na porta ${process.env.PORT}`);
});
