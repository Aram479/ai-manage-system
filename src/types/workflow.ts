type BaseNodeData = {};
type TNodeProps<NodeData extends Record<string, unknown> = any> =
  import("@xyflow/react").NodeProps<import("@xyflow/react").Node<NodeData>>;
interface BaseNodeProps extends TNodeProps<BaseNodeData> {
  title: string;
  desc: string;
  maxLineCount: number; // 最大连接线数量
  list: {
    label?: string;
    value?: string;
  }[];
}
