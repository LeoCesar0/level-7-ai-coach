# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json before other files
# Utilize Docker cache to save re-installing dependencies if unchanged
COPY package*.json ./

RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy all files
COPY . .

# Build the NestJS application
RUN pnpm build

# Expose the port the app runs on
EXPOSE 8000

# Define the command to run the application
CMD ["node", "dist/main"]