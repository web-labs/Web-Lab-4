FROM node:14 as build

WORKDIR /usr/src/app

COPY angularclient/package.json angularclient/package-lock.json ./

RUN npm install

COPY /angularclient .

RUN npm run build

FROM nginx:alpine

COPY --from=build /usr/src/app/dist/angularclient /usr/share/nginx/html
