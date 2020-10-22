FROM node:14

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY --chown=node:node . .

USER node

RUN npm run tsc

EXPOSE 3333

CMD ["node", "dist/index.js"]