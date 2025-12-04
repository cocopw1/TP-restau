# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY ./main.js ./
COPY ./package-lock.json ./
COPY database.interaction.js ./

# Expose backend port (change if needed)
EXPOSE 3000

# Start the backend server
CMD ["node", "./main.js"]