import { EdgeSchema } from '@/features/edge';
import { NodeSchema } from '@/features/node/model/nodeSlice';

export interface StateSchema {
  nodes: NodeSchema;
  edges: EdgeSchema;
}
