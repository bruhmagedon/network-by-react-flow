// useGraphs.ts
import { useDispatch, useSelector } from 'react-redux';
import {
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  applyNodeChanges,
  NodeChange,
  EdgeChange,
  applyEdgeChanges
} from '@xyflow/react';
import {
  addNode as addNodeAction,
  deleteNode as deleteNodeAction,
  updateNodeLabel as updateNodeLabelAction,
  setNodes
} from '@/features/node/nodeSlice';
import { addEdge as addEdgeAction, setEdges } from '@/features/edge/edgeSlice';
import { StateSchema } from '@/app/store/StateSchema';
import { AppDispatch } from '@/app/store/store';
import { useEffect } from 'react';

export const useGraphs = () => {
  const dispatch: AppDispatch = useDispatch();
  const nodesFromStore = useSelector((state: StateSchema) => state.nodes.nodes);
  const edgesFromStore = useSelector((state: StateSchema) => state.edges.edges);

  const [nodes, setNodesState, onNodesChange] = useNodesState(nodesFromStore);
  const [edges, setEdgesState, onEdgesChange] = useEdgesState(edgesFromStore);

  useEffect(() => {
    setNodesState(nodesFromStore);
  }, [nodesFromStore, setNodesState]);

  useEffect(() => {
    setEdgesState(edgesFromStore);
  }, [edgesFromStore, setEdgesState]);

  const addNode = () => {
    const newNode: Node = {
      id: `node-${nodes.length + 1}`,
      type: 'customNode',
      data: { label: `Node ${nodes.length + 1}` },
      // TODO придумать какие то новые расстановки позиций
      position: { x: Math.random() * 400, y: Math.random() * 400 }
    };
    setNodesState((nds) => [...nds, newNode]);
    dispatch(addNodeAction(newNode));
  };

  const deleteNode = (id: string) => {
    const updatedNodes = nodes.filter((node) => node.id !== id);
    setNodesState(updatedNodes);
    dispatch(deleteNodeAction(id));
  };

  const updateNodeLabel = (id: string, newLabel: string) => {
    const updatedNodes = nodes.map((node) =>
      node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
    );
    setNodesState(updatedNodes);
    dispatch(updateNodeLabelAction({ id, newLabel }));
  };

  const onConnect = (params: Edge | Connection) => {
    const newEdge: Edge = {
      ...params,
      id: `edge-${params.source}-${params.target}`
    };
    setEdgesState((eds) => addEdge(newEdge, eds));
    dispatch(addEdgeAction(newEdge));
  };

  const onNodesChangeCallback = (changes: NodeChange[]) => {
    const updatedNodes = applyNodeChanges(changes, nodes);
    setNodesState([...updatedNodes]);
    dispatch(setNodes([...updatedNodes]));
  };

  const onEdgesChangeCallback = (changes: EdgeChange[]) => {
    const updatedEdges = applyEdgeChanges(changes, edges);
    setEdgesState([...updatedEdges]);
    dispatch(setEdges([...updatedEdges]));
  };

  return {
    nodes,
    edges,
    onNodesChange: onNodesChangeCallback,
    onEdgesChange: onEdgesChangeCallback,
    addNode,
    deleteNode,
    updateNodeLabel,
    onConnect
  };
};
