FROM node:24-alpine

WORKDIR /app

# Copy package files for layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy application code
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
