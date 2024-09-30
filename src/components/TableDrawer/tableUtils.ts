import { Edge, Node } from '@xyflow/react';

export const createMatrixFromGraph = (nodes: Node[], edges: Edge[]) => {
  const matrix = nodes.map(() => Array(nodes.length).fill(0));

  edges.forEach((edge) => {
    const sourceIndex = nodes.findIndex((node) => node.id === edge.source);
    const targetIndex = nodes.findIndex((node) => node.id === edge.target);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      const weight = parseInt(edge.label as string, 10) || 1; // Поддержка рёбер без метки
      matrix[sourceIndex][targetIndex] = weight;
    }
  });

  return matrix;
};
