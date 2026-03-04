import { Prompts } from "@ant-design/x";

import type { PromptsProps } from "@ant-design/x";
interface IPromptsCmpProps extends PromptsProps {}

const PromptsCmp = (props: IPromptsCmpProps) => {
  const { items } = props;

  return <Prompts items={items} title="我可以帮您:" vertical />;
};

export default PromptsCmp;
