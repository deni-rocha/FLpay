# Stage 1: Build
FROM node:22-alpine AS build

WORKDIR /app

# instalando dependências
COPY package*.json ./
RUN npm ci

# Instala OpenSSL (necessário para o Prisma)
RUN apk add --no-cache openssl

# copia o schema e gera o client prisma
COPY prisma ./prisma
RUN npx prisma generate

# Copia o restante do código
COPY . .

RUN npm run build

# Stage 2: Runtime
FROM node:22-alpine

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma/ ./prisma
COPY --from=build /app/setup-database.ts .



EXPOSE 3000
CMD ["sh", "-c", "npx tsx setup-database.ts && node ./dist/server.js"]