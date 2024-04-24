FROM node:20 AS project-dependencies
WORKDIR /glucohealth-backend/
COPY ./package.json ./package-lock.json ./
RUN npm install

FROM node:20 AS built-project
WORKDIR /glucohealth-backend/
COPY ./ ./
COPY --from=project-dependencies ./glucohealth-backend/ ./
RUN npm run build

RUN chmod +x ./bootstrap.sh
ENTRYPOINT ["./bootstrap.sh"]

ARG APP_PORT=3000
EXPOSE ${APP_PORT}