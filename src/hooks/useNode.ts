import { StateSchema } from '@/app/store/StateSchema';
import { AppDispatch } from '@/app/store/store';
import { useNodesState, Node, NodeChange, applyNodeChanges } from '@xyflow/react';
import {
  addNode as addNodeAction,
  deleteNode as deleteNodeAction,
  updateNodeLabel as updateNodeLabelAction,
  setNodes
} from '@/features/node/nodeSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { edgeSlice } from '@/features/edge/edgeSlice';

export const useNode = () => {
  const dispatch: AppDispatch = useDispatch();
  const nodesFromStore = useSelector((state: StateSchema) => state.nodes.nodes);
  const edgesFromStore = useSelector((state: StateSchema) => state.edges.edges);

  const [nodes, setNodesState, onNodesChange] = useNodesState(nodesFromStore);

  useEffect(() => {
    setNodesState(nodesFromStore);
  }, [nodesFromStore, setNodesState]);

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
    // Удаляем все эджи, связанные с нодой
    const updatedEdges = edgesFromStore.filter((edge) => edge.source !== id && edge.target !== id);
    setNodesState(updatedNodes);
    dispatch(deleteNodeAction(id));
    dispatch(edgeSlice.actions.setEdges(updatedEdges));
  };

  const updateNodeLabel = (id: string, newLabel: string) => {
    const updatedNodes = nodes.map((node) =>
      node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
    );
    setNodesState(updatedNodes);
    dispatch(updateNodeLabelAction({ id, newLabel }));
  };

  const onNodesChangeCallback = (changes: NodeChange[]) => {
    const updatedNodes = applyNodeChanges(changes, nodes);
    setNodesState([...updatedNodes]);
    dispatch(setNodes([...updatedNodes]));
  };

  return {
    nodes,
    onNodesChange: onNodesChangeCallback,
    addNode,
    deleteNode,
    updateNodeLabel
  };
};
