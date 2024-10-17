// useFloyd.ts
import { getEdges } from '@/features/edge';
import { getNodes } from '@/features/node';
import { Edge, Node } from '@xyflow/react';
import { useSelector } from 'react-redux';
import { useHighlightEdges } from './useHighlightEdges';

export const useFloyd = () => {
  const nodes: Node[] = useSelector(getNodes);
  const edges: Edge[] = useSelector(getEdges);
  const { highlightPathEdges } = useHighlightEdges();

  const floydWarshall = (): { distances: number[][]; next: string[][] } => {
    const nodeCount = nodes.length;
    const distances = Array(nodeCount)
      .fill(null)
      .map(() => Array(nodeCount).fill(Infinity));
    const next = Array(nodeCount)
      .fill(null)
      .map(() => Array(nodeCount).fill(null));

    nodes.forEach((node, i) => {
      distances[i][i] = 0; // Расстояние до самого себя
      next[i][i] = node.id;
    });

    edges.forEach((edge) => {
      const sourceIndex = nodes.findIndex((n) => n.id === edge.source);
      const targetIndex = nodes.findIndex((n) => n.id === edge.target);
      const weight = parseFloat(edge.label as string);
      distances[sourceIndex][targetIndex] = weight;
      next[sourceIndex][targetIndex] = nodes[targetIndex].id;
    });

    for (let k = 0; k < nodeCount; k++) {
      for (let i = 0; i < nodeCount; i++) {
        for (let j = 0; j < nodeCount; j++) {
          if (distances[i][j] > distances[i][k] + distances[k][j]) {
            distances[i][j] = distances[i][k] + distances[k][j];
            next[i][j] = next[i][k];
          }
        }
      }
    }

    return { distances, next };
  };

  const findFloydPath = (
    startNodeId: string,
    endNodeId: string
  ): { path: string[]; totalWeight: number } => {
    const { distances, next } = floydWarshall();
    const startIndex = nodes.findIndex((node) => node.id === startNodeId);
    const endIndex = nodes.findIndex((node) => node.id === endNodeId);

    const path = [];
    let currentIndex = startIndex;

    if (next[startIndex][endIndex] === null) {
      alert('Невозможно построить маршрут по этим нодам');
      return { path: [], totalWeight: 0 };
    }

    while (currentIndex !== endIndex) {
      path.push(nodes[currentIndex].id);
      currentIndex = nodes.findIndex((n) => n.id === next[currentIndex][endIndex]);
    }
    path.push(endNodeId);

    highlightPathEdges(path, 'floyd'); // Подсвечиваем путь красным
    return { path, totalWeight: distances[startIndex][endIndex] };
  };

  return { findFloydPath, floydWarshall };
};
