import ComponentsAppsEventEdit from '@/components/apps/events/components-apps-event-edit';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Edit Event',
};

const EventEdit = () => {
    return <ComponentsAppsEventEdit />;
};

export default EventEdit;
