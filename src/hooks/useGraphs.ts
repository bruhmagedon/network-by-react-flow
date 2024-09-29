// useGraphs.ts
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { edgeSlice, selectEdge } from '@/features/edge/model/edgeSlice';
import { Edge } from '@xyflow/react';
import { useDispatch } from 'react-redux';
import { useEdge } from './useEdge';
import { useNode } from './useNode';
import { nodeSlice } from '@/features/node/model/nodeSlice';

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
