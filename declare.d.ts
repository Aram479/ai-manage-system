import * as fs from "fs";
import { RouteObject } from "react-router-dom";

declare global {
  interface Window {
    fs: typeof fs;
    abortController: AbortController;
  }
}
