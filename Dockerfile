FROM node:lts-iron AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD node server.js
