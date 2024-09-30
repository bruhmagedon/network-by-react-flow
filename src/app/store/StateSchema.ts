import { EdgeSchema } from '@/features/edge';
import { NodeSchema } from '@/features/node';

export interface StateSchema {
  nodes: NodeSchema;
  edges: EdgeSchema;
}
