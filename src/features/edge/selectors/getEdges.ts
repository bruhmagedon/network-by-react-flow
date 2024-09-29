import { StateSchema } from '@/app/store/StateSchema';

export const getEdges = (state: StateSchema) => state.edges.edges;
export const getSelectedEdge = (state: StateSchema) => state.edges.selectedEdge;
