import { useState } from "react";
import { Button, ButtonProps, Tooltip } from "antd";
import AgentCategoryModal from "../AgentCategory/AgentCategoryModal";
import _ from "lodash";

interface ICategoryOper {
  buttonProps?: ButtonProps;
  onOk?: (data: IAgentCategoryRole) => void;
}

const CategoryOper = (props: ICategoryOper) => {
  const { buttonProps, onOk } = props;
  const [agentCategoryOpen, setAgentCategoryOpen] = useState(false);
  const [selectAgents, setSelectAgents] = useState<IAgentCategoryRole[]>([]);
  const handleAgentCategory = () => {
    setAgentCategoryOpen(true);
  };

  const handleSelectAgent = (agentRecord: (typeof selectAgents)[number]) => {
    const newSelectAgents = _.uniqBy(selectAgents.concat(agentRecord), "title");
    setSelectAgents(newSelectAgents);
    setAgentCategoryOpen(false);
    onOk?.(agentRecord);
  };

  return (
    <div>
      <Tooltip
        title={<div style={{ fontSize: 12 }}>Agent分类</div>}
        placement="top"
      >
        <Button
          {...buttonProps}
          variant={buttonProps?.variant || "outlined"}
          icon={buttonProps?.icon || "AI"}
          onClick={handleAgentCategory}
        />
      </Tooltip>
      <AgentCategoryModal
        open={agentCategoryOpen}
        onOk={handleSelectAgent}
        onCancel={setAgentCategoryOpen}
      />
    </div>
  );
};

export default CategoryOper;
