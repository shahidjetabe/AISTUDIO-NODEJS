import swaggerJSDoc, { Options } from 'swagger-jsdoc';
import path from 'path';
import { SwaggerUiOptions } from 'swagger-ui-express';

import { config } from '@config/env/env.config';

const isDevelopment = config.env === 'development' || config.env === 'local' || config.env === 'staging';

const options: Options = {
	failOnErrors: true,
	apis: [path.join(__dirname, isDevelopment ? '../api/**/*.ts' : '../api/**/*.js')],
	swaggerDefinition: {
		openapi: '3.0.0',
		info: {
			title: 'Boilerplate app',
			version: '1.0.0',
			description: 'Boilerplate code APIs',
			// contact: {
			// 	name: '',
			// 	email: '',
			// },
		},
		components: {
			securitySchemes: {
				basicAuth: {
					type: 'http',
					scheme: 'basic',
				},
				bearerAuth: {
					type: 'http',
					scheme: 'bearer',
					bearerFormat: 'JWT',
				},
			},
		},
		security: [
			{
				bearerAuth: [],
			},
		],
		servers: [{ url: `${config.url}/v1`, description: 'Development server' }],
		externalDocs: { url: `${config.url}/v1/hello` },
	},
};

export const swaggerUIOptions: SwaggerUiOptions = {
	explorer: true,
	customSiteTitle: 'Boiler-Plate',
	isExplorer: true,
	swaggerOptions: {
		docExpansion: 'none',
		displayRequestDuration: true,
		defaultModelsExpandDepth: 2,
		syntaxHighlight: {
			theme: 'tomorrow-night',
		},
		persistAuthorization: true,
	},
};

const swaggerSpec: object = swaggerJSDoc(options);

export default swaggerSpec;
