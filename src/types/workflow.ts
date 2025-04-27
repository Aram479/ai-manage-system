type BaseNodeData = {};
type TNodeProps<NodeData extends Record<string, unknown> = any> =
  import("@xyflow/react").NodeProps<import("@xyflow/react").Node<NodeData>>;
interface BaseNodeProps extends TNodeProps<BaseNodeData> {
  title: string;
  desc: string;
  maxLineCount: number; // 最大连接线数量
  isAddOper?: boolean; // 是否使用增加功能
  execute?: BaseNodeProps['list'][number]
  formData?: any
  list: ({
    id?: string | number;
    label?: string;
    value?: string | number;
    isStart?: boolean
    handles?: import("@xyflow/react").HandleProps[]; // 连接线
  } & import("react").DOMAttributes<any>)[];
}
