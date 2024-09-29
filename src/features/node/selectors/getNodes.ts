import { StateSchema } from '@/app/store/StateSchema';

export const getNodes = (state: StateSchema) => state.nodes.nodes;
export const getSelectedNode = (state: StateSchema) => state.nodes.selectedNode;
