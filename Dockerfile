FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN ls -l /app/public/symbols # Diagnostic command
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
