# Stage 1: Build
FROM node:22-alpine AS build

# Instala OpenSSL (necessário para o Prisma)
RUN apk add --no-cache openssl

WORKDIR /app

# instalando dependências
COPY package*.json ./
RUN npm ci

# Copia o schema.prisma e gera o Prisma Client
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
COPY --from=build /app/prisma ./prisma



EXPOSE 3000
CMD ["sh", "-c", "node ./dist/server.js"]