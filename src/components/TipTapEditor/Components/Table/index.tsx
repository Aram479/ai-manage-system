import { Dropdown, MenuProps } from "antd";
import { useState } from "react";
import BarItem from "../BarItem";
import "./index.less";
import TableAttrModal from "./TableAttrModal";
import TableCreateModal from "./TableCreateModal";

interface ITable {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const Table = (props: ITable) => {
  const { icon, editor, title, isActive } = props;
  const [isTableCreate, setIsTableCreate] = useState(false);
  // tableAttr
  const [isTableAttrModal, setIsTableAttrModal] = useState(false);

  const handleTable = () => {
    setIsTableCreate(true);
    // editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  };
  const handleTableCreate = (data: any) => {
    const { rows, cols } = data;
    editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run();
    setIsTableCreate(false);
  };
  const handleTableCreateCancel = () => {
    setIsTableCreate(false);
  };

  // table菜单项
  const items: MenuProps["items"] = [
    {
      key: "create",
      label: "创建表格",
      disabled: editor?.isActive("table"),
      onClick: handleTable,
    },
    {
      key: "cell",
      label: "单元格",
      children: [
        {
          key: "cellAttribute",
          label: "单元格属性",
          disabled: !editor?.isActive("table"),
          onClick: () => {
            setIsTableAttrModal(true);
          },
        },
        {
          key: "mergeCell",
          label: "合并单元格",
          disabled: !editor?.isActive("tableCell") && !editor?.isActive("tableHeader"),
          onClick: () => editor?.chain().focus().mergeCells().run(),
        },
        {
          key: "splitCell",
          label: "拆分单元格",
          disabled: !editor?.isActive("tableCell") && !editor?.isActive("tableHeader"),
          onClick: () => editor?.chain().focus().splitCell().run(),
        },
      ],
    },
    {
      key: "rows",
      label: "行",
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
          disabled: !editor?.isActive("tableCell") && !editor?.isActive("tableHeader"),
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
      children: [
        {
          key: "addColumnBefore",
          label: "左侧插入",
          disabled: !editor?.isActive("tableCell") && !editor?.isActive("tableHeader"),
          onClick: () => editor?.chain().focus().addColumnBefore().run(),
        },
        {
          key: "addColumnAfter",
          label: "右侧插入",
          disabled: !editor?.isActive("tableCell") && !editor?.isActive("tableHeader"),
          onClick: () => editor?.chain().focus().addColumnAfter().run(),
        },
        {
          key: "deleteColumn",
          label: "删除列",
          disabled: !editor?.isActive("tableCell") && !editor?.isActive("tableHeader"),
          onClick: () => editor?.chain().focus().deleteColumn().run(),
        },
      ],
    },
    {
      key: "deleteTable",
      label: "删除表格",
      disabled: !editor?.isActive("table"),
      onClick: () => editor?.chain().focus().deleteTable().run(),
    },
    {
      key: "setHeader",
      label: "设置/取消表头",
      disabled: !editor?.isActive("table"),
      onClick: () => editor?.chain().focus().toggleHeaderRow().run(),
    },
  ];

  return (
    <div className="editorTable">
      <Dropdown menu={{ items }} trigger={["click"]}>
        <div>
          <BarItem title={title} icon={icon} isActive={isActive} />
        </div>
      </Dropdown>
      <TableCreateModal open={isTableCreate} onOk={handleTableCreate} onCancel={handleTableCreateCancel} />
      <TableAttrModal
        open={isTableAttrModal}
        editor={editor}
        onOk={() => setIsTableAttrModal(false)}
        onCancel={() => setIsTableAttrModal(false)}
      />
    </div>
  );
};

export default Table;
