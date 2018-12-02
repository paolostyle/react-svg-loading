import { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

export const randString = (n: number = 5): string =>
  Math.random()
    .toString(36)
    .substr(2, n);

export const range = (n: number, start: number = 0): number[] =>
  Array.from({ length: n }, (_, i) => i + start);

export const encodeSvg = (reactElement: ReactElement<any>): string =>
  'data:image/svg+xml,' + escape(renderToStaticMarkup(reactElement));
