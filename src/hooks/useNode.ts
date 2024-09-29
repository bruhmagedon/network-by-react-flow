import { StateSchema } from '@/app/store/StateSchema';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useNodesState, Node, NodeChange, applyNodeChanges } from '@xyflow/react';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { edgeSlice } from '@/features/edge/model/edgeSlice';
import { getNodes, nodeActions } from '@/features/node';
import { getEdges } from '@/features/edge';

export const useNode = () => {
  const dispatch = useAppDispatch();
  const nodesFromStore = useSelector(getNodes);
  const edgesFromStore = useSelector(getEdges);

  const [nodes, setNodesState] = useNodesState(nodesFromStore);

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
    dispatch(nodeActions.addNode(newNode));
  };

  const deleteNode = (id: string) => {
    const updatedNodes = nodes.filter((node) => node.id !== id);
    // Удаляем все эджи, связанные с нодой
    const updatedEdges = edgesFromStore.filter((edge) => edge.source !== id && edge.target !== id);
    setNodesState(updatedNodes);
    dispatch(nodeActions.deleteNode(id));
    dispatch(edgeSlice.actions.setEdges(updatedEdges));
  };

  const updateNodeLabel = (id: string, newLabel: string) => {
    const updatedNodes = nodes.map((node) =>
      node.id === id ? { ...node, data: { ...node.data, label: newLabel } } : node
    );
    setNodesState(updatedNodes);
    dispatch(nodeActions.updateNodeLabel({ id, newLabel }));
  };

  const onNodesChangeCallback = (changes: NodeChange[]) => {
    const updatedNodes = applyNodeChanges(changes, nodes);
    setNodesState([...updatedNodes]);
    dispatch(nodeActions.setNodes([...updatedNodes]));
  };

  return {
    nodes,
    onNodesChange: onNodesChangeCallback,
    addNode,
    deleteNode,
    updateNodeLabel
  };
};
