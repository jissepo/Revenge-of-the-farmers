# build stage
FROM node:22-alpine3.19

WORKDIR /app
COPY package*.json ./

RUN npm ci

COPY ./src-api/ .

EXPOSE 3000
