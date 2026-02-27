import { Metadata } from 'next';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
	title: 'E-Commerce App v2'
};

export default function Home() {
	redirect('/dashboard');
}
