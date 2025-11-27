import React, { useCallback, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Image, message } from "antd";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
import {
  Prism as SyntaxHighlighter,
  SyntaxHighlighterProps,
} from "react-syntax-highlighter";
// 代码高亮主题风格
import {
  darcula,
  oneDark,
  prism,
  vs,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import _ from "lodash";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import remarkGemoji from "remark-gemoji";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import { copy } from "@/utils";
import "./index.less";

// 主题枚举
type TThemeType = "default" | "onDark" | "darcula" | "vs";

// 静态配置提取到组件外部
const ThemeMap = new Map<TThemeType, SyntaxHighlighterProps["style"]>([
  ["default", prism],
  ["onDark", oneDark],
  ["darcula", darcula],
  ["vs", vs],
]);

const inlineCodeStyle = {
  background: "rgba(243, 244, 244)",
  padding: "2px 5px",
  fontSize: "15px",
  color: "rgba(51, 51, 51)",
};

const remarkPlugins = [remarkGfm, remarkMath, remarkGemoji];
const rehypePlugins = [rehypeKatex, rehypeRaw] as const;

interface Props {
  content: string;
  theme?: TThemeType;
  copyCode?: boolean;
  loading?: boolean;
}

// 独立的代码块组件
interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  inline: boolean;
  theme?: TThemeType;
  copyCode: boolean;
  loading: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = React.memo(({
  children,
  className,
  inline,
  theme,
  copyCode,
  loading,
}) => {
  // 匹配指定语言
  const match = /language-(\w+)/.exec(className || "");
  const [isShowCopy, setIsShowCopy] = useState(true);

  // 处理复制代码
  const handleCopy = useCallback(() => {
    setIsShowCopy(true);
    copy(String(children));
    message.success("复制成功");
    setTimeout(() => {
      setIsShowCopy(false);
    }, 3000);
  }, [children]);

  // 内联代码
  if (inline) {
    return (
      <code className={className} style={inlineCodeStyle}>
        {children}
      </code>
    );
  }

  // 代码块
  if (match && match[1]) {
    return (
      <>
        {/* 代码头部 */}
        {!loading && (
          <div className="code-header">
            <div className="lang-box">{match[1]}</div>
            {copyCode && (
              <div className="preview-code-box">
                {!isShowCopy ? (
                  <CopyOutlined
                    className="preview-code-copy"
                    onClick={_.throttle(handleCopy, 3000)}
                  />
                ) : (
                  <div>
                    <CheckOutlined
                      style={{
                        color: "#78c326",
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <SyntaxHighlighter
          showLineNumbers={true}
          wrapLines
          wrapLongLines
          style={ThemeMap.get(theme ?? "default")}
          language={match[1]}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </>
    );
  }

  // 无语言代码块
  return <code className={className}>{children}</code>;
});

// 标题组件
interface HeadingProps {
  level: number;
  children: React.ReactNode;
  id: string;
}

const Heading: React.FC<HeadingProps> = React.memo(({ level, children, id }) => {
  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements;
  return (
    <HeadingTag id={id} className="heading">
      {children}
    </HeadingTag>
  );
});

// 图片组件
interface ImgProps {
  className?: string;
  style?: React.CSSProperties;
  src?: string;
  alt?: string;
}

const MarkdownImage: React.FC<ImgProps> = React.memo(({ className, style, src, alt }) => {
  return (
    <Image
      className={className}
      src={src}
      alt={alt}
      preview={{
        mask: <div style={{ opacity: 0 }}>1</div>,
        maskClassName: "imageMask",
      }}
      style={style}
    />
  );
});

const MarkDownCmp: React.FC<Props> = React.memo(({
  content,
  theme = "default",
  copyCode = true,
  loading = false,
}) => {
  // 生成稳定的id
  const generateId = useCallback((prefix: string, index: number) => {
    // 使用content的哈希值作为前缀的一部分，确保同一内容生成相同的id
    const contentHash = content.length % 1000;
    return `${prefix}-${contentHash}-${index}`;
  }, [content]);

  // 缓存组件配置，避免每次渲染都创建新对象
  const components = useMemo(() => {
    // 用于跟踪标题和图片的索引
    let headingIndex = 0;
    let imgIndex = 0;

    return {
      code: (props: any) => (
        <CodeBlock
          {...props}
          theme={theme}
          copyCode={copyCode}
          loading={loading}
        />
      ),
      h1: ({ children }: { children: React.ReactNode }) => (
        <Heading level={1} children={children} id={generateId('heading', ++headingIndex)} />
      ),
      h2: ({ children }: { children: React.ReactNode }) => (
        <Heading level={2} children={children} id={generateId('heading', ++headingIndex)} />
      ),
      h3: ({ children }: { children: React.ReactNode }) => (
        <Heading level={3} children={children} id={generateId('heading', ++headingIndex)} />
      ),
      h4: ({ children }: { children: React.ReactNode }) => (
        <Heading level={4} children={children} id={generateId('heading', ++headingIndex)} />
      ),
      h5: ({ children }: { children: React.ReactNode }) => (
        <Heading level={5} children={children} id={generateId('heading', ++headingIndex)} />
      ),
      h6: ({ children }: { children: React.ReactNode }) => (
        <Heading level={6} children={children} id={generateId('heading', ++headingIndex)} />
      ),
      img: (props: ImgProps) => (
        <MarkdownImage {...props} />
      ),
    };
  }, [theme, copyCode, loading, generateId]);

  return (
    <div className="markDownCmp">
      <ReactMarkdown
        children={content}
        remarkPlugins={remarkPlugins}
        rehypePlugins={rehypePlugins}
        components={components}
      />
    </div>
  );
});

MarkDownCmp.displayName = 'MarkDownCmp';

export default MarkDownCmp;
