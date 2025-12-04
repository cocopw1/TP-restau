# Use official Node.js LTS image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY ./*.js ./

# Expose backend port (change if needed)
EXPOSE 3000

# Start the backend server
CMD ["node", "./main.js"]