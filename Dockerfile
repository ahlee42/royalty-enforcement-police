FROM node:16

WORKDIR /usr/src/app

ENV PORT 8080
ENV HOST 0.0.0.0

COPY ./package*.json ./

RUN npm install --force --legacy-peer-deps

# RUN npm i next-swc-linux-x64-gnu

COPY . .

RUN npm run build

CMD npm start