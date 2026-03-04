import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import _ from "lodash";

interface ISearchRole {
  items?: IAgentCategoryRole[];
  onChange?: (value: string) => void;
}

const SearchRole = (props: ISearchRole) => {
  const { items, onChange } = props;

  const handleSearch = _.debounce((e) => {
    const value = e.target?.value?.trim() || "";
    onChange?.(value);
  }, 300);

  return (
    <Input
      placeholder="搜索智能体"
      allowClear
      prefix={<SearchOutlined />}
      onChange={handleSearch}
    />
  );
};

export default SearchRole;
