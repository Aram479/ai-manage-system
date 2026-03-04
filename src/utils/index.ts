import { Message } from "@/pages/ChatRoom/types";
import { JSONContent } from "@tiptap/core";
import { UploadFile } from "antd";
import { RcFile } from "antd/es/upload";
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

// 获取文件名称后缀
export const getFilenameSuffix = (filename?: string) => {
  const suffixMatch = filename?.match(/\.([^.]+)$/);
  const fileSuffix = suffixMatch ? suffixMatch[1] : null;
  return fileSuffix;
};

interface ImageNode {
  type: "image";
  attrs: {
    src: string;
    title: string;
    [key: string]: any;
  };
}

interface ImageNode {
  type: "image";
  attrs: {
    [key: string]: any;
    title: string; // 假设 title 是文件名字符串（如 "photo.png"）
    src: string;
  };
}

/**
 * 将 blob URL 转为 RcFile（模拟 RcFile）
 */
export async function blobUrlToRcFile(
  blobUrl: string,
  filename: string
): Promise<RcFile> {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  // 创建 File 对象
  const file = new File([blob], filename, {
    type: blob.type,
    lastModified: Date.now(),
  });

  // 模拟 RcFile 接口（Ant Design 的 RcFile 是 File + uid）
  const rcFile = Object.assign(file, {
    uid: `rc-upload-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  }) as RcFile;

  return rcFile;
}

// 定义类型（可选但推荐）
interface Node {
  type?: string;
  attrs?: Record<string, any>;
  content?: Node[];
}

// 递归提取聊天室的对话数据中所有 content 数组中的元素（扁平化）
export function extractAllContent(node: JSONContent = {}): JSONContent[] {
  if (!node.content || !Array.isArray(node.content)) {
    return [];
  }

  // 对当前 content 中的每个子节点，递归提取其 content，并合并
  return _.flatMap(node.content, (child) => [
    child, // 保留当前子节点本身
    ...extractAllContent(child), // 递归提取它的 content
  ]);
}

/**
 * 从 Tiptap content 中提取 image 节点，将 blob src 转为 RcFile，并按 filename 去重
 */
export const extractUniqueImageNodes = async (
  content: any
): Promise<{ src: string; file: RcFile }[]> => {
  // 1. 递归收集所有节点
  const collectNodes = (nodes: any[]): any[] => {
    if (!Array.isArray(nodes)) return [];
    let result: any[] = [];
    for (const node of nodes) {
      if (node && typeof node === "object") {
        result.push(node);
        if (Array.isArray(node.content)) {
          result.push(...collectNodes(node.content));
        }
      }
    }
    return result;
  };

  // 2. 提取所有 image 节点
  const allNodes = Array.isArray(content)
    ? collectNodes(content)
    : collectNodes([content]);

  const imageNodes: ImageNode[] = allNodes.filter(
    (node): node is ImageNode =>
      node?.type === "image" &&
      typeof node.attrs?.src === "string" &&
      typeof node.attrs?.title === "string"
  );

  // 3. 异步转换：只处理 blob: 开头的 src
  const filePromises = imageNodes.map(async (node) => {
    try {
      let finalSrc = node.attrs.src;
      let file: RcFile;

      if (node.attrs.src.startsWith("blob:")) {
        // 转为 RcFile
        file = await blobUrlToRcFile(node.attrs.src, node.attrs.title);
        // 可选：更新 src 为 object URL（或留空，由调用方决定）
        // finalSrc = URL.createObjectURL(file);
      } else {
        // 非 blob URL：无法还原为 File，跳过或 mock（根据需求）
        // 这里选择跳过（因为没有原始 File）
        return null;
      }

      return { src: finalSrc, file };
    } catch (error) {
      return null;
    }
  });

  // 4. 等待所有转换完成，并过滤失败项
  const results = (await Promise.all(filePromises)).filter(
    (item): item is { src: string; file: RcFile } => item !== null
  );

  // 5. 按 file.name 去重（保留首次出现）
  return _.uniqBy(results, (item) => item.file.name);
};

/**
 * 将 HTML 字符串中 title 匹配 file.name 的 <img> 标签的 src 替换为 file.url
 */
export const replaceImageSrcByTitle = (
  html: string,
  file: {
    name: string;
    url: string;
  }
): string => {
  // 正则说明：
  // - 匹配 <img ...>
  // - 捕获 src="..."（非贪婪）
  // - 要求存在 title="file.name"
  // - 兼容属性顺序任意（通过两次 lookahead 预查）
  const regex = new RegExp(
    `<img(?=[^>]*\\s+title\\s*=\\s*["']${_.escapeRegExp(file.name)}["'])` +
      `([^>]*?)\\ssrc\\s*=\\s*["'][^"']*["']([^>]*)>`,
    "gi"
  );

  return html.replace(regex, (match, beforeSrc, afterSrc) => {
    // 构造新标签：保留其他属性，只替换 src
    return `<img${beforeSrc} src="${file.url}"${afterSrc}>`;
  });
};

type HtmlPart = string;

// 发送消息时 将图片(非表情)与其他元素区分开
export function splitHtmlByImagesPreserveBlocks(
  htmlString: string
): HtmlPart[] {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = `<div>${htmlString}</div>`; // 包裹防止解析错乱

  const result: HtmlPart[] = [];
  let currentTextBlock = "";

  /**
   * 递归遍历DOM树，按照原始顺序处理节点
   */
  function walk(node: ChildNode) {
    if (node.nodeType === Node.ELEMENT_NODE && node instanceof HTMLElement) {
      if (node.tagName.toLowerCase() === "img") {
        // 处理图片元素
        processImageElement(node);
      } else {
        // 处理非图片元素
        processNonImageElement(node);
      }
    } else if (node.nodeType === Node.TEXT_NODE) {
      // 处理文本节点
      currentTextBlock += node.textContent || "";
    }
  }

  /**
   * 处理图片元素
   */
  function processImageElement(img: HTMLElement) {
    const src = img.getAttribute("src")?.trim();
    const alt = img.getAttribute("alt") || "";
    const isEmoji = alt.includes("emoji");

    if (src) {
      if (isEmoji) {
        // 处理表情符号，将其添加到当前文本块中（与文字连接）
        const parentElement = img.parentElement;
        if (parentElement) {
          // 移除contentEditable属性以避免浏览器警告
          parentElement.removeAttribute("contentEditable");
          currentTextBlock += parentElement.outerHTML;
        } else {
          currentTextBlock += img.outerHTML;
        }
      } else {
        // 处理普通图片，先完成当前文本块
        if (currentTextBlock.trim()) {
          result.push(currentTextBlock);
          currentTextBlock = "";
        }
        result.push(img.outerHTML);
      }
    }
  }

  /**
   * 处理非图片元素
   */
  function processNonImageElement(element: HTMLElement) {
    // 对于<br>标签，转换为换行符以保留换行效果
    if (element.tagName.toLowerCase() === "br") {
      currentTextBlock += "<br>";
      return;
    }

    // 对于其他非图片元素，递归处理其子节点
    element.childNodes.forEach(walk);
  }

  // 开始遍历DOM树
  const container = tempDiv.firstElementChild;
  if (container) {
    container.childNodes.forEach(walk);
    
    // 将最后剩余的文本块添加到结果中
    if (currentTextBlock.trim()) {
      result.push(currentTextBlock);
    }
  }

  // 清理结果：移除每个内容块开头的多余<br>标签
  return result.map((content) => 
    content.replace(/(<p\b[^>]*>)(\s*<br\s*\/?>\s*)+/gi, "$1")
  );
}
