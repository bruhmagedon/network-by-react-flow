import { Edge } from '@xyflow/react';
import { CustomEdge } from '../ui/CustomEdge';

export interface EdgeSchema {
  edges: Edge[];
  selectedEdge: Edge | null;
}

export const edgeTypes = {
  customEdge: CustomEdge
};
