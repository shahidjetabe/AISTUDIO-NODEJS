import * as express from 'express';
import { UserType } from './api/api.constants';

declare global {
	namespace Express {
		export interface Response {
			success(data: object | string, message?: string | undefined, status?: number | undefined): void;
			error(status: number, error: string): void;
		}

		export interface RequestWithData<T = any> extends express.Request {
			data?: T;
			user?: User;
		}

		export interface User {
			userType: UserType;
			id: string;
			session: string;
		}
	}
}

export interface PaginationOptions {
	limit?: number;
	page?: number;
}

export interface PaginatedResult<T> {
	data: T[];
	totalCount: number;
	currentPage: number;
	totalPages: number;
}

export interface IRequest extends express.Request {
	body: Record<string, unknown>;
}

export interface IRequestLog {
	method: string;
	url: string;
	body: Record<string, unknown>;
	ip: string;
}

export {};
