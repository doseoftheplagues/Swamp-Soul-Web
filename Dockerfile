FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
RUN npm run knex migrate:latest --knexfile server/db/knexfile.js
EXPOSE 3000
CMD ["npm", "start"]
