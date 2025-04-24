import {
  ReactFlow,
  Controls,
  Background,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  ReactFlowProps,
  OnNodesDelete,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useState } from "react";
import BaseNodeCmp from "./cpns/BaseNodeCmp";
import StartNode from "./cpns/StartNode";
import ClassNode from "./cpns/ClassNode";
import EndNode from "./cpns/EndNode";
import "./index.less";

const WorkFlowPage = () => {
  // 节点内容
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([
    {
      id: "1",
      type: "StartNode",
      position: { x: 0, y: 0 },
      dragHandle: ".labelBox",
      data: {},
    },
    {
      id: "2",
      type: "ClassNode",
      position: { x: 500, y: 0 },
      dragHandle: ".labelBox",
      data: {},
    },
    {
      id: "3",
      type: "EndNode",
      position: { x: 1000, y: 0 },
      dragHandle: ".labelBox",
      data: {},
    },
  ]);
  // 连接线
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([
    {
      id: "1->2",
      source: "1",
      target: "2",
      // label: "", // 连接线名称
      // type: "step", // 连接线类型
    },
    {
      id: "2->3",
      source: "2",
      target: "3",
    },
  ]);

  const nodeTypes = { StartNode, ClassNode, EndNode };

  // 删除中间连接线自动添加连接线
  const onNodesDelete = useCallback<OnNodesDelete>(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge) => !connectedEdges.includes(edge)
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges]
  );

  const onConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );
  return (
    <div className="workflowPage" style={{ height: "100%" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
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
