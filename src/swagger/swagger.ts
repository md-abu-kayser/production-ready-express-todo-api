import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Todo API Documentation',
      version: '1.0.0',
      description: 'A professional Todo API built with Express.js and TypeScript',
      contact: {
        name: 'API Support',
        email: 'support@todoapi.com'
      },
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server'
      },
      {
        url: 'https://api.todoapp.com',
        description: 'Production server'
      }
    ],
    components: {
      schemas: {
        Todo: {
          type: 'object',
          required: ['title', 'body', 'completed', 'createdAt'],
          properties: {
            id: {
              type: 'integer',
              description: 'The auto-generated id of the todo'
            },
            title: {
              type: 'string',
              description: 'The title of the todo'
            },
            body: {
              type: 'string',
              description: 'The body/description of the todo'
            },
            completed: {
              type: 'boolean',
              description: 'The completion status of the todo'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the todo was created'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'The date the todo was last updated'
            }
          },
          example: {
            id: 1,
            title: "Learn TypeScript",
            body: "Master TypeScript with Express.js",
            completed: false,
            createdAt: "2024-01-20T10:30:00.000Z",
            updatedAt: "2024-01-20T10:30:00.000Z"
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.ts'] // Path to the API docs
};

export const specs = swaggerJsdoc(options);