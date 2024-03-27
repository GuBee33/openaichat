# Chat Application for Azure OpenAI - EPD-Bp

This is a Vue3 Vite TypeScript frontend repository for an Chat application that uses Azure OpenAI. The application allows users to chat with an AI-powered chatbot and get responses based on their inputs.

The repository also includes a Dockerfile for creating a Docker image and a docker-compose.yml file for running the application locally. Additionally, there is a docker-compose-deploy.yml file for deploying the application to a server.

## Environment Variables

The following environment variables are required for building the application:

- `VITE_OPENAI_ENDPOINT`: The endpoint URL for the Azure OpenAI service.
- `VITE_OPENAI_KEY`: The API key for the Azure OpenAI service.
- `VITE_BASE_PATH`: The base path for the application.
- `DOCKER_REGISTRY`: The registry for the Docker image.
- `ARTIFACTORY_AUTH`: The authentication token for the Artifactory repository.

The following environment variable is required for deploying the application:

- `CLIENT_PORT`: The port number for the client application.

## Building the Application

To build the application, run the following command:

```
npm install
npm run build
```

This will install the necessary dependencies and build the application.

## Running the Application Locally

To run the application locally, you can use Docker Compose. First, create a `.env` file with the required environment variables. Then, run the following command:
`docker-compose up`
This will start the application and make it available at `http://localhost:5173`.

## Deploying the Application

To deploy the application, you can use Docker Compose. First, create a `.env` file with the required environment variables. Then, run the following command:
`docker-compose -f docker-compose-deploy.yml up`
This will deploy the application and make it available at the specified `CLIENT_PORT`.
