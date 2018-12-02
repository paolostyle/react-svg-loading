import * as React from 'react';
import { Direction, GeoAttributes, RootStyle } from './types';
import { randString } from './utils';

type DirectionId = 'ltr' | 'rtl' | 'ttb' | 'btt';
type Directions = { [key in DirectionId]: Direction };

const directions: Directions = {
  ltr: { x: -1, y: 0, trX: 1, trY: 0 },
  rtl: { x: 1, y: 0, trX: -1, trY: 0 },
  ttb: { x: 0, y: -1, trX: 0, trY: 1 },
  btt: { x: 0, y: 1, trX: 0, trY: -1 }
};

export interface FillImageProps {
  image: string;
  fillBackground: string;
  fillBackgroundExtrude: number;
  fillDirection: DirectionId;
  setDim: boolean;
  value: number;
  minValue: number;
  maxValue: number;
  duration: number;
  timingFunction: string;
  imageSize?: {
    width: number;
    height: number;
  };
  bbox?: GeoAttributes;
  rootProps?: any;
}

export interface FillImageState {
  width: number;
  height: number;
  viewBox: string;
  rectAttrs: GeoAttributes;
  rootStyle: RootStyle;
  multipliers: Direction;
}

export class FillImageLoading extends React.Component<FillImageProps, FillImageState> {
  static defaultProps: Partial<FillImageProps> = {
    fillDirection: 'btt',
    fillBackground: '#ddd',
    fillBackgroundExtrude: 2,
    setDim: true,
    value: 0,
    minValue: 0,
    maxValue: 100,
    duration: 0.5,
    timingFunction: 'ease'
  };

  state: FillImageState = {
    width: 100,
    height: 100,
    viewBox: '0 0 100 100',
    rectAttrs: {
      x: 0,
      y: 0,
      width: 100,
      height: 100
    },
    rootStyle: {},
    multipliers: directions[this.props.fillDirection]
  };

  private image = new Image();
  private imageRef = React.createRef<SVGImageElement>();
  private idPrefix = 'loading-bar-' + randString();
  private ids = {
    filter: this.idPrefix + '-filter',
    mask: this.idPrefix + '-mask',
    clip: this.idPrefix + '-clip'
  };

  constructor(props: FillImageProps) {
    super(props);

    this.image.addEventListener('load', this.setAttributes);
    this.image.src = this.props.image;
  }

  componentDidUpdate(prevProps: FillImageProps) {
    if (prevProps.image !== this.props.image) {
      this.image.src = this.props.image;
    }
  }

  componentWillUnmount() {
    this.image.removeEventListener('load', this.setAttributes);
  }

  render() {
    const { height, width, multipliers, viewBox, rootStyle, rectAttrs } = this.state;
    const {
      fillBackgroundExtrude,
      fillBackground,
      image,
      rootProps,
      value,
      minValue,
      maxValue,
      duration,
      timingFunction
    } = this.props;

    const valuePercent = this.getPercentValue(value, minValue, maxValue);
    const clipDestX = multipliers.trX * width * valuePercent;
    const clipDestY = multipliers.trY * height * valuePercent;
    const clipDestination = `${clipDestX},${clipDestY}`;

    const transition = `transform ${duration}s ${timingFunction}`;

    return (
      <div {...rootProps} style={rootStyle}>
        <svg preserveAspectRatio="xMidYMid" width="100%" height="100%" viewBox={viewBox}>
          <defs>
            <filter x={-1} y={-1} width={3} height={3} id={this.ids.filter}>
              <feMorphology operator="dilate" radius={fillBackgroundExtrude} />
              <feColorMatrix
                values={`
                  0 0 0 0 1
                  0 0 0 0 1
                  0 0 0 0 1
                  0 0 0 1 0
                `}
                result="cm"
              />
            </filter>
            <mask id={this.ids.mask}>
              <image
                xlinkHref={this.props.image}
                filter={`url(#${this.ids.filter})`}
                x={0}
                y={0}
                width={width}
                height={height}
                preserveAspectRatio="xMidYMid"
              />
            </mask>
            <clipPath id={this.ids.clip}>
              <rect
                fill="#000"
                x={multipliers.x * width}
                y={multipliers.y * height}
                width={width}
                height={height}
                transform={`translate(${clipDestination})`}
                style={{ transition }}
              />
            </clipPath>
          </defs>
          <g>
            <rect
              x={rectAttrs.x}
              y={rectAttrs.y}
              width={rectAttrs.width}
              height={rectAttrs.height}
              mask={`url(#${this.ids.mask})`}
              fill={fillBackground}
            />
            <image
              x={0}
              y={0}
              width={width}
              height={height}
              ref={this.imageRef}
              preserveAspectRatio="xMidYMid"
              clipPath={`url(#${this.ids.clip})`}
              xlinkHref={image}
            />
          </g>
        </svg>
      </div>
    );
  }

  private getPercentValue = (value: number, min: number, max: number) => {
    const normalizedValue = Math.min(Math.max(value, min), max);
    return (normalizedValue - min) / (max - min);
  };

  private setAttributes = () => {
    let height = 100;
    let width = 100;

    if (this.props.imageSize && this.props.imageSize.height && this.props.imageSize.width) {
      width = this.props.imageSize.width;
      height = this.props.imageSize.height;
    } else if (this.image.width && this.image.height) {
      width = this.image.width;
      height = this.image.height;
    }

    this.setState({ width, height }, this.fitImage);
  };

  private fitImage = () => {
    const { fillBackgroundExtrude, bbox, setDim } = this.props;
    const d = fillBackgroundExtrude * 1.5;
    let box: GeoAttributes = {
      x: 0,
      y: 0,
      width: 0,
      height: 0
    };

    if (bbox) {
      box = bbox;
    } else if (this.imageRef.current) {
      const imageBBox = this.imageRef.current.getBBox();
      if (imageBBox.width !== 0 && imageBBox.height !== 0) {
        box = imageBBox;
      }
    }

    const rectAttrs = {
      x: box.x - d,
      y: box.y - d,
      width: box.width + d * 2,
      height: box.height + d * 2
    };

    const { x, y, width: rectWidth, height: rectHeight } = rectAttrs;
    const viewBox = [x, y, rectWidth, rectHeight].join(' ');
    const rootStyle = setDim ? { width: rectWidth + 'px', height: rectHeight + 'px' } : {};

    this.setState({ viewBox, rectAttrs, rootStyle });
  };
}
