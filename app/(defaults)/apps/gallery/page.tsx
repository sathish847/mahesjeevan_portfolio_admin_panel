import ComponentsAppsGallery from '@/components/apps/gallery/components-apps-gallery';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Gallery',
};

const Gallery = () => {
    return <ComponentsAppsGallery />;
};

export default Gallery;
