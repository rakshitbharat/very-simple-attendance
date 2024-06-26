FROM node:20-alpine

WORKDIR /app

COPY . .

COPY wait-for-db.sh .

RUN chmod +x wait-for-db.sh

USER node

CMD ["sh", "-c", "chmod +x wait-for-db.sh && ./wait-for-db.sh \"yarn dev\""]