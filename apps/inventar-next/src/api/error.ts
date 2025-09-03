export class UnauthorizedError extends Error {
	constructor() {
		super();
		this.name = 'UnauthorizedError';
	}
}

export class HttpError extends Error {
	constructor(
		public status: number,
		public message: string,
		public statusText: string
	) {
		super(message);
		this.name = 'HttpError';
	}
}

export class CustomError extends Error {
	constructor(public message: string) {
		super(message);
		this.name = 'CustomError';
	}
}
