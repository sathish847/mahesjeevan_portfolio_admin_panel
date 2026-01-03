import ComponentsAppsServices from '@/components/apps/services/components-apps-services';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Services',
};

const Services = () => {
    return <ComponentsAppsServices />;
};

export default Services;
