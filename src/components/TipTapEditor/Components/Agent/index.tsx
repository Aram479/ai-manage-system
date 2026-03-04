import { useState } from "react";
import AgentCategoryModal from "@/components/AgentCategory/AgentCategoryModal";
import _ from 'lodash'

interface IAgent {
  icon?: string;
  editor?: any;
  title?: string;
  isActive?: () => boolean;
}

const Agent = (props: IAgent) => {
  const { icon, editor, title, isActive } = props;
  const [agentCategoryOpen, setAgentCategoryOpen] = useState(false);
  const [selectAgents, setSelectAgents] = useState<IAgentCategoryRole[]>([]);

  const handleAgentCategory = () => {
    setAgentCategoryOpen(true);
  };

  const handleSelectAgent = (agentRecord: (typeof selectAgents)[number]) => {
    const newSelectAgents = _.uniqBy(selectAgents.concat(agentRecord), "title");
    setSelectAgents(newSelectAgents);
    setAgentCategoryOpen(false);
  };
  return (
    <>
      <button
        className={`menu-item ${isActive?.() ? "is-active" : ""}`}
        title={title}
        onClick={handleAgentCategory}
      >
        AI
      </button>
      <AgentCategoryModal
        open={agentCategoryOpen}
        onOk={handleSelectAgent}
        onCancel={setAgentCategoryOpen}
      />
    </>
  );
};

export default Agent;
