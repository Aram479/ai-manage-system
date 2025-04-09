import * as baseTools from "./baseTools";
import * as userTools from "./userTools";

export const allTools = [
  ...Object.values(baseTools),
  ...Object.values(userTools),
];
