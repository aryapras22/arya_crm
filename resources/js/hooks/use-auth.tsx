import { User } from '@/types/user';
import { usePage } from '@inertiajs/react';

interface PageProps {
    auth: {
        user: User;
    };
    [key: string]: unknown;
}

export function useAuth() {
    const { auth } = usePage<PageProps>().props;

    return {
        user: auth.user,
        isAuthenticated: !!auth.user,
        isManager: auth.user?.role === 'manager',
        isSales: auth.user?.role === 'sales',
        role: auth.user?.role,
    };
}
