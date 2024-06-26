FROM node:20-alpine

WORKDIR /app

COPY --chown=node:node package.json yarn.lock* ./

USER node

RUN yarn install

COPY --chown=node:node . .

USER root

RUN chmod +x wait-for-db.sh

USER node

CMD ["sh", "-c", "./wait-for-db.sh \"yarn dev\""]