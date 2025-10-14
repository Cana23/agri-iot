FROM node:18-alpine

WORKDIR /app

# Crear directorio de logs
RUN mkdir -p /logs

# Copiar package.json del servicio y el raíz
COPY service-sensors/package*.json ./
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar código del servicio
COPY service-sensors/ ./

EXPOSE 3002

CMD ["sh", "-c", "npx prisma db seed && node server.js"]