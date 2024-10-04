import { CustomNode } from '../ui/CustromNode';
import { Node } from '@xyflow/react';

export interface NodeData {
  label: string; // Название узла
  isStart?: boolean; // Указывает, является ли узел стартовым
  isEnd?: boolean; // Указывает, является ли узел конечным
  [key: string]: unknown; // Позволяет хранить дополнительные свойства
}

export interface NodeSchema {
  nodes: Node<NodeData>[];
  selectedNode: Node | null;
  selectedNodesForPath: {
    startNodeId: string | null;
    endNodeId: string | null;
  };
}

export const nodeTypes = {
  customNode: CustomNode
};
