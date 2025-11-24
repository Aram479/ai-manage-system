import { Message } from "@/pages/ChatRoom/types";
import { UploadFile } from "antd";
import CryptoJS from "crypto-js";
import _ from "lodash";

const SECRET_KEY = "0123456789abcdef";

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

// 加密
export const encryptPassword = (key: string) => {
  return CryptoJS.AES.encrypt(key, SECRET_KEY).toString();
};

// 解密
export const decryptPassword = (code: string) => {
  const bytes = CryptoJS.AES.decrypt(code, SECRET_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

// 将不完整的JSON 格式化为正常的
export const fixJSONSyntax = (str: string): string => {
  let result = str.trim();

  // 补全字符串引号（简单判断：如果最后是字母数字或空格，前面有未闭合的"
  if ((result.match(/"/g) || []).length % 2 === 1) {
    result += '"';
  }

  // 补全花括号
  const openBraces = (result.match(/{/g) || []).length;
  const closeBraces = (result.match(/}/g) || []).length;
  result += "}".repeat(Math.max(0, openBraces - closeBraces));

  // 补全方括号（数组）
  const openBrackets = (result.match(/\[/g) || []).length;
  const closeBrackets = (result.match(/\]/g) || []).length;
  result += "]".repeat(Math.max(0, openBrackets - closeBrackets));

  return result;
};

export const generateMockToken = (
  payload: MockTokenPayload,
  options: { expireInSeconds?: number } = {}
): string => {
  const { expireInSeconds = 3600 } = options;

  // 安全的 Base64 编码（支持 Unicode）
  const safeBtoa = (str: string): string => {
    return btoa(unescape(encodeURIComponent(str)));
  };

  // Base64URL 编码（JWT 标准）
  const base64UrlEncode = (obj: unknown): string => {
    return safeBtoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=/g, "");
  };

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: "HS256", typ: "JWT" };
  const fullPayload = {
    iat: now,
    exp: now + expireInSeconds,
    ...payload,
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(fullPayload);
  const fakeSignature = "fake-signature-for-demo";

  return `${encodedHeader}.${encodedPayload}.${fakeSignature}`;
};

export const copy = (text: string) => {
  let textValue = document.createElement("textarea");
  textValue.setAttribute("readonly", "readonly"); //设置只读属性防止手机上弹出软键盘
  textValue.value = text;
  document.body.appendChild(textValue); //将textarea添加为body子元素
  textValue.select();
  const res = document.execCommand("copy");
  document.body.removeChild(textValue); //移除DOM元素
  return res;
};

export const requestNotify = async (message: Message) => {
  if (Notification.permission === "granted") {
    new Notification("新消息", { body: message.content });
  } else if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      new Notification("新消息", { body: message.content });
    }
  }
};
