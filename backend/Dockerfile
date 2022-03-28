FROM node:16


RUN mkdir /app
WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn
RUN yarn global add nodemon sequelize-cli

COPY . .

CMD ["yarn", "start"]