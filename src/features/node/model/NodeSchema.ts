import { CustomNode } from '../ui/CustromNode';
import { Node } from '@xyflow/react';

export interface NodeSchema {
  nodes: Node[];
  selectedNode: Node | null;
}

export const nodeTypes = {
  customNode: CustomNode
};
