import * as React from 'react';
import { Direction, GeoAttributes, RootStyle } from './types/FillLoading';
import { randString } from './utils';

const directions = {
  ltr: { x: -1, y: 0, trX: 1, trY: 0 },
  rtl: { x: 1, y: 0, trX: -1, trY: 0 },
  ttb: { x: 0, y: -1, trX: 0, trY: 1 },
  btt: { x: 0, y: 1, trX: 0, trY: -1 }
};

export interface FillLoadingProps {
  image: string;
  duration: number;
  direction: 'ltr' | 'rtl' | 'ttb' | 'btt';
}

export interface FillLoadingState {
  width: number;
  height: number;
  viewBox: string;
  rectAttrs: GeoAttributes;
  rootStyle: RootStyle;
  multipliers: Direction;
}

export class FillLoading extends React.Component<FillLoadingProps, FillLoadingState> {
  state: FillLoadingState = {
    width: 100,
    height: 100,
    viewBox: '0 0 100 100',
    rectAttrs: {
      x: 0,
      y: 0,
      width: 100,
      height: 100
    },
    rootStyle: {
      width: '100%',
      height: '100%'
    },
    multipliers: directions[this.props.direction]
  };
  private image = new Image();
  private imageRef = React.createRef<SVGImageElement>();
  private idPrefix = 'loading-bar-' + randString();
  private ids = {
    clip: this.idPrefix + '-clip',
    filter: this.idPrefix + '-filter',
    pattern: this.idPrefix + '-pattern',
    mask: this.idPrefix + '-mask',
    maskPath: this.idPrefix + '-mask-path'
  };

  constructor(props: FillLoadingProps) {
    super(props);
    this.image.addEventListener('load', this.setAttributes);
    this.image.src = this.props.image;
  }

  componentDidUpdate(prevProps: FillLoadingProps) {
    if (prevProps.image !== this.props.image) {
      this.image.src = this.props.image;
    }
  }

  componentWillUnmount() {
    this.image.removeEventListener('load', this.setAttributes);
  }

  render() {
    const { height, width, multipliers, viewBox, rootStyle, rectAttrs } = this.state;
    return (
      <div style={rootStyle}>
        <svg preserveAspectRatio="xMidYMid" width="100%" height="100%" viewBox={viewBox}>
          <defs>
            <filter x={-1} y={-1} width={3} height={3} id={this.ids.filter}>
              <feMorphology operator="dilate" radius={3} />
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
                className="mask"
                fill="#000"
                x={multipliers.x * width}
                y={multipliers.y * height}
                width={width}
                height={height}
              >
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  from={`0,0`}
                  to={`${multipliers.trX * width},${multipliers.trY * height}`}
                  dur={`${this.props.duration}s`}
                  repeatCount="1"
                  fill="freeze"
                />
              </rect>
            </clipPath>
          </defs>
          <rect
            x={rectAttrs.x}
            y={rectAttrs.y}
            width={rectAttrs.width}
            height={rectAttrs.height}
            mask={`url(#${this.ids.mask})`}
            fill="#ddd"
          />
          <image
            x={0}
            y={0}
            width={width}
            height={height}
            ref={this.imageRef}
            preserveAspectRatio="xMidYMid"
            clipPath={`url(#${this.ids.clip})`}
            xlinkHref={this.props.image}
            className="solid"
          />
        </svg>
      </div>
    );
  }

  private setAttributes = () => {
    const { width, height } = this.image;
    this.setState({ width, height }, () => {
      const d = 4.5;
      const box = this.imageRef.current!.getBBox();

      if (!box || box.width === 0 || box.height === 0) {
        box.x = 0;
        box.y = 0;
        box.width = 0;
        box.height = 0;
      }

      const rectAttrs = {
        x: box.x - d,
        y: box.y - d,
        width: box.width + d * 2,
        height: box.height + d * 2
      };

      const { x, y, width: rectWidth, height: rectHeight } = rectAttrs;
      const viewBox = [x, y, rectWidth, rectHeight].join(' ');
      const rootStyle = { width: rectWidth + 'px', height: rectHeight + 'px' };

      this.setState({ viewBox, rectAttrs, rootStyle });
    });
  };
}
