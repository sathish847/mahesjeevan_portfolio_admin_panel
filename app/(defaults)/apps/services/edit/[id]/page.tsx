import ComponentsAppsServiceEdit from '@/components/apps/services/components-apps-service-edit';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Edit Service',
};

const ServiceEdit = () => {
    return <ComponentsAppsServiceEdit />;
};

export default ServiceEdit;
