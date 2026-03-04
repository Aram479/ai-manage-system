import { Fragment } from "react";
import "./MenuBar.less";

import AlginCenter from "../Components/Algin/AlginCenter";
import AlginJustify from "../Components/Algin/AlginJustify";
import AlginLeft from "../Components/Algin/AlginLeft";
import AlginRight from "../Components/Algin/AlginRight";
import Bold from "../Components/Bold";
import ClearFormat from "../Components/ClearFormat";
import DropdownChild from "../Components/DropdownChild";
import Enter from "../Components/Enter";
import Heading1 from "../Components/Heading/Heading1";
import Heading2 from "../Components/Heading/Heading2";
import Image from "../Components/Image";
import Italic from "../Components/Italic";
import Links from "../Components/Links";
import ListBullet from "../Components/ListBullet";
import ListOrdered from "../Components/ListOrdered";
import Paragraph from "../Components/Paragraph";
import Preview from "../Components/Preview";
import Redo from "../Components/Redo";
import Strike from "../Components/Strike";
import Table from "../Components/Table";
import TextColor from "../Components/TextColor";
import Undo from "../Components/Undo";
import Video from "../Components/Video";
import Agent from "../Components/Agent";
import Emojis from "../Components/Emojis";

interface ICustomBar {
  icon?: string;
  editor?: any;
  title?: string;
  list?: ICustomBar[];
  component?: any;
  isActive?: () => boolean;
}
const CustomBar = (props: ICustomBar) => {
  const { component: Child, icon, editor, title, list, isActive } = props;
  return (
    <>
      {!list?.length ? (
        <Child
          icon={icon}
          editor={editor}
          title={title}
          list={list}
          isActive={isActive}
        ></Child>
      ) : (
        <DropdownChild list={list} editor={editor} />
      )}
    </>
  );
};

interface IMenuBar {
  editor: any;
}
export default (props: IMenuBar) => {
  const { editor } = props;
  const items = [
    {
      icon: "openai-line",
      title: "AI",
      component: Agent,
    },
    {
      icon: "emotion-line",
      title: "表情",
      component: Emojis,
    },
    // {
    //   icon: "italic",
    //   title: "斜体",
    //   component: Italic,
    //   isActive: () => editor.isActive("italic"),
    // },
    // {
    //   icon: "font-color",
    //   title: "文字颜色",
    //   component: TextColor,
    // },
    // {
    //   icon: "strikethrough",
    //   title: "删除线",
    //   component: Strike,
    //   isActive: () => editor.isActive("strike"),
    // },
    // {
    //   icon: "links-line",
    //   title: "链接",
    //   component: Links,
    //   isActive: () => editor.isActive("link"),
    // },
    // {
    //   type: "divider",
    // },
    // {
    //   list: [
    //     {
    //       icon: "h-1",
    //       title: "标题1",
    //       component: Heading1,
    //       isActive: () => editor.isActive("heading", { level: 1 }),
    //     },
    //     {
    //       icon: "h-2",
    //       title: "标题2",
    //       component: Heading2,
    //       isActive: () => editor.isActive("heading", { level: 2 }),
    //     },
    //   ],
    // },
    // {
    //   icon: "paragraph",
    //   title: "段落",
    //   component: Paragraph,
    // },
    // {
    //   icon: "list-unordered",
    //   title: "无序列表",
    //   component: ListBullet,
    //   isActive: () => editor.isActive("bulletList"),
    // },
    // {
    //   icon: "list-ordered",
    //   title: "有序列表",
    //   component: ListOrdered,
    //   isActive: () => editor.isActive("orderedList"),
    // },
    // // {
    // //   type: 'divider',
    // // },
    // // {
    // //   icon: 'separator',
    // //   title: '分割线',
    // //   action: () => editor.chain().focus().setHorizontalRule().run(),
    // // },
    // {
    //   type: "divider",
    // },
    // {
    //   icon: "align-left",
    //   title: "靠左对齐",
    //   component: AlginLeft,
    // },
    // {
    //   icon: "align-center",
    //   title: "居中对齐",
    //   component: AlginCenter,
    //   isActive: () => editor.isActive({ textAlign: "center" }),
    // },
    // {
    //   icon: "align-right",
    //   title: "靠右对齐",
    //   component: AlginRight,
    //   isActive: () => editor.isActive({ textAlign: "right" }),
    // },
    // {
    //   icon: "align-justify",
    //   title: "两端对齐",
    //   component: AlginJustify,
    //   isActive: () => editor.isActive({ textAlign: "justify" }),
    // },
    // {
    //   type: "divider",
    // },
    // {
    //   icon: "format-clear",
    //   title: "清除格式",
    //   component: ClearFormat,
    // },
    // {
    //   icon: "text-wrap",
    //   title: "末尾插入行",
    //   component: Enter,
    // },
    // {
    //   type: "divider",
    // },
    // {
    //   icon: "image-line",
    //   title: "图片",
    //   component: Image,
    //   isActive: () => editor.isActive("image"),
    // },
    // {
    //   icon: "video-upload-line",
    //   title: "Youtube视频",
    //   component: Video,
    //   isActive: () => editor.isActive("video"),
    // },
    // {
    //   icon: "table-line",
    //   title: "表格",
    //   component: Table,
    //   isActive: () => editor.isActive("blockquote"),
    // },
    // {
    //   type: "divider",
    // },
    // {
    //   icon: "arrow-go-back-line",
    //   title: "撤回",
    //   component: Undo,
    // },
    // {
    //   icon: "arrow-go-forward-line",
    //   title: "恢复",
    //   component: Redo,
    // },
    // {
    //   type: "divider",
    // },
    // {
    //   icon: "eye-line",
    //   title: "预览",
    //   component: Preview,
    // },
  ];

  return (
    <div className="editor__header">
      {items.map((item, index) => (
        <Fragment key={index}>
          {item.type === "divider" ? (
            <div className="divider" />
          ) : (
            <CustomBar {...item} editor={editor} />
          )}
        </Fragment>
      ))}
    </div>
  );
};
