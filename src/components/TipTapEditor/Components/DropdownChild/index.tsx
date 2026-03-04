import { DownOutlined } from "@ant-design/icons";
import { Dropdown } from "antd";
import { useEffect, useMemo, useState } from "react";
import BarItem from "../BarItem";
interface IDropdownChild {
  editor?: any;
  list: {
    icon?: string;
    title?: string;
    component?: any;
    isActive?: () => boolean;
  }[];
}
const DropdownChild = (props: Partial<IDropdownChild>) => {
  const { list, editor } = props;
  const [childList, setChildList] = useState([]);
  const [currentItem, setCurrentItem] = useState<any>({});

  const isAllActive = useMemo(() => !!childList.filter((item) => item?.isActive?.()).length, [childList]);

  useEffect(() => {
    const newList = list.map((item) => ({
      ...item,
      key: item.icon,
      style: {
        padding: 0,
      },
    }));
    setChildList(newList);
  }, [list]);

  useEffect(() => {
    if (!isAllActive) {
      setCurrentItem({});
    }
  }, [isAllActive]);

  return (
    <div>
      <Dropdown
        trigger={["click"]}
        menu={{
          selectable: true,
          style: {
            padding: 0,
          },
          selectedKeys: [currentItem.key],
          items: childList.map((item) => ({
            key: item.key,
            label: (
              <div
                key={item.key}
                className="dropdownChild"
                onClick={() => {
                  setCurrentItem(item);
                }}
              >
                {/* {currentItem.key === item.key ? currentItem?.label : item.component?.({ ...item, editor })} */}
                {item.component?.({ ...item, editor })}
              </div>
            ),
          })),
        }}
      >
        <div className="aaaHover" style={{ color: "#fff", padding: "0 3px", fontSize: 16 }}>
          <>
            {isAllActive ? (
              <BarItem title={currentItem.title} icon={currentItem.icon} isActive={currentItem.isActive} />
            ) : (
              <BarItem title={childList[0]?.title} icon={childList[0]?.icon} isActive={childList?.[0]?.isActive} />
            )}
          </>
          <DownOutlined style={{ margin: 0 }} />
        </div>
      </Dropdown>
    </div>
  );
};

export default DropdownChild;
