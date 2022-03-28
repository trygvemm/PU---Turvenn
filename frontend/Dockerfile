FROM node:16

RUN mkdir /app

WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn
RUN npx browserslist@latest --update-db
COPY . .


CMD ["yarn", "start"]
