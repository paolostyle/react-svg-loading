import * as React from 'react';
import { range } from './utils';

interface AnimatedStripeProps {
  color1: string;
  color2: string;
  duration: number;
}

export const AnimatedStripe: React.SFC<AnimatedStripeProps> = props => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <rect fill={props.color2} width="100" height="100" />
      <g>
        <g>
          {range(13).map(i => {
            const j = i * 20;
            const points = `${j - 90},100 ${j - 100},100 ${j - 60},0 ${j - 50},0`;
            return <polygon key={i} fill={props.color1} points={points} />;
          })}
        </g>
        <animateTransform
          attributeName="transform"
          type="translate"
          from="0,0"
          to="20,0"
          dur={`${props.duration}s`}
          repeatCount="indefinite"
        />
      </g>
    </svg>
  );
};

AnimatedStripe.defaultProps = {
  color1: '#b4b4b4',
  color2: '#e6e6e6',
  duration: 1
};
