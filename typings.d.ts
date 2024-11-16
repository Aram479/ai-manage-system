declare module '*.css';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;

  const url: string;
  export default url;
}
declare module 'qs';
declare module 'umi' {
  import { UmiHistory } from '@/.umi/core/historyIntelli';
  export const history: UmiHistory;
}
declare module 'src/asset/js/web-office-sdk-v1.1.19';
