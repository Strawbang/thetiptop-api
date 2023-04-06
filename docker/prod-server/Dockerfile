FROM node:alpine3.10

RUN mkdir -p /usr/src/api

WORKDIR /usr/src/api

COPY package.json /usr/src/api

#COPY package-lock.json /usr/src/api

RUN npm install

COPY . /usr/src/api

CMD ["npm","run","start"]