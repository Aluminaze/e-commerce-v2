import axios, {
	AxiosError,
	AxiosResponse,
	CreateAxiosDefaults,
	HttpStatusCode
} from 'axios';

import {
	ROUTE_API_BASE_SEGMENT,
	ROUTE_API_LOGOUT_PATHNAME
} from '@/shared/constants/route-api';

const options: CreateAxiosDefaults = {
	baseURL: `/${ROUTE_API_BASE_SEGMENT}`,
	withCredentials: true
};

export const axiosAuth = axios.create(options);

axiosAuth.interceptors.response.use(
	(response: AxiosResponse) => response,
	(error: AxiosError) => {
		const { response } = error;

		if (response) {
			const statusCode = response.status;

			if (statusCode === HttpStatusCode.Unauthorized) {
				window.location.href = ROUTE_API_LOGOUT_PATHNAME;

				return;
			}
		}

		return Promise.reject(error);
	}
);
