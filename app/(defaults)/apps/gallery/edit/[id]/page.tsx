import ComponentsAppsGalleryEdit from '@/components/apps/gallery/components-apps-gallery-edit';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Edit Gallery Item',
};

const GalleryEdit = () => {
    return <ComponentsAppsGalleryEdit />;
};

export default GalleryEdit;
