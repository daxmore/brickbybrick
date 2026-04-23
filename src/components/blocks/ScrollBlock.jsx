import React from 'react';
import SplitFlipScroll from './scroll/SplitFlipScroll';
import StickyScalingScroll from './scroll/StickyScalingScroll';

const ScrollBlock = (blockProps) => {
  const { props } = blockProps;
  
  switch (props.variant) {
    case 'sticky-scaling':
      return <StickyScalingScroll {...blockProps} />;
    default:
      return <SplitFlipScroll {...blockProps} />;
  }
};

export default ScrollBlock;
