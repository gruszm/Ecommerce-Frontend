FROM node:20.17.0-alpine

WORKDIR /app

COPY .env .
COPY package.json .
RUN npm install

COPY public/ public/
COPY src/ src/

RUN npm install -g serve

RUN npm run build

EXPOSE 4000

ENTRYPOINT [ "serve", "-s", "build", "-l", "4000" ]