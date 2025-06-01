import express from 'express';
import userRouter from './routes/user.routes';
import dotenv from 'dotenv';
import cors from 'cors';
import { Request, Response } from 'express';
import { refreshToken } from './utils/token.utils';

// configuração de variáveis de ambiente
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'dev'}` });

const app = express();
// Configuração do CORS
app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', userRouter);

// Rota para refresh
app.post('/refresh-token', (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ error: 'Token não fornecido' });
    return;
  }

  const newAccessToken = refreshToken(token);

  res.json({ newAccessToken });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
