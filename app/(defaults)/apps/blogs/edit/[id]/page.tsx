import ComponentsAppsBlogEdit from '@/components/apps/blogs/components-apps-blog-edit';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Edit Blog',
};

const BlogEdit = () => {
    return <ComponentsAppsBlogEdit />;
};

export default BlogEdit;
