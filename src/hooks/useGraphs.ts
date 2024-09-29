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
import { addNode as addNodeAction, setNodes } from '@/features/node/nodeSlice';
import { addEdge as addEdgeAction, setEdges } from '@/features/edge/edgeSlice';
import { StateSchema } from '@/app/store/StateSchema';
import { AppDispatch } from '@/app/store/store';

export const useGraphs = () => {
  const dispatch: AppDispatch = useDispatch();
  const nodesFromStore = useSelector((state: StateSchema) => state.nodes.nodes);
  const edgesFromStore = useSelector((state: StateSchema) => state.edges.edges);

  const [nodes, setNodesState, onNodesChange] = useNodesState(nodesFromStore);
  const [edges, setEdgesState, onEdgesChange] = useEdgesState(edgesFromStore);

  const addNode = () => {
    const newNode: Node = {
      id: `node-${nodes.length + 1}`, // Уникальный id для узла
      type: 'customNode',
      data: { label: `Node ${nodes.length + 1}` },
      // TODO придумать какие то новые расстановки позиций
      position: { x: Math.random() * 400, y: Math.random() * 400 }
    };
    setNodesState((nds) => [...nds, newNode]);
    dispatch(addNodeAction(newNode));
  };

  const onConnect = (params: Edge | Connection) => {
    const newEdge: Edge = {
      ...params,
      id: `edge-${params.source}-${params.target}` // Уникальный id для каждого ребра
    };
    setEdgesState((eds) => addEdge(newEdge, eds)); // Обновляем состояние
    dispatch(addEdgeAction(newEdge)); // Сохраняем в Redux
  };

  // Исправление: Проверка наличия свойства id
  const onNodesChangeCallback = (changes: NodeChange[]) => {
    const updatedNodes = applyNodeChanges(changes, nodes);
    setNodesState([...updatedNodes]); // Создаём новый массив
    dispatch(setNodes([...updatedNodes])); // Отправляем в Redux Store
  };

  const onEdgesChangeCallback = (changes: EdgeChange[]) => {
    const updatedEdges = applyEdgeChanges(changes, edges);
    setEdgesState([...updatedEdges]); // Создаём новый массив
    dispatch(setEdges([...updatedEdges])); // Отправляем в Redux Store
  };

  return {
    nodes,
    edges,
    onNodesChange: onNodesChangeCallback,
    onEdgesChange: onEdgesChangeCallback,
    addNode,
    onConnect
  };
};
