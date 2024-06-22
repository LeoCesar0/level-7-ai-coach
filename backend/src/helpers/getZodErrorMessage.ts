import { z } from 'zod';

export type IGetZodErrorMessage = {
	error: z.ZodError;
};

export const getZodErrorMessage = ({ error }: IGetZodErrorMessage) => {
	const messages = error.issues
		.map((issue) => {
			if (issue.path.length > 0) {
				const path = issue.path.join('.');

				return `${path}: ${issue.message}`;
			}

			return issue.message;
		})
		.join('; \n');

	return messages;
};
