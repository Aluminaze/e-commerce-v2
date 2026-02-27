import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'sonner';

import { Providers } from '@/shared/ui/providers';

import './globals.css';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin']
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin']
});

export const metadata: Metadata = {
	title: 'Single Refresh Token Demo',
	description: 'Auth demo with httpOnly cookies and single refresh per session'
};

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>{children}</Providers>
				<Toaster position='top-right' richColors />
			</body>
		</html>
	);
}
