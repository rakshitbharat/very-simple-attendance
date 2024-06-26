FROM node:20-alpine

WORKDIR /app

# Copy package.json
COPY package.json ./

# Copy yarn.lock if it exists
COPY yarn.lock* ./

# Install dependencies
RUN yarn install

COPY . .

CMD ["yarn", "dev"]