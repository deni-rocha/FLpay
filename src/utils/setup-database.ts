#!/usr/bin/env ts-node

import { execSync } from 'child_process';
import pg from 'pg';
import { parse } from 'pg-connection-string';



const { Client } = pg;

interface DBConfig {
    user: string;
    password: string;
    host: string;
    port: number;
    database: string;
}

const DATABASE_URL = process.env.DATABASE_URL;
console.log(DATABASE_URL)
if (!DATABASE_URL) {
    throw new Error('DATABASE_URL not found in .env file');
}

const dbConfig: DBConfig = parse(DATABASE_URL) as unknown as DBConfig;

async function checkDatabaseExists(): Promise<boolean> {
    const client = new Client({
        user: dbConfig.user,
        password: dbConfig.password,
        host: dbConfig.host,
        port: dbConfig.port,
        database: 'postgres',
    });

    try {
        await client.connect();
        const res = await client.query(
            'SELECT 1 FROM pg_database WHERE datname = $1',
            [dbConfig.database]
        );
        return res.rows.length > 0;
    }
    finally {
        await client.end();
    }
}

async function createDatabase(): Promise<void> {
    const client = new Client({
        user: dbConfig.user,
        password: dbConfig.password,
        host: dbConfig.host,
        port: dbConfig.port,
        database: 'postgres',
    });

    try {
        await client.connect();
        await client.query(`CREATE DATABASE "${dbConfig.database}"`);
    } finally {
        await client.end();
    }
}

async function checkMigrationsTable(): Promise<boolean> {
    const client = new Client(dbConfig);

    try {
        await client.connect();
        const res = await client.query(`
      SELECT EXISTS (
        SELECT FROM pg_tables 
        WHERE tablename = 'prisma_migrations'
      )
    `);
        return res.rows[0].exists;
    } catch {
        return false;
    } finally {
        await client.end();
    }
}

async function setupDatabase(): Promise<void> {
    try {
        if (!(await checkDatabaseExists())) {
            console.log('Creating database and applying migrations...');
            await createDatabase();
            execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
        } else {
            console.log('Database exists. Checking migrations...');
            if (!(await checkMigrationsTable())) {
                console.log('Applying initial migrations...');
                execSync('npx prisma migrate deploy', { stdio: 'inherit' });
            } else {
                console.log('Migrations already applied.');
            }
        }
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error);
        process.exit(1);
    }
}

export default setupDatabase;