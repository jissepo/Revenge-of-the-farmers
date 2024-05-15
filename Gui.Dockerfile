# build stage
FROM node:22-alpine3.19 as build-stage

WORKDIR /app
COPY package*.json ./

RUN npm ci

COPY . .
ARG VITE_API_URL="https://api.revenge.joeleht.dev"
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# production stage
FROM nginx:alpine as production-stage

COPY ./docker/gui/nginx/conf.d /etc/nginx/conf.d

## Remove default nginx index page
RUN rm -rf /usr/share/nginx/html/*

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
