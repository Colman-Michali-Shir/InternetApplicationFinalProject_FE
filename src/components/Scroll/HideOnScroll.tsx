import React from 'react';
import { Slide, useScrollTrigger } from '@mui/material';

interface HideOnScrollProps {
  window?: () => Window;
  children?: React.ReactElement<unknown>;
}

const HideOnScroll = (props: HideOnScrollProps) => {
  const { children, window } = props;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
  });

  return (
    <Slide appear={false} direction="down" in={!trigger}>
      {children ?? <div />}
    </Slide>
  );
};

export default HideOnScroll;
