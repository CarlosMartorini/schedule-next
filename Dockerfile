FROM node:lts-bullseye

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8080

CMD [ "npx", "next", "dev", "-p", "8080" ]