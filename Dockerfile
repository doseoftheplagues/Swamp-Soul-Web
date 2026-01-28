FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["sh", "-c", "npx knex migrate:latest --knexfile server/db/knexfile.js && node dist/server.js"]
