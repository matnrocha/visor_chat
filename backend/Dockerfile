# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Carregar variáveis de ambiente
RUN npm install dotenv

EXPOSE 3000

CMD ["npm", "start"]
