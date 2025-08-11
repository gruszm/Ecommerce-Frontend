FROM node:20.17.0-alpine

WORKDIR /app

ARG REACT_APP_GATEWAY REACT_APP_GATEWAY_PORT

ENV REACT_APP_GATEWAY=${REACT_APP_GATEWAY} REACT_APP_GATEWAY_PORT=${REACT_APP_GATEWAY_PORT}

COPY package.json .
RUN npm install

COPY public/ public/
COPY src/ src/

RUN npm install -g serve

# This step will always rebuild if args change
RUN echo "Building with gateway=${REACT_APP_GATEWAY}:${REACT_APP_GATEWAY_PORT}" && npm run build

EXPOSE 4000

ENTRYPOINT [ "serve", "-s", "build", "-l", "4000" ]