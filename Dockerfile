FROM node:14-alpine3.14 AS development

RUN apk update

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN apk add --no-cache udev ttf-freefont chromium git
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium-browser

RUN yarn add glob rimraf

RUN yarn install --pure-lockfile --only=development

COPY . .

RUN yarn build

FROM node:14-alpine3.14 as production

RUN apk update

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

RUN apk add --no-cache udev ttf-freefont chromium git
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true
ENV CHROMIUM_PATH /usr/bin/chromium-browser

WORKDIR /usr/src/app

COPY package*.json yarn.lock ./

RUN yarn install --pure-lockfile --only=production

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/main"]