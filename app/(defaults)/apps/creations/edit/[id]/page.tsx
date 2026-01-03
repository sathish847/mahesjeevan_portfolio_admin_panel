import ComponentsAppsCreationsEdit from '@/components/apps/creations/components-apps-creations-edit';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Edit Creation',
};

const CreationsEdit = () => {
    return <ComponentsAppsCreationsEdit />;
};

export default CreationsEdit;
