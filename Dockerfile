FROM node:20-alpine

WORKDIR /app

# Copy package.json
COPY package.json ./

# Copy yarn.lock if it exists
COPY yarn.lock* ./

# Install dependencies
RUN yarn install

RUN npx prisma generate

RUN npx prisma migrate deploy

RUN npx prisma db pull

COPY . .

CMD ["yarn", "dev"]