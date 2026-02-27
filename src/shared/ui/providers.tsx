'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { PropsWithChildren } from 'react';

import { ContextAuthProvider } from '../store/context-auth';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: false
		}
	}
});

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
	return (
		<QueryClientProvider client={queryClient}>
			<ContextAuthProvider>{children}</ContextAuthProvider>
		</QueryClientProvider>
	);
};
