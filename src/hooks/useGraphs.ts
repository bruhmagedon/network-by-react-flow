// useGraphs.ts
import { useAppDispatch } from '@/hooks/redux/useAppDispatch';
import { edgeActions } from '@/features/edge/model/edgeSlice';

import { useEdge } from './useEdge';
import { useNode } from './useNode';
import { nodeActions } from '@/features/node/model/nodeSlice';

export const useGraphs = () => {
  const dispatch = useAppDispatch();

  const { nodes, onNodesChange } = useNode();
  const { edges, onEdgesChange, onConnect, onEdgeClick } = useEdge();

  const resetSelection = () => {
    dispatch(nodeActions.resetSelection());
    dispatch(edgeActions.resetSelection());
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
