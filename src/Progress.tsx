import * as React from 'react';

export interface ProgressProps {
  value: number;
  children: () => number;
  minValue?: number;
  maxValue?: number;
  transitionDuration?: number;
}

export function withProgress() {}
