# Use an official Node runtime as the base image
FROM node:20-alpine

# Set the working directory in the container to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

RUN npm install -g pnpm

# Install any needed packages specified in package.json
RUN pnpm install

# Bundle app source inside the Docker image
COPY . .

# Build the Nuxt.js application
RUN pnpm build

# Expose port 3000 to the outside world
EXPOSE 3000

# Define the command to run the application
CMD ["pnpm", "start"]