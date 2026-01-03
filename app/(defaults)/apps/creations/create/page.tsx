import ComponentsAppsCreationsCreate from '@/components/apps/creations/components-apps-creations-create';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Create Creation',
};

const CreationsCreate = () => {
    return <ComponentsAppsCreationsCreate />;
};

export default CreationsCreate;
