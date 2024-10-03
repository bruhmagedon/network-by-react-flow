import { edgeActions } from '@/features/edge';
import { getEdges } from '@/features/edge/selectors/getEdges';
import { nodeActions } from '@/features/node';
import { useAppDispatch } from '@/hooks/redux/useAppDispatch';
import {
  addEdge,
  applyEdgeChanges,
  Connection,
  Edge,
  EdgeChange,
  useEdgesState
} from '@xyflow/react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useCreateGraphEntity } from './useCreateGraphEntity';

export const useEdge = () => {
  const dispatch = useAppDispatch();
  const edgesFromStore = useSelector(getEdges);

  const { createEdge } = useCreateGraphEntity();
  const [edges, setEdgesState] = useEdgesState(edgesFromStore);

  useEffect(() => {
    setEdgesState(edgesFromStore);
  }, [edgesFromStore, setEdgesState]);

  const onConnect = (params: Edge | Connection) => {
    const edgeExists = edges.some(
      (edge) => edge.source === params.source && edge.target === params.target
    );

    if (!edgeExists) {
      const newEdge = createEdge(params);
      setEdgesState((eds) => addEdge(newEdge, eds));
      dispatch(edgeActions.addEdge(newEdge));
    }
  };

  const onEdgeClick = (_e: React.MouseEvent, edge: Edge) => {
    dispatch(nodeActions.resetSelection());
    dispatch(edgeActions.selectEdge(edge.id));
  };

  const deleteEdge = (id: string) => {
    const updatedEdges = edges.filter((edge) => edge.id !== id);
    setEdgesState(updatedEdges);
    dispatch(edgeActions.deleteEdge(id));
  };

  const updateEdgeLabel = (id: string, newLabel: string) => {
    const updatedEdges = edges.map((edge) =>
      edge.id === id
        ? {
            ...edge,
            label: newLabel // Создаем новую копию объекта с измененным label
          }
        : edge
    );
    setEdgesState(updatedEdges);
    dispatch(edgeActions.updateEdgeLabel({ id, newLabel }));
  };

  // Новая функция для массового обновления дуг
  const setEdges = (newEdges: Edge[]) => {
    setEdgesState(newEdges); // Обновляем локальное состояние
    dispatch(edgeActions.setEdges(newEdges)); // Обновляем состояние в Redux и локальное хранилище
  };

  const onEdgesChangeCallback = (changes: EdgeChange[]) => {
    const updatedEdges = applyEdgeChanges(changes, edges);
    setEdgesState([...updatedEdges]);
    dispatch(edgeActions.setEdges([...updatedEdges]));
  };

  return {
    onEdgeClick,
    edges,
    setEdges, // Возвращаем функцию setEdges
    onEdgesChange: onEdgesChangeCallback,
    deleteEdge,
    updateEdgeLabel,
    onConnect
  };
};
