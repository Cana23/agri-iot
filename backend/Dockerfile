FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install --production

RUN npx prisma generate

COPY . .

CMD ["node", "index.js"]