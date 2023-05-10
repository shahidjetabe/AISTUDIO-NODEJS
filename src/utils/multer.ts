import { Request } from 'express';
import multer, { FileFilterCallback, StorageEngine } from 'multer';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(__dirname, '..', '..', 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
	try {
		fs.mkdirSync(UPLOADS_DIR, { recursive: true });
	} catch (error) {
		console.error(`Unable to create upload directory: ${error}`);
		process.exit(1);
	}
}

const storage: StorageEngine = multer.diskStorage({
	destination: (_req: Request, _file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
		callback(null, UPLOADS_DIR);
	},
	filename: (_req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
		const extension = path.extname(file.originalname);
		callback(null, `${file.originalname}_${Date.now()}${extension}`);
	},
});

const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // 5 mb
	fileFilter: (_req: Request, file: Express.Multer.File, callback: FileFilterCallback) => {
		const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
		if (allowedMimeTypes.includes(file.mimetype)) {
			callback(null, true);
		} else {
			callback(new Error());
		}
	},
});

export default upload;
