FROM node:latest

WORKDIR /app

COPY . .

WORKDIR /client

RUN npm i

WORKDIR /app

RUN npm i && npm run dev