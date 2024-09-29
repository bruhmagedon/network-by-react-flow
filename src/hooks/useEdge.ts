import { StateSchema } from '@/app/store/StateSchema';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import {
  addEdge,
  applyEdgeChanges,
  Connection,
  Edge,
  EdgeChange,
  MarkerType,
  useEdgesState
} from '@xyflow/react';
import { useEffect } from 'react';
import {
  addEdge as addEdgeAction,
  deleteEdge as deleteEdgeAction,
  updateEdgeLabel as updateEdgeLabelAction,
  // deleteEdgesByNodeId as deleteEdgesByNodeIdAction,
  setEdges
} from '@/features/edge/model/edgeSlice';
import { useSelector } from 'react-redux';

export const useEdge = () => {
  const dispatch = useAppDispatch();
  const edgesFromStore = useSelector((state: StateSchema) => state.edges.edges);

  const [edges, setEdgesState, onEdgesChange] = useEdgesState(edgesFromStore);

  useEffect(() => {
    setEdgesState(edgesFromStore);
  }, [edgesFromStore, setEdgesState]);

  // * ЭДЖИ
  const deleteEdge = (id: string) => {
    const updatedEdges = edges.filter((edge) => edge.id !== id);
    setEdgesState(updatedEdges);
    dispatch(deleteEdgeAction(id));
  };

  const updateEdgeLabel = (id: string, newLabel: string) => {
    const updatedEdges = edges.map((edge) =>
      edge.id === id ? { ...edge, label: newLabel } : edge
    );
    setEdgesState(updatedEdges);
    dispatch(updateEdgeLabelAction({ id, newLabel }));
  };

  const onConnect = (params: Edge | Connection) => {
    const newEdge: Edge = {
      ...params,
      id: `edge-${params.source}-${params.target}`,
      label: '1',
      type: 'customEdge',
      markerEnd: {
        type: MarkerType.ArrowClosed,
        width: 10,
        height: 10,
        color: '#202020'
      },
      style: {
        strokeWidth: 2,
        stroke: '#202020'
      }
    };
    setEdgesState((eds) => addEdge(newEdge, eds));
    dispatch(addEdgeAction(newEdge));
  };

  const onEdgesChangeCallback = (changes: EdgeChange[]) => {
    const updatedEdges = applyEdgeChanges(changes, edges);
    setEdgesState([...updatedEdges]);
    dispatch(setEdges([...updatedEdges]));
  };

  return {
    edges,
    onEdgesChange: onEdgesChangeCallback,
    deleteEdge,
    updateEdgeLabel,
    onConnect
  };
};
