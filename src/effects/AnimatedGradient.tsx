import * as React from 'react';
import { range } from '../utils';

interface AnimatedGradientProps {
  direction?: number;
  duration?: number;
  colors?: string[];
}

export const AnimatedGradient: React.FunctionComponent<AnimatedGradientProps> = ({
  direction = 45,
  duration = 1,
  colors = ['#9df', '#9fd', '#df9', '#fd9']
}) => {
  const length = colors.length * 4 + 1;
  const directionRad = (direction * Math.PI) / 180;
  let gx = Math.pow(Math.cos(directionRad), 2);
  let gy = Math.sqrt(gx - Math.pow(gx, 2));

  if (directionRad > Math.PI / 4) {
    gy = Math.pow(Math.sin(directionRad), 2);
    gx = Math.sqrt(gy - Math.pow(gy, 2));
  }

  const x = -gx * 100;
  const y = -gy * 100;

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
      <defs>
        <linearGradient id="gradient" x1="0" x2={gx} y1="0" y2={gy}>
          {range(length).map(i => (
            <stop
              key={i}
              offset={(i * 100) / (length - 1) + '%'}
              stopColor={colors[i % colors.length]}
            />
          ))}
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="400" fill="url(#gradient)">
        <animateTransform
          attributeName="transform"
          type="translate"
          from={`${x},${y}`}
          to={`0,0`}
          dur={`${duration}s`}
          repeatCount="indefinite"
        />
      </rect>
    </svg>
  );
};
