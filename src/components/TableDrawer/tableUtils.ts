import { Edge, Node } from '@xyflow/react';

export const createMatrixFromGraph = (nodes: Node[], edges: Edge[]) => {
  const matrix = Array(nodes.length)
    .fill(null)
    .map(() => Array(nodes.length).fill(0));

  edges.forEach((edge) => {
    const sourceIndex = nodes.findIndex((node) => node.id === edge.source);
    const targetIndex = nodes.findIndex((node) => node.id === edge.target);

    if (sourceIndex !== -1 && targetIndex !== -1) {
      matrix[sourceIndex][targetIndex] = parseInt(edge.label as string, 10);
    }
  });

  return matrix;
};
