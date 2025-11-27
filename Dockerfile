FROM node:18-alpine

WORKDIR /app

# Create user before copying files
RUN addgroup -g 1001 -S nodejs && \
    adduser -S discord -u 1001

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Change ownership of files to discord user
RUN chown -R discord:nodejs /app

USER discord

CMD ["npm", "start"]