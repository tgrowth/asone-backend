FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY app ./app

COPY tsconfig.json ./

RUN npm run build

COPY app/asone-app-firebase-adminsdk-ueegw-d42ccfd758.json ./dist/

EXPOSE 3000

CMD ["node", "dist/server.js"]