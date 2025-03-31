import express from 'express';
import userRouter from './routes/user.routes';
import dotenv from 'dotenv';


// configuração de variáveis de ambiente
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'dev'}` })

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/user", userRouter)

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});