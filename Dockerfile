FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock* ./

RUN chown -R node:node /app

USER node

RUN yarn install

COPY . .

COPY wait-for-db.sh .

RUN chmod +x wait-for-db.sh

CMD ["sh", "-c", "./wait-for-db.sh \"yarn dev\""]