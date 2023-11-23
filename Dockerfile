FROM node:18.15.0

WORKDIR /usr/app

COPY package.json ./

RUN yarn install

COPY . .

EXPOSE 3333

RUN yarn build

CMD ["yarn", "start"]