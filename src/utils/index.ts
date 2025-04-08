import { UploadFile } from "antd";
import _ from "lodash";

// 图片转Base64  并压缩
export const compressImageToBase64 = (
  file: UploadFile["originFileObj"] | Blob,
  maxWidth: number = 800,
  maxHeight: number = 600,
  quality: number = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!(file instanceof Blob)) {
      reject(new Error("Invalid input: Expected a File or Blob object"));
      return;
    }

    const img = new Image();
    const reader = new FileReader();

    // 读取文件为 Data URL
    reader.onload = () => {
      img.src = reader.result as string;

      img.onload = () => {
        // 创建一个 canvas 元素
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          reject(new Error("Failed to get canvas context"));
          return;
        }

        // 计算压缩比例
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        // 设置 canvas 的宽高
        canvas.width = width;
        canvas.height = height;

        // 绘制图片到 canvas 上
        ctx.drawImage(img, 0, 0, width, height);

        // 将 canvas 转换为 Base64，并指定图片质量和格式
        const base64 = canvas.toDataURL("image/jpeg", quality);
        resolve(base64);
      };

      img.onerror = () => {
        reject(new Error("Failed to load image"));
      };
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsDataURL(file);
  });
};

// 递归提取所有路径
export const getAllPaths: any = (routes: any[]) => {
  return _.flatMap(routes, (route: any) => {
    // 当前路由的 path
    const currentPath = route.path;

    // 子路由的 paths
    const childPaths = route.routes ? getAllPaths(route.routes) : [];

    // 合并当前 path 和子路由 paths
    return _.compact([currentPath, ...childPaths]);
  });
};
