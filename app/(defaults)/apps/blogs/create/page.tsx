import ComponentsAppsBlogCreate from '@/components/apps/blogs/components-apps-blog-create';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Create Blog',
};

const BlogCreate = () => {
    return <ComponentsAppsBlogCreate />;
};

export default BlogCreate;
