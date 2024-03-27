# Build Stage
FROM node:18 As build

ARG VITE_OPENAI_ENDPOINT
ARG VITE_OPENAI_KEY
ARG VITE_BASE_PATH

ARG ARTIFACTORY_AUTH

ENV VITE_OPENAI_ENDPOINT=${VITE_OPENAI_ENDPOINT}
ENV VITE_OPENAI_KEY=${VITE_OPENAI_KEY}
ENV VITE_BASE_PATH=${VITE_BASE_PATH}


WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json .

RUN npm config set registry https://rb-artifactory.bosch.com/artifactory/api/npm/npm-remote/
RUN npm config set //rb-artifactory.bosch.com/artifactory/api/npm/npm-remote/:_authToken=${ARTIFACTORY_AUTH}
RUN npm ci --include=dev
COPY . /usr/src/app/.



# Set the desired project to build
ARG PROJECT_NAME=azureopenaichatbot

WORKDIR /usr/src/app

# Build the Angular project
RUN npm run build

############
### prod ###
############

# base image
FROM nginx:1.22-alpine as deploy

# copy artifact build from the 'build environment'
COPY nginx.conf /etc/nginx/
COPY --from=build /usr/src/app/dist/ /usr/share/nginx/html/openai

# expose port 4200
EXPOSE 80

# run nginx
CMD ["nginx", "-g", "daemon off;"]