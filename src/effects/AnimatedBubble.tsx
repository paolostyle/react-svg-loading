import * as React from 'react';
import { range } from '../utils';

interface AnimatedBubbleProps {
  bgColor: string;
  bubbleColor: string;
  count: number;
  duration: number;
  size: number;
  strokeWidth: number;
}

export const AnimatedBubble: React.SFC<AnimatedBubbleProps> = props => {
  const { bgColor, bubbleColor, count, duration, size, strokeWidth } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
      <rect fill={bgColor} width="200" height="200" />
      {range(count).map(i => {
        const begin = -(i / count) * duration;
        const bubbleDuration = duration * (1 + Math.random() * 0.5);
        const x = Math.random() * 184 + 8;
        const r = (Math.random() * 0.7 + 0.3) * size;
        return range(2).map(j => {
          const animateValues = `${190 + 200 * j};${-10 + 200 * j}`;
          return (
            <circle
              key={`${i}-${j}`}
              cx={x}
              cy="0"
              r={r}
              fill="none"
              stroke={bubbleColor}
              strokeWidth={strokeWidth}
            >
              <animate
                attributeName="cy"
                values={animateValues}
                dur={`${bubbleDuration}s`}
                begin={`${begin}s`}
                repeatCount="indefinite"
              />
            </circle>
          );
        });
      })}
    </svg>
  );
};

AnimatedBubble.defaultProps = {
  bgColor: '#39d',
  bubbleColor: '#9cf',
  count: 15,
  duration: 1,
  size: 6,
  strokeWidth: 1
};
