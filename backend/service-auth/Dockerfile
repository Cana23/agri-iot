FROM node:18-alpine

WORKDIR /app

# Copiar schema de Prisma
COPY prisma ./prisma/

# Copiar package.json del servicio y el raíz
COPY service-auth/package*.json ./
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Generar cliente Prisma
RUN npx prisma generate

# Copiar código del servicio
COPY service-auth/ ./

EXPOSE 3004

CMD npx prisma migrate deploy && node server.js