import { useState } from "react";
import { Button, Tooltip } from "antd";
import AgentCategoryModal from "../AgentCategoryModal";
import _ from "lodash";

interface ICategoryOper {
  onOk?: (data: IAgentCategoryRole) => void;
}

const CategoryOper = (props: ICategoryOper) => {
  const { onOk } = props;
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
        title={<div style={{ fontSize: 12 }}>AI分类</div>}
        placement="top"
      >
        <Button
          variant="outlined"
          icon={<>AI</>}
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
