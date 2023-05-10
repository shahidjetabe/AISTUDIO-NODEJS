export interface ErrorMessage {
	[key: number]: {
		success: false;
		status: number;
		message: string;
	};
}
