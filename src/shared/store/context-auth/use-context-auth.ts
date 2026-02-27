import React from 'react';

import { ContextAuth, ContextAuthProps } from './context-auth';

export const useContextAuth = (): ContextAuthProps => {
	const context = React.useContext(ContextAuth);

	if (!context) {
		throw new Error(
			'Hook "useContextAuth" must be wrapped by ContextAuthProvider '
		);
	}

	return context;
};
