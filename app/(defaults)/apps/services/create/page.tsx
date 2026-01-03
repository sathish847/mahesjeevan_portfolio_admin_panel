import ComponentsAppsServiceCreate from '@/components/apps/services/components-apps-service-create';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Create Service',
};

const ServiceCreate = () => {
    return <ComponentsAppsServiceCreate />;
};

export default ServiceCreate;
