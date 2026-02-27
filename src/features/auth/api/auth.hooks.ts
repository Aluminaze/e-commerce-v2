import { useMutation, useQuery } from '@tanstack/react-query';

import { authApi } from './auth.api';

export const useLoginMutation = () => {
	return useMutation({
		mutationFn: authApi.login
	});
};
export const useLogoutMutation = () => {
	return useMutation({
		mutationFn: authApi.logout
	});
};

export const useMeQuery = () => {
	return useQuery({
		queryKey: authApi.qkMe(),
		queryFn: authApi.me
	});
};
