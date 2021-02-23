FROM node:15.4.0-alpine3.11

WORKDIR /app

COPY . .
RUN npm install