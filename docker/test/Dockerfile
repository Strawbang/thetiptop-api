FROM node:alpine3.10 as base

RUN mkdir -p /usr/src/api

WORKDIR /usr/src/api

COPY package.json /usr/src/api

COPY package-lock.json /usr/src/api

ENV ENV=development \
USER=root \
PASSWORD=Dsp8908Archi \
HOST=workflow_mariadb \
DB=thetiptop_dev \
DIALECT=mariadb \
SECRET_KEY=8WDU29PMm0 \
PORTDB=3306 \
POOL_MAX=5 \
POOL_MIN=0 \
POOL_ACQUIRE=30000 \
POOL_IDLE=10000 \
PORT=8082 \
GOOGLE_ID=886105670977-3sol2d3gs856cee8pltss2lkis8e611p.apps.googleusercontent.com \
GOOGLE_SECRET=E6z_tf6kK0qWbzq3I7_XD-nB \
FB_ID=1178128022597598 \
FB_SECRET=8371318b8e53595c89c3410f70793b7a \
SENDGRID_API_KEY=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 \
EMAIL_ADDRESS=thetiptop.obdn@gmail.com \
EMAIL_PASSWORD=@Dsp5obdn

FROM base as test
RUN npm ci --include=dev
COPY . .
CMD [ "npm", "run", "test" ]
