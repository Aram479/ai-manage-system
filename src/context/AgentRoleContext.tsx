// src/context/UserContext.tsx
import { AllAgentCategory } from "@/constant/agentCategory";
import { createContext, ReactNode, useContext, useState } from "react";

interface IContentData {
  selectRole?: IAgentCategoryRole;
  confirmRole?: IAgentCategoryRole
  updateSelectRole?: (data?: IAgentCategoryRole) => void;
  updateConfirmRole?: (data?: IAgentCategoryRole) => void;
}
interface IProviderProps {
  children?: JSX.Element;
}
type TAgentRoleProvider = (props: IProviderProps) => JSX.Element;

const AgentRoleContext = createContext<IContentData>({});
export const AgentRoleProvider: TAgentRoleProvider = ({ children }) => {
  const [selectRole, setSelectRole] = useState<IAgentCategoryRole | undefined>(
    AllAgentCategory[0]
  );
  const [confirmRole, setConfirmRole] = useState<
    IAgentCategoryRole | undefined
  >(AllAgentCategory[0]);
  const updateSelectRole = (roleRecord?: IAgentCategoryRole) => {
    setSelectRole(roleRecord);
  };
  const updateConfirmRole = (roleRecord?: IAgentCategoryRole) => {
    setConfirmRole(roleRecord);
  };
  return (
    <AgentRoleContext.Provider
      value={{ selectRole, confirmRole, updateSelectRole, updateConfirmRole }}
    >
      {children}
    </AgentRoleContext.Provider>
  );
};

export const useAgentRoleContext = () => {
  const context = useContext(AgentRoleContext);
  if (!context)
    throw new Error("useAgentRoleContext must be used within AgentRoleContext");
  return context;
};
