type BaseNodeData = {};
type TNodeProps<NodeData extends Record<string, unknown> = any> =
  import("@xyflow/react").NodeProps<import("@xyflow/react").Node<NodeData>>;
interface BaseNodeProps extends TNodeProps<BaseNodeData> {
  title: string;
  desc: string;
  maxLineCount: number; // 最大连接线数量
  list: {
    id?: string;
    label?: string;
    value?: string;
    handles?: import("@xyflow/react").HandleProps[]; // 连接线
  }[];
}
