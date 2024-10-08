FROM node:16

WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the app directory
COPY app ./app

# Copy any other necessary files (e.g., tsconfig.json)
COPY tsconfig.json ./

# Build TypeScript code
RUN npm run build

# Copy the JSON file into the dist directory
COPY app/asone-app-firebase-adminsdk-ueegw-d42ccfd758.json ./dist/

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["node", "dist/server.js"]