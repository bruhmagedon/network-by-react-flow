import { useAppDispatch } from '@/hooks/redux/useAppDispatch';
import { useNodesState, NodeChange, applyNodeChanges } from '@xyflow/react';

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { edgeActions, edgeSlice } from '@/features/edge/model/edgeSlice';
import { getNodes, nodeActions } from '@/features/node';
import { getEdges } from '@/features/edge';
import { useCreateGraphEntity } from './useCreateGraphEntity';

export const useNode = () => {
  const dispatch = useAppDispatch();
  const nodesFromStore = useSelector(getNodes);
  const edgesFromStore = useSelector(getEdges);

  const { createNode } = useCreateGraphEntity();
  const [nodes, setNodesState] = useNodesState(nodesFromStore);

  useEffect(() => {
    setNodesState(nodesFromStore);
  }, [nodesFromStore, setNodesState]);

  const addNode = () => {
    const newNode = createNode(nodes);
    setNodesState((nds) => [...nds, newNode]);
    dispatch(nodeActions.addNode(newNode));
  };

  const onNodeClick = (id: string) => {
    dispatch(edgeActions.resetSelection());
    dispatch(nodeActions.selectNode(id));
  };

  const deleteNode = (id: string) => {
    const updatedNodes = nodes.filter((node) => node.id !== id);
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
    onNodeClick,
    onNodesChange: onNodesChangeCallback,
    addNode,
    deleteNode,
    updateNodeLabel
  };
};
