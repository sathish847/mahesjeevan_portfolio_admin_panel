import ComponentsAppsBlogs from '@/components/apps/blogs/components-apps-blogs';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Blogs',
};

const Blogs = () => {
    return <ComponentsAppsBlogs />;
};

export default Blogs;
