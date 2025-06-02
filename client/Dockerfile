# frontend/Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Exemplo com React em modo desenvolvimento
EXPOSE 5000
CMD ["npm", "start"]
