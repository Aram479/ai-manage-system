import {
  CSSProperties,
  forwardRef,
  LegacyRef,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { ClearOutlined, SettingOutlined } from "@ant-design/icons";
import { Checkbox, CheckboxProps, Dropdown, Table } from "antd";
import type { ColumnsType, TableProps, TableRef } from "antd/es/table";
import _ from "lodash";
import styles from "./index.less";

interface IPageTable extends TableProps {
  isCustomTable: boolean; // 是否采用antd表格
  ref: LegacyRef<any> | undefined;
  resizableKey: string;
  rowKey: string; // 行key，用于多选
  columns: ColumnsType; // 列标题
  dataSource: any[]; // 列数据
  pagination: TableProps["pagination"]; // 分页数据
  loading: boolean; // 是否显示加载中...
  operateChildren: ReactNode | ((data: any) => ReactNode); // 扩展表头操作按钮
  selectedRowKeys: any[]; // 选中的行数据的keys
  customRowSelection: TableProps["rowSelection"]; // 自定义多选
  isShowSelect: boolean; // 是否显示多选
  isDrag: boolean; // 是否拖拽排序
  isDragWidth: boolean; // 是否拖拽列宽
  isColumnsControl: boolean; // 是否开启自定义显示/隐藏列
  allClearFilter: boolean; // 是否一键清空列筛选
  bordered: boolean;
  size: TableProps["size"];
  height: number; // 表格body高度
  title: TableProps["title"];
  tableStyle: CSSProperties; // table样式
  onChange: TableProps["onChange"]; // 分页、排序、筛选事件
  onClearFilter: (data: any) => void; // 清空所有筛选条件事件
  onSelectChange: (data: any) => void; // 多选事件
  onDragSortChange: (data: any) => void; // 拖拽排序事件
}

const PageTable = forwardRef<Partial<TableRef>, Partial<IPageTable>>(
  (props, ref) => {
    const {
      rowKey = "id", // 行key，用于多选
      isCustomTable,
      resizableKey = "basicTable", // 重置key，用于缓存列宽缓存
      columns = [],
      dataSource, // 列数据
      pagination, // 分页数据
      loading, // 是否显示加载中...
      operateChildren, // 按钮插槽
      selectedRowKeys, // 选中的行数据的keys
      customRowSelection, // 自定义多选
      isShowSelect, // 是否显示多选
      isDrag = false, // 是否拖拽排序
      isDragWidth = false, // 是否拖拽列宽
      isColumnsControl = false,
      allClearFilter = false,
      bordered = false,
      size = "large",
      title,
      tableStyle, // table样式
      onChange, // 分页、排序、筛选事件
      onClearFilter,
      onSelectChange, // 多选事件
      onDragSortChange, // 拖拽排序事件
      ...customProps
    } = props;

    const [controlCols, setControlCols] = useState<string[]>([]);
    const tableRef = useRef<TableRef>(null);

    const tableColumns = useMemo(() => {
      // 列展示/隐藏 不包含 isColControl 为false的列
      const newColumns = columns?.map((item: any) => {
        if (item.fixed) {
          // 处理浮动列头列宽拖拽时样式透传问题
          const colOnHeaderCell = item.onHeaderCell?.();
          item.onHeaderCell = () => {
            return {
              ...colOnHeaderCell,
              style: {
                ...colOnHeaderCell?.style,
                position: "relative",
                zIndex: 10,
              },
            };
          };
        }
        if (isColumnsControl) {
          item.hidden =
            item.isColControl !== false &&
            !controlCols.includes(item.dataIndex as string);
        }
        return {
          ...item,
        };
      });
      return newColumns;
    }, [columns, controlCols]);

    // 下拉菜单项
    const columnsDropMenu = useMemo<any[]>(() => {
      if (tableColumns?.length) {
        const list = tableColumns
          .filter((item: any) => item.isColControl !== false)
          .map((item: any, index, array) => ({
            value: item.dataIndex,
            label: _.isFunction(item.title) ? item.title() : item.title,
            key: item.dataIndex,
          }));
        return list;
      }
      return [];
    }, []);

    // 控制半选/全选/不选
    const indeterminate =
      controlCols.length > 0 && controlCols.length < columnsDropMenu.length;
    const checkAll = controlCols.length === columnsDropMenu.length;

    const rowSelection: TableProps["rowSelection"] = {
      // 因分页切换时仍要选中之前的内容，所以此方法暂时不用, 如不需要选中之前的内容请放开此注释并注释"onSelect"和"onSelectAll"
      // onChange: (selectedRowKeys) => {
      //   onSelectChange(selectedRowKeys);
      // },
      onSelect: (record, selected) => {
        const mySet = new Set(selectedRowKeys?.concat(record[rowKey]));
        // 如果取消选中则取消选择
        if (!selected) {
          mySet.delete(record[rowKey]);
        }
        onSelectChange?.(Array.from(mySet));
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        const newSelectedRowKeys = changeRows
          .filter((item) => item && item[rowKey])
          .map((item) => item[rowKey]);
        const mySet = new Set(selectedRowKeys?.concat(newSelectedRowKeys));
        if (!selected) {
          newSelectedRowKeys.forEach((keyItem) => {
            mySet.delete(keyItem);
          });
        }
        onSelectChange?.(Array.from(mySet));
      },
      // 是否禁选
      // getCheckboxProps: (record) => ({
      //   disabled: record.status !== 1,
      // }),
      selectedRowKeys,
      ...customRowSelection,
    };

    const onColCheckAllChange: CheckboxProps["onChange"] = (e) => {
      const controlCols = columnsDropMenu?.map((item: any) => item.value);
      setControlCols(e.target.checked ? controlCols : []);
    };

    useEffect(() => {
      // 可控列有数据 则不重新刷新可控列
      if (!controlCols.length) {
        const controlCols = tableColumns
          ?.filter((item: any) => item.isColControl !== false)
          .map((item: any) => item.dataIndex);
        setControlCols(controlCols ?? []);
      }
    }, []);

    // 暴露给父组件的属性
    useImperativeHandle(ref, () => ({
      scrollTo: tableRef.current?.scrollTo,
    }));

    return (
      <div className={styles.pageTableCmp}>
        {/* 按钮插槽 */}
        {/* {children ? <div className={styles.btnBox}>{children}</div> : ''} */}
        <div className={styles.operContextBox}>
          {/* 自定义按钮 */}
          {_.isFunction(operateChildren)
            ? operateChildren?.(dataSource)
            : operateChildren}
          {/* 清空所有筛选条件功能 */}
          {allClearFilter && (
            <ClearOutlined
              onClick={() => {
                onClearFilter?.({});
              }}
            />
          )}
          {/* 列显示/隐藏功能 */}
          {isColumnsControl && (
            <Dropdown
              placement="bottomRight"
              menu={{ items: columnsDropMenu }}
              trigger={["click"]}
              autoAdjustOverflow={false}
              dropdownRender={() => (
                <div className={styles.columnDropDownBox}>
                  <div className={styles.columnDropDownItem}>
                    <div style={{ borderBottom: "1px solid #dcdfe6" }}>
                      <Checkbox
                        indeterminate={indeterminate}
                        checked={checkAll}
                        onChange={onColCheckAllChange}
                      >
                        全部
                      </Checkbox>
                    </div>
                    <Checkbox.Group
                      value={controlCols}
                      options={columnsDropMenu}
                      onChange={(value) => {
                        setControlCols(value);
                      }}
                      style={{ display: "flex", flexDirection: "column" }}
                    />
                  </div>
                </div>
              )}
            >
              <div className={styles.dropDownSlot}>
                <SettingOutlined />
              </div>
            </Dropdown>
          )}
        </div>

        <Table
          ref={tableRef}
          rowKey={rowKey}
          dataSource={dataSource}
          columns={columns}
          pagination={pagination}
          loading={loading}
          rowSelection={isShowSelect ? rowSelection : undefined}
          bordered={bordered}
          size={size}
          title={title}
          style={
            {
              "--height": `${props.height}px`,
            } as any
          }
          onChange={(...changeData) => onChange?.(...changeData)}
          {...customProps}
        />
      </div>
    );
  }
);
export default PageTable;
