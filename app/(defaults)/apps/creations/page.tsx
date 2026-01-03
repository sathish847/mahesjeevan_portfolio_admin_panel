import ComponentsAppsCreations from '@/components/apps/creations/components-apps-creations';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'My Creations',
};

const Creations = () => {
    return <ComponentsAppsCreations />;
};

export default Creations;
