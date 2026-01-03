import ComponentsAppsHeroSliderCreate from '@/components/apps/hero-slider/components-apps-hero-slider-create';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Create Hero Slider',
};

const HeroSliderCreate = () => {
    return <ComponentsAppsHeroSliderCreate />;
};

export default HeroSliderCreate;
