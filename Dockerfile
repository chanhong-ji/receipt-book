# Build stage
ARG NODE_VERSION=22.11.0

FROM node:${NODE_VERSION}-alpine as build

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Production stage
FROM node:${NODE_VERSION}-alpine as prod

ENV NODE_ENV production

WORKDIR /usr/src/app

COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package.json ./package.json
COPY --from=build /usr/src/app/package-lock.json ./package-lock.json

RUN npm ci --omit=dev

EXPOSE 80

CMD npm run start:prod