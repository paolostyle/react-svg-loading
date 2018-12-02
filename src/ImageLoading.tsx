import * as React from 'react';
import { Direction, GeoAttributes, RootStyle } from './types';
import { randString } from './utils';

const directions = {
  ltr: { x: -1, y: 0, trX: 1, trY: 0 },
  rtl: { x: 1, y: 0, trX: -1, trY: 0 },
  ttb: { x: 0, y: -1, trX: 0, trY: 1 },
  btt: { x: 0, y: 1, trX: 0, trY: -1 }
};

export interface ImageLoadingProps {
  type: 'fill' | 'stroke';
  image: string;
  path: string;
  fillDirection: 'ltr' | 'rtl' | 'ttb' | 'btt';
  fill: string;
  fillBackground: string;
  fillBackgroundExtrude: number;
  patternSize: number;
  strokeDir: string;
  stroke: string;
  strokeWidth: number;
  strokeTrail: string;
  strokeTrailWidth: number;
  imageSize: number[];
  bbox: GeoAttributes;
  setDim: boolean; // ?
  rootProps: any;
}

export interface ImageLoadingState {
  width: number;
  height: number;
  viewBox: string;
  rectAttrs: GeoAttributes;
  rootStyle: RootStyle;
  multipliers: Direction;
  pathLength: number;
}

export class ImageLoading extends React.Component<ImageLoadingProps, ImageLoadingState> {
  static defaultProps: Partial<ImageLoadingProps> = {
    fillDirection: 'btt',
    fill: '#25b',
    fillBackground: '#ddd',
    fillBackgroundExtrude: 3,
    strokeDir: 'normal',
    stroke: '#25b',
    strokeWidth: 3,
    strokeTrail: '#ddd',
    strokeTrailWidth: 0.5,
    setDim: true
  };

  state: ImageLoadingState = {
    width: 100,
    height: 100,
    viewBox: '0 0 100 100',
    rectAttrs: {
      x: 0,
      y: 0,
      width: 100,
      height: 100
    },
    pathLength: 0,
    rootStyle: {},
    multipliers: directions[this.props.fillDirection]
  };

  private image = new Image();
  private imageRef = React.createRef<SVGImageElement>();
  private idPrefix = 'loading-bar-' + randString();
  private ids = {
    filter: this.idPrefix + '-filter',
    mask: this.idPrefix + '-mask',
    maskPath: this.idPrefix + '-mask-path',
    clip: this.idPrefix + '-clip',
    pattern: this.idPrefix + '-pattern'
  };

  constructor(props: ImageLoadingProps) {
    super(props);
    this.image.addEventListener('load', this.setAttributes);
    this.image.src = this.props.image;
  }

  componentDidUpdate(prevProps: ImageLoadingProps) {
    if (prevProps.image !== this.props.image) {
      this.image.src = this.props.image;
    }
  }

  componentWillUnmount() {
    this.image.removeEventListener('load', this.setAttributes);
  }

  render() {
    const { height, width, multipliers, viewBox, rootStyle, rectAttrs, pathLength } = this.state;
    const { type, fillBackgroundExtrude, fillBackground, path, image, rootProps } = this.props;
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
            <mask id={this.ids.maskPath}>
              <path
                d={this.props.path}
                fill="#fff"
                stroke="#fff"
                filter={`url(#${this.ids.filter})`}
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
            <pattern
              id={this.ids.pattern}
              patternUnits="userSpaceOnUse"
              x={0}
              y={0}
              width={300}
              height={300}
            >
              <image x={0} y={0} width={300} height={300} />
            </pattern>
          </defs>
          <g className="with-path">
            {type === 'stroke' ? (
              <path d={path} fill="none" className="baseline" />
            ) : (
              <rect
                x={rectAttrs.x}
                y={rectAttrs.y}
                width={rectAttrs.width}
                height={rectAttrs.height}
                mask={`url(#${this.ids.maskPath})`}
                fill={fillBackground}
                className="frame"
              />
            )}
            <path
              d={path}
              ref={(ref: SVGPathElement) => ref.getTotalLength()}
              className={type === 'stroke' ? 'mainline' : 'solid'}
              clipPath={type === 'fill' ? `url(#${this.ids.clip})` : ''}
              fill={type === 'stroke' ? 'none' : undefined}
              // strokeDasharray={pathLength}
              // strokeDashoffset={pathLength}
            />
          </g>
          <g className="with-image">
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
              xlinkHref={image}
              className="solid"
            />
          </g>
        </svg>
      </div>
    );
  }

  private setAttributes = () => {
    let height = 100;
    let width = 100;

    if (this.props.imageSize) {
      width = this.props.imageSize[0];
      height = this.props.imageSize[1];
    } else if (this.image.width && this.image.height) {
      width = this.image.width;
      height = this.image.height;
    }
    this.setState({ width, height }, this.fitImage);
  };

  private fitImage = () => {
    const { strokeWidth, strokeTrailWidth, fillBackgroundExtrude } = this.props;
    const d = Math.max(strokeWidth, strokeTrailWidth, fillBackgroundExtrude) * 1.5;
    const box = this.props.bbox || (this.imageRef.current && this.imageRef.current.getBBox());

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
    const rootStyle = this.props.setDim
      ? { width: rectWidth + 'px', height: rectHeight + 'px' }
      : {};

    this.setState({ viewBox, rectAttrs, rootStyle });
  };
}
