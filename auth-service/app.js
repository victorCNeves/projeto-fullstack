import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import router from './src/routes/routes.js';
import connectDB from './src/config/db.js';

const app = express();

try {
  await connectDB();
} catch (error) {
  console.error('Erro ao conectar no banco ', error);
}

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());

app.use(router);

app.use((error, req, res, next) => {
  if (error.name === 'CastError')
    return res.status(400).json({ error: 'ID inválido.' });

  res.status(500).json({ error: 'Ocorreu um erro inesperado no servidor.' });
});

app.listen(process.env.PORT, () => {
  console.log(`auth-service rodando na porta ${process.env.PORT}`);
});
