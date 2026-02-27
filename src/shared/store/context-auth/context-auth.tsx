'use client';

import React, { Dispatch, FC, PropsWithChildren, SetStateAction } from 'react';

import { User } from '@/features/user/model';

export type ContextAuthProps = {
	user: User | null;
	setUser: Dispatch<SetStateAction<User | null>>;
};

export const ContextAuth = React.createContext<ContextAuthProps | null>(null);

export const ContextAuthProvider: FC<PropsWithChildren> = ({ children }) => {
	const [user, setUser] = React.useState<User | null>(null);

	const value: ContextAuthProps = React.useMemo(
		() => ({
			user,
			setUser
		}),
		[user]
	);

	return <ContextAuth.Provider value={value}>{children}</ContextAuth.Provider>;
};
