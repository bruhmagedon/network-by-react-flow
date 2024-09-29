import { selectEdge, edgeSlice } from '@/features/edge/model/edgeSlice';
import { nodeSlice } from '@/features/node/model/nodeSlice';
import { Edge } from '@xyflow/react';
import { useAppDispatch } from './useAppDispatch';
import { useEdge } from './useEdge';
import { useNode } from './useNode';

export const useGraphs = () => {
  const { nodes, onNodesChange } = useNode();
  const { edges, onEdgesChange, onConnect } = useEdge();

  const dispatch = useAppDispatch();

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
    console.log('da');
    dispatch(nodeSlice.actions.resetSelection());
    dispatch(selectEdge(edge.id)); // Выбираем эдж по клику
  };

  const resetSelection = () => {
    dispatch(nodeSlice.actions.resetSelection());
    dispatch(edgeSlice.actions.resetSelection());
  };

  return {
    resetSelection,
    onEdgeClick,
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect
  };
};
