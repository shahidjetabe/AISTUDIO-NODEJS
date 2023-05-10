'use strict';
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import { logRequests } from '../middlewares';
import router from '@app/app.routes';
import swaggerSpec, { swaggerUIOptions } from '../app/swagger/swagger';

// Intialize the express app
const app = express();

// set security HTTP headers
app.use(helmet());

// parse the request body to json
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// parse the cookies
app.use(cookieParser());

// Log incoming requests
app.use(logRequests());

// compress outgoing response
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUIOptions));
app.get('/api-docs.json', (_req: Request, res: Response) => {
	res.setHeader('Access-Control-Allow', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET');
	res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

	res.send(swaggerSpec);
});

app.use(router);

export default app;
