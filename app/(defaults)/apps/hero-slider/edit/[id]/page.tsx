import ComponentsAppsHeroSliderEdit from '@/components/apps/hero-slider/components-apps-hero-slider-edit';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Edit Hero Slider',
};

const HeroSliderEdit = () => {
    return <ComponentsAppsHeroSliderEdit />;
};

export default HeroSliderEdit;
