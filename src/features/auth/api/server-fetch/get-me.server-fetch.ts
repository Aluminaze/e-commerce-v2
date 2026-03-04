import { cache } from 'react';

import { User } from '@/features/user/model';
import { serverFetch } from '@/shared/lib/server-fetch';

export const getMe = cache(() => serverFetch<User>('auth/me'));
