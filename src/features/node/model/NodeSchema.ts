import { CustomNode } from '../ui/CustromNode';
import { Node } from '@xyflow/react';

export interface NodeData {
  label: string; // ваше конкретное поле
  [key: string]: unknown; // сигнатура индекса для любого другого поля
}

export interface NodeSchema {
  nodes: Node<NodeData>[];
  selectedNode: Node | null;
}

export const nodeTypes = {
  customNode: CustomNode
};
