FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN apk add --no-cache sqlite
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
