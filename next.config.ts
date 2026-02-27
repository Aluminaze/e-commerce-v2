import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	env: {
		ACCESS_TOKEN_TTL_MINS: process.env.ACCESS_TOKEN_TTL_MINS,
		REFRESH_TOKEN_TTL_MINS: process.env.REFRESH_TOKEN_TTL_MINS
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'dummyjson.com'
			},
			{
				protocol: 'https',
				hostname: 'cdn.dummyjson.com'
			}
		]
	},
	output: 'standalone'
};

export default nextConfig;
