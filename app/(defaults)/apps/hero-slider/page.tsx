import ComponentsAppsHeroSlider from '@/components/apps/hero-slider/components-apps-hero-slider';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Hero Slider',
};

const HeroSlider = () => {
    return <ComponentsAppsHeroSlider />;
};

export default HeroSlider;
