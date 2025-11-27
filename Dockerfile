FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

RUN addgroup -g 1001 -S nodejs && \
    adduser -S discord -u 1001

USER discord

EXPOSE 3000

CMD ["npm", "start"]