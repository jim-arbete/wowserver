FROM node:14-alpine

WORKDIR /app

COPY rollup.config.js ./
COPY package*.json ./

RUN npm install

COPY ./src ./src
COPY ./public ./public

RUN npm run build
RUN npm prune --production # Remove dev dependencies

EXPOSE 80
ENV HOST=0.0.0.0

CMD [ "npm", "run", "prodstart" ]