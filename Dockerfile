# base image
FROM node:20-alpine

# set working 
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy source code
COPY . .

# expose port
EXPOSE 3100

# start app
CMD ["npm", "run", "dev"]
