// useGraphs.ts
import { AppDispatch } from '@/app/store/store';
import { edgeSlice, selectEdge } from '@/features/edge/edgeSlice';
import { Edge } from '@xyflow/react';
import { useDispatch } from 'react-redux';
import { useEdge } from './useEdge';
import { useNode } from './useNode';
import { nodeSlice } from '@/features/node/nodeSlice';

export const useGraphs = () => {
  const { nodes, onNodesChange } = useNode();
  const { edges, onEdgesChange, onConnect } = useEdge();

  const dispatch: AppDispatch = useDispatch();

  const onEdgeClick = (event: React.MouseEvent, edge: Edge) => {
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
