import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import _ from "lodash";

interface ISearchCommand {
  items?: IAgentCategoryRole[];
  onChange?: (value: string) => void;
}

const SearchCommand = (props: ISearchCommand) => {
  const { items, onChange } = props;

  const handleSearch = _.debounce((e) => {
    const value = e.target?.value?.trim() || "";
    onChange?.(value);
  }, 300);

  return (
    <Input
      placeholder="搜索指令"
      allowClear
      prefix={<SearchOutlined />}
      onChange={handleSearch}
    />
  );
};

export default SearchCommand;
