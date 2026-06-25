import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import router from './src/routes/index.js';
import connectDB from './src/config/db.js';
import verifyJWT from './src/config/jwt.js';

const app = express();

await connectDB();

app.use(express.json());
app.use(cors());
app.use(morgan('[resource-service] :method :url :status :response-time ms'));
app.use(helmet());
app.use(compression());

app.use(verifyJWT);
app.use(router);

app.use((error, req, res, next) => {
  if (error.name === 'CastError')
    return res.status(400).json({ error: 'ID inválido.' });

  res.status(500).json({ error: 'Ocorreu um erro inesperado no servidor.' });
});

app.listen(process.env.PORT, () => {
  console.log(`[resource-service] Rodando na porta ${process.env.PORT}`);
});
