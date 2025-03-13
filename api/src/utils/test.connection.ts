import { PrismaClient } from '@prisma/client';

async function testConnection() {
    const prisma = new PrismaClient();

    try {
        await prisma.$connect(); // Tenta conectar ao banco de dados
        console.log('Conexão com o banco de dados estabelecida com sucesso!');
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
    } finally {
        await prisma.$disconnect(); // Fecha a conexão após o teste
    }
}

testConnection();