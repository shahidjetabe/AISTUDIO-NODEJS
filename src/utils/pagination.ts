import { Model } from 'mongoose';

import { PaginatedResult, PaginationOptions } from '@src/app/app.interface';

export const paginate = async <T>(model: Model<T>, options: PaginationOptions): Promise<PaginatedResult<T>> => {
	const { limit = 10, page = 1 } = options;
	const skip = (page - 1) * limit;

	const [data, totalCount] = await Promise.all([model.find().skip(skip).limit(limit), model.countDocuments()]);

	const totalPages = Math.ceil(totalCount / limit);

	return {
		data,
		totalCount,
		currentPage: page,
		totalPages,
	};
};
