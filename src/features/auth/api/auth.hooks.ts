import { useMutation, useQuery } from '@tanstack/react-query';

import { authApi } from './auth.api';

export const useLoginMutation = () => {
	return useMutation({
		mutationFn: authApi.login
	});
};

export const useMeQuery = () => {
	return useQuery({
		queryKey: authApi.qkMe(),
		queryFn: authApi.me
	});
};
