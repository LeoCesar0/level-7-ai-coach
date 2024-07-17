interface IOptions {
	rootOnly?: boolean;
	ignoreQuery?: boolean;
}

const defaultOptions: IOptions = {
	rootOnly: false,
	ignoreQuery: true,
};

export const compareRoute = (first: string, second: string, options: IOptions = defaultOptions) => {
	options = {
		...defaultOptions,
		...options,
	};
	const { rootOnly } = options;

	if (rootOnly) {
		first = first.split('/')[1] || first.split('/')[0];
		second = second.split('/')[1] || second.split('/')[0];
	}

	if (options.ignoreQuery) {
		first = first.split('?')[0];
		second = second.split('?')[0];
	}

	const firstPath = first.replace(/\/$/, '');
	const secondPath = second.replace(/\/$/, '');
	return firstPath === secondPath;
};
