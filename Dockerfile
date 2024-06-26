FROM node:20-alpine

WORKDIR /app

COPY package.json yarn.lock* ./

RUN yarn install

COPY . .

COPY wait-for-db.sh .

RUN chmod +x wait-for-db.sh

CMD ["./wait-for-db.sh", "yarn", "dev"]