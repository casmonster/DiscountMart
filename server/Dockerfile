# Use the official Node.js 18 image.
FROM node:18

# Create and change to the app directory.
WORKDIR /app

# Copy application dependency manifests to the container image.
COPY package*.json ./

# Install all dependencies.
RUN npm install

# Copy local code to the container image.
COPY . .

# Build the TypeScript code.
RUN npm run build

# Run the web service on container startup.
CMD [ "node", "build/index.js" ]
