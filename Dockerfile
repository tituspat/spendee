FROM node:20-alpine3.18 as builder

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm update
RUN npm i encoding
COPY . .
RUN npm run build
EXPOSE 3000
CMD [ "npm","run","start" ]