const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUI = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Gateway",
      version: "1.0.0",
      description: "API Gateway for account management project",
    },
    servers: [
      {
        url: "http://localhost:8000/",
      },
    ],
    components: {
      securitySchemes: {
        apiKey: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "The master authentication key",
        },
        accessToken: {
          type: "apiKey",
          in: "header",
          name: "x-access-token",
          description: "API authentication key",
        },
      },
    },
  },
  apis: ["./config/swagger-definitions.yaml", "./src/web/controllers/*/*.js"],
};

const openApiSpecificationsV1 = swaggerJsDoc(options);

module.exports = {
  path: "/swagger",
  specifications: {
    v1: openApiSpecificationsV1,
  },
  ui: swaggerUI,
  options: {
    explorer: true,
    swaggerOptions: {
      url: "/swagger/v1.json",
      name: "v1",
    },
  },
};
