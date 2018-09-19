export interface GeoAttributes {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Direction {
  x: number;
  y: number;
  trX: number;
  trY: number;
}

export interface RootStyle {
  width: string;
  height: string;
}

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
