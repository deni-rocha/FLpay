import express from 'express';
import { PrismaClient } from '@prisma/client';
import 'dotenv/config';
import userRouter from './routes/user.routes';
import setupDatabase from './utils/setup-database';

const app = express();

// inicialização do banco de dados (verificação de tabelas e migrations do prisma)
(() => {
    setupDatabase()
})()

export const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user", userRouter)

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});