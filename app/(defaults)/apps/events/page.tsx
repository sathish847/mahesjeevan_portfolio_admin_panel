import ComponentsAppsEvents from '@/components/apps/events/components-apps-events';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Events',
};

const Events = () => {
    return <ComponentsAppsEvents />;
};

export default Events;
