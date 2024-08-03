import { assign, assignWith, isUndefined } from 'lodash';

export function mergeProps(a: number, b: number): number;
export function mergeProps(a: string, b: string): string;
export function mergeProps(a: number, b: string, c: number): string;
export function mergeProps(...item) {
  const [a, b, c] = item;
  if (c) {
    return a * c + b;
  }
  return a + b;
}
