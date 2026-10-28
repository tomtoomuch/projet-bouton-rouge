FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 3003

CMD ["node", "server.js"]

# On vérifie la santé du service HTTP
HEALTHCHECK --interval=30s \
            --timeout=3s \
            --start-period=10s \
            --retries=3 \
    CMD wget -q -O /dev/null http://127.0.0.1:3003/health || exit 1