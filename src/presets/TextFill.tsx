import * as React from 'react';
import { FillImageLoading, FillImageProps } from '../FillImageLoading';
import { encodeSvg } from '../utils';

export interface TextFillProps extends FillImageProps {
  text?: string;
  textFill?: string;
  width?: number;
  height?: number;
  fontSize?: number;
  fontFamily?: string;
}

export const TextFill: React.FunctionComponent<TextFillProps> = ({
  text = 'LOADING',
  textFill = '#000',
  width = 70,
  height = 20,
  fontSize = 16,
  fontFamily = 'sans-serif',
  ...rest
}) => {
  const svgText = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
    >
      <text
        x={width / 2}
        y={height / 2}
        textAnchor="middle"
        dominantBaseline="central"
        fill={textFill}
        fontSize={fontSize}
        fontFamily={fontFamily}
      >
        {text}
      </text>
    </svg>
  );

  return (
    <FillImageLoading
      image={encodeSvg(svgText)}
      fillBackgroundExtrude={1.3}
      fillDirection="ltr"
      imageSize={{ height, width }}
      bbox={{
        x: 0,
        y: 0,
        width,
        height
      }}
      {...rest}
    />
  );
};
