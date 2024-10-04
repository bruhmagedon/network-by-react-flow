import { useDispatch, useSelector } from 'react-redux';
import { edgeActions, getEdges } from '@/features/edge';
import { Edge, MarkerType } from '@xyflow/react';
import { useEffect } from 'react';

export const useHighlightEdges = () => {
  const edges: Edge[] = useSelector(getEdges);
  const dispatch = useDispatch();

  const highlightPathEdges = (path: string[]) => {
    const updatedEdges = edges.map((edge) => {
      const isPathEdge =
        path.includes(edge.source) &&
        path.includes(edge.target) &&
        Math.abs(path.indexOf(edge.source) - path.indexOf(edge.target)) === 1;

      if (isPathEdge) {
        return {
          ...edge,
          animated: true,
          style: {
            stroke: 'blue',
            strokeWidth: 2.5,
            strokeDasharray: '5,5'
          },
          markerEnd: {
            type: MarkerType.Arrow,
            width: 15,
            height: 15,
            color: 'blue'
          }
        };
      }
      return edge;
    });

    dispatch(edgeActions.setEdges(updatedEdges));
  };

  const resetPathEdges = () => {
    const resetEdges = edges.map((edge) => {
      return {
        ...edge,
        animated: false,
        style: {
          stroke: '#dedede',
          strokeWidth: 2,
          strokeDasharray: 'none'
        },
        markerEnd: {
          type: MarkerType.Arrow,
          width: 15,
          height: 15,
          color: '#dedede'
        }
      };
    });

    dispatch(edgeActions.setEdges(resetEdges));
  };

  return { highlightPathEdges, resetPathEdges };
};
