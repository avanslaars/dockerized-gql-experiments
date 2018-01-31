FROM mhart/alpine-node:8.9.4

RUN mkdir -p /app
WORKDIR /app

ADD ./package.json .
RUN npm install
