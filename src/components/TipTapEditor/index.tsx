import { EditorContent, useEditor } from "@tiptap/react";
// import { variables } from '../../../variables.js'
import { Editor, JSONContent } from "@tiptap/core";
import { Dropdown, MenuProps } from "antd";
import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import TableAttrModal from "./Components/Table/TableAttrModal";
import getExtensions from "./extensions";
import MenuBar from "./MenuBar/MenuBar";
import "./styles.less";

interface ITipTapEditor {
  value?: string;
  maxLength?: number;
  payload?: any;
  showMaxLength?: boolean;
  onChange?: (data: {
    text: string;
    html: string;
    json: JSONContent;
    length: number;
  }) => void;
}

const TipTapEditor = (props: ITipTapEditor, ref: Ref<IEditorRef>) => {
  const { value = "", payload, showMaxLength, maxLength, onChange } = props;
  const [isTableAttrModal, setIsTableAttrModal] = useState(false);
  const [isDropdown, setIsDropdown] = useState(false);
  const editor = useEditor(
    {
      editorProps: payload,
      extensions: [...getExtensions(maxLength)],
      content: value, // 默认值
      onUpdate: (data) => {
        // 编辑器内容改变时调用
        handleEditorChange(data);
      },
      onCreate: (data) => {
        // 初始化时调用
        handleEditorChange(data);
      },
    },
    []
  );
  const items: MenuProps["items"] = [
    {
      key: "create",
      label: "单元格",
      onClick: () => setIsDropdown(false),
      children: [
        {
          key: "cellAttribute",
          label: "单元格属性",
          disabled: !editor?.isActive("table"),
          onClick: () => {
            setIsTableAttrModal(true);
            setIsDropdown(false);
          },
        },
        {
          key: "mergeCell",
          label: "合并单元格",
          disabled:
            !editor?.isActive("tableCell") && !editor?.isActive("tableHeader"),
          onClick: () => editor?.chain().focus().mergeCells().run(),
        },
        {
          key: "splitCell",
          label: "拆分单元格",
          disabled:
            !editor?.isActive("tableCell") && !editor?.isActive("tableHeader"),
          onClick: () => editor?.chain().focus().splitCell().run(),
        },
      ],
    },
    {
      key: "rows",
      label: "行",
      onClick: () => setIsDropdown(false),
      children: [
        {
          key: "addRowBefore",
          label: "上方插入",
          disabled: !editor?.isActive("tableCell"),
          onClick: () => editor?.chain().focus().addRowBefore().run(),
        },
        {
          key: "addRowAfter",
          label: "下方插入",
          disabled:
            !editor?.isActive("tableCell") && !editor?.isActive("tableHeader"),
          onClick: () => editor?.chain().focus().addRowAfter().run(),
        },
        {
          key: "deleteRow",
          label: "删除行",
          disabled: !editor?.isActive("tableCell"),
          onClick: () => editor?.chain().focus().deleteRow().run(),
        },
      ],
    },
    {
      key: "cols",
      label: "列",
      onClick: () => setIsDropdown(false),
      children: [
        {
          key: "addColumnBefore",
          label: "左侧插入",
          disabled:
            !editor?.isActive("tableCell") && !editor?.isActive("tableHeader"),
          onClick: () => editor?.chain().focus().addColumnBefore().run(),
        },
        {
          key: "addColumnAfter",
          label: "右侧插入",
          disabled:
            !editor?.isActive("tableCell") && !editor?.isActive("tableHeader"),
          onClick: () => editor?.chain().focus().addColumnAfter().run(),
        },
        {
          key: "deleteColumn",
          label: "删除列",
          disabled:
            !editor?.isActive("tableCell") && !editor?.isActive("tableHeader"),
          onClick: () => editor?.chain().focus().deleteColumn().run(),
        },
      ],
    },
    {
      key: "deleteTable",
      label: "删除表格",
      disabled: !editor?.isActive("table"),
      onClick: () => {
        editor?.chain().focus().deleteTable().run();
        setIsDropdown(false);
      },
    },
    {
      key: "setHeader",
      label: "设置/取消表头",
      disabled: !editor?.isActive("table"),
      onClick: () => editor?.chain().focus().toggleHeaderRow().run(),
    },
  ];
  const handleEditorChange = (data: any) => {
    const editorData: Editor = data.editor;
    // tiptap 默认值 为:<p></p> 和 <p><br></p>
    let editorHtml =
      editorData.getHTML() === "<p></p>" ||
      editorData.getHTML() === "<p><br></p>"
        ? ""
        : editorData.view.dom.innerHTML;
    // 傻逼tiptap <br>会在浏览器渲染两次, 给它干掉！
    editorHtml = editorHtml
      .replace(new RegExp('<br class="ProseMirror-trailingBreak">', "g"), " ")
      .replace(/<p\b[^>]*>(?:\s*<br\s*\/?>\s*)*\s*<\/p>/gi, "")
      .replace(new RegExp('<img class="ProseMirror-separator" alt="">', "g"), "");
    onChange?.({
      text: editorData.getText(),
      html: editorHtml,
      json: editorData.getJSON(),
      length: editorData.getText().length,
    });
  };
  const handleDropdown = (bol: boolean) => {
    setIsDropdown(bol);
  };

  useImperativeHandle(ref, () => ({
    editor,
  }));

  return (
    <div style={{ width: "100%" }}>
      <div className="editor">
        {editor && <MenuBar editor={editor} />}
        <Dropdown
          open={editor?.isActive("table") && isDropdown}
          menu={{ items }}
          trigger={["contextMenu"]}
          onOpenChange={handleDropdown}
          destroyPopupOnHide
          // destroyOnHidden
        >
          <EditorContent className="editor__content" editor={editor} />
        </Dropdown>
        <TableAttrModal
          open={isTableAttrModal}
          editor={editor}
          onOk={() => setIsTableAttrModal(false)}
          onCancel={() => setIsTableAttrModal(false)}
        />
      </div>
      <span className="editorLimit">
        {showMaxLength &&
          maxLength &&
          `${editor?.storage.characterCount.characters()} / ${maxLength}`}
      </span>
    </div>
  );
};
export default forwardRef(TipTapEditor);
