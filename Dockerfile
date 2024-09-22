FROM node:20.17 AS lint
WORKDIR /app

COPY *.json ./
COPY .eslintrc.js ./.eslintrc.js
COPY src ./src

RUN npm ci

FROM lint AS testing

COPY specs ./specs
RUN npm run build

FROM testing AS productionBuild

RUN npm install --only=production --no-audit --no-fund --loglevel=error

FROM node:20.17
WORKDIR /app

COPY --from=productionBuild /app/dist ./dist
COPY --from=productionBuild /app/specs ./specs
COPY --from=productionBuild /app/package*.json ./package*.json