export const randString = (n = 5) =>
  Math.random()
    .toString(36)
    .substr(2, n);

export const range = (n: number, start: number = 0): number[] =>
  Array.from({ length: n }, (_, i) => i + start);
