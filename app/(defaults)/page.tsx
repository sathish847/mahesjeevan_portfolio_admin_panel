'use client';
import ComponentsDashboardSales from '@/components/dashboard/components-dashboard-sales';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Sales = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return; // Still loading
        if (!session) {
            router.push('/auth/cover-login');
        }
    }, [session, status, router]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (!session) {
        return null; // Will redirect
    }

    return <ComponentsDashboardSales />;
};

export default Sales;
