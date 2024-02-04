FROM node:18.15.0

WORKDIR /usr/app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN npx prisma generate
RUN npx prisma migrate deploy

EXPOSE 3333

RUN yarn build

CMD ["yarn", "start"]