import { BaseToolsFunctions, TBaseTools } from './baseTools';
import { MenuToolsFunctions, TMenuTools } from './menuTools';
import { SbomDeviateConfigToolsFunctions, TSbomDeviateConfigTools } from './sbomDeviateConfigTools';
import { SbomEBUToolsFunctions, TSbomEBUTools } from './sbomEBUTools';

export type TGlobalToolsEvent = TBaseTools | TSbomEBUTools | TSbomDeviateConfigTools | TMenuTools;

// 合并所有工具函数集合
const allToolsFunctions = {
  ...BaseToolsFunctions,
  ...SbomEBUToolsFunctions,
  ...SbomDeviateConfigToolsFunctions,
  ...MenuToolsFunctions,
};

// 动态调用所有工具函数
export const allTools = (props: any) => {
  return Object.values(allToolsFunctions).map((func) => func(props));
};
