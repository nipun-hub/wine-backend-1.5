# # Use an official Node.js runtime as a parent image
# FROM node:14-alpine

# # Set the working directory in the container
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json to the working directory
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application code to the working directory
# COPY . .

# # Expose the port the app runs on
# EXPOSE 8001

# # Define the command to run your app using CMD
# CMD ["node", "./src/index.js"]


ARG NODE_VERSION=18.12.1
#pulling docker images from dockerhub
FROM node:$NODE_VERSION-slim

# Create work directory
WORKDIR /app

# Copy pacakge.json and package-lock.json before other files
# Utilize Docker cache to save re-installing
# COPY package.json package-lock.json

# Copy the rest of your app's source code from your host to your image filesystem
COPY . .

# Build application 
RUN npm install

# Make port 8001
EXPOSE 3000

# RUN node application when container launches
CMD [ "node", "src/server.js"]