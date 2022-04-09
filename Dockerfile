FROM node:current-alpine3.14
RUN mkdir -p /home/node/app/node_modules
RUN mkdir -p /home/node/app/logs
RUN chown -R node:node /home/node/app
WORKDIR /home/node/app
USER node
COPY --chown=node:node . .
RUN npm install
CMD [ "node", "index.js" ]
