import * as fs from 'fs';

declare global {
  interface Window {
    fs: typeof fs;
  }
}
