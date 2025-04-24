import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";
import BaseNodeCmp from "./cpns/BaseNodeCmp";

const WorkFlowPage = () => {
  const rfStyle = {
    backgroundColor: "#B8CEFF",
  };
  const initialNodes = [
    {
      id: "node-1",
      type: "textUpdater",
      position: { x: 0, y: 0 },
      data: { value: 123 },
    },
    {
      id: "node-2",
      type: "textUpdater",
      position: { x: 0, y: 200 },
      data: { value: 123 },
    },
  ];
  const initialEdges = [
    {
      id: "1-2",
      source: "node-1",
      target: "node-2",
      label: "to the",
      type: "step",
    },
  ];

  const nodeTypes = { textUpdater: BaseNodeCmp };

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const onNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );
  return (
    <div style={{ height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        style={rfStyle}
      >
        {/* 背景图 */}
        <Background />
        {/* 左下角控制器 */}
        <Controls />
      </ReactFlow>
    </div>
  );
};

export default WorkFlowPage;
