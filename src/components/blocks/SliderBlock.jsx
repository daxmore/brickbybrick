import React from 'react';
import ArcSlider from './slider/ArcSlider';
import CinematicSlider from './slider/CinematicSlider';

const SliderBlock = (blockProps) => {
  const { props } = blockProps;
  
  switch (props.variant) {
    case 'cinematic':
      return <CinematicSlider {...blockProps} />;
    default:
      return <ArcSlider {...blockProps} />;
  }
};

export default SliderBlock;
