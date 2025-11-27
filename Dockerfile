FROM node:18-alpine

WORKDIR /app

# Create user before copying files
RUN addgroup -g 1001 -S nodejs && \
    adduser -S discord -u 1001

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Create config directory for persistence
RUN mkdir -p /app/data && \
    chown -R discord:nodejs /app

# Create volume for persistent config directory
VOLUME ["/app/data"]

USER discord

ENV NODE_ENV=production

CMD ["npm", "start"]