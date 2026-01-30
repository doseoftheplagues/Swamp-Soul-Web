FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
RUN mkdir -p /app/server/db/storage && chmod 777 /app/server/db/storage
CMD ["sh", "-c", "npx knex migrate:latest --env production --knexfile server/db/knexfile.js && node dist/server.js"]
