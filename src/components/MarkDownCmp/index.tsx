import React, { useState } from "react";
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

const ThemeMap = new Map<TThemeType, SyntaxHighlighterProps["style"]>([
  ["default", prism],
  ["onDark", oneDark],
  ["darcula", darcula],
  ["vs", vs],
]);

interface Props {
  content: string;
  theme?: TThemeType;
  copyCode?: boolean;
  loading?: boolean;
}

const inlineCodeStyle = {
  background: "rgba(243, 244, 244)",
  padding: "2px 5px",
  fontSize: "15px",
  color: "rgba(51, 51, 51)",
};

const MarkDownCmp: React.FC<Props> = ({
  content,
  theme,
  copyCode = true,
  loading,
}) => {
  let index = 0;
  return (
    <div className="markDownCmp">
      <ReactMarkdown
        children={content}
        remarkPlugins={[remarkGfm, remarkMath, remarkGemoji]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={{
          code({ children, className, inline }) {
            // 匹配否指定语言
            const match: any = /language-(\w+)/.exec(className || "");
            const [isShowCode, setIsShowCode] = useState(true);
            const [isShowCopy, setIsShowCopy] = useState(true);
            return (
              <>
                {!inline && match && match[1] ? (
                  <>
                    {/* 代码头部 */}
                    {!loading && (
                      <div className="code-header">
                        {/* 展开/折叠 */}
                        {/* <div
                          style={{
                            cursor: 'pointer',
                            marginRight: '10px',
                            transformOrigin: '8px',
                          }}
                          className={isShowCode ? 'code-rotate-down' : 'code-rotate-right'}
                          onClick={() => setIsShowCode(!isShowCode)}
                        >
                          <DownOutlined />
                        </div> */}
                        <div className="lang-box">{match && match[1]}</div>
                        {copyCode && (
                          <div className="preview-code-box">
                            {!isShowCopy ? (
                              <CopyOutlined
                                className="preview-code-copy"
                                onClick={_.throttle(() => {
                                  setIsShowCopy(true);
                                  copy(String(children));
                                  message.success("复制成功");
                                  setTimeout(() => {
                                    setIsShowCopy(false);
                                  }, 3000);
                                }, 3000)}
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

                    {isShowCode && (
                      <SyntaxHighlighter
                        showLineNumbers={true}
                        wrapLines
                        wrapLongLines
                        style={ThemeMap.get(theme ?? "default")}
                        language={match && match[1]}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    )}
                  </>
                ) : (
                  <code className={className} style={inlineCodeStyle}>
                    {children}
                  </code>
                )}
              </>
            );
          },
          h1({ children }) {
            return (
              <h1 id={"heading-" + ++index} className="heading">
                {children}
              </h1>
            );
          },
          h2({ children }) {
            return (
              <h2 id={"heading-" + ++index} className="heading">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 id={"heading-" + ++index} className="heading">
                {children}
              </h3>
            );
          },
          h4({ children }) {
            return (
              <h4 id={"heading-" + ++index} className="heading">
                {children}
              </h4>
            );
          },
          h5({ children }) {
            return (
              <h5 id={"heading-" + ++index} className="heading">
                {children}
              </h5>
            );
          },
          h6({ children }) {
            return (
              <h6 id={"heading-" + ++index} className="heading">
                {children}
              </h6>
            );
          },
          img({ className, style, src }) {
            return (
              <Image
                id={"img-" + ++index}
                className={className}
                src={src}
                preview={{
                  mask: <div style={{ opacity: 0 }}>1</div>,
                  maskClassName: "imageMask",
                }}
                style={style}
              />
            );
          },
        }}
      />
    </div>
  );
};

export default MarkDownCmp;
