import ComponentsAppsEventCreate from '@/components/apps/events/components-apps-event-create';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Create Event',
};

const EventCreate = () => {
    return <ComponentsAppsEventCreate />;
};

export default EventCreate;
