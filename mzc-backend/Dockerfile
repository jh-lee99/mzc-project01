FROM node:18-alpine3.15

WORKDIR /usr/src/app
ENV TZ=Asia/Seoul

COPY package.json ./

RUN yarn install
COPY . .

RUN yarn build

COPY .env ./dist/
COPY ormconfig.js ./dist/
COPY package.json ./dist/

WORKDIR ./dist
RUN yarn install

EXPOSE 8080
CMD ["yarn", "js-start"]