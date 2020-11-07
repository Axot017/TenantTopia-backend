FROM node:14

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY package*.json ./

COPY tsconfig.json ./

COPY webpack.config.js ./

RUN npm install

COPY src /home/node/app/src

EXPOSE 3333

CMD ["npm", "start"]