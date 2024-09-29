import { EdgeSchema } from '@/features/edge/edgeSlice';
import { NodeSchema } from '@/features/node/nodeSlice';

export interface StateSchema {
  nodes: NodeSchema;
  edges: EdgeSchema;
}
