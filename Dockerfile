# base image
FROM node:20-alpine

# set working directo
WORKDIR /app

# copy package.json and package-lock.json
COPY package*.json ./

# install dependencies
RUN npm install

# copy source code
COPY . .

# expose port
EXPOSE 3000

# start app
CMD ["npm", "run", "dev"]
