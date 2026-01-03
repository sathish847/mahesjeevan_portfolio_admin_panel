import ComponentsAppsGalleryCreate from '@/components/apps/gallery/components-apps-gallery-create';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Create Gallery Item',
};

const GalleryCreate = () => {
    return <ComponentsAppsGalleryCreate />;
};

export default GalleryCreate;
