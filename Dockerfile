FROM node:latest

RUN mkdir -p /home/app/ && chown -R node:node /home/app
WORKDIR /home/app
COPY --chown=node:node . .

USER node
RUN npm install

ENV NODE_ENV=test

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start"]