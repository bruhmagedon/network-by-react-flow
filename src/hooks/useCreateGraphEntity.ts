import { Connection, Edge, MarkerType, Node } from '@xyflow/react';

export const useCreateGraphEntity = () => {
  const createEdge = (params: Edge | Connection): Edge => {
    return {
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
  };

  const createNode = (nodes: Node[]): Node => {
    return {
      id: `node-${nodes.length + 1}`,
      type: 'customNode',
      data: { label: `Node ${nodes.length + 1}` },
      // TODO придумать какие то новые расстановки позиций
      position: { x: Math.random() * 400, y: Math.random() * 400 }
    };
  };

  return {
    createNode,
    createEdge
  };
};
