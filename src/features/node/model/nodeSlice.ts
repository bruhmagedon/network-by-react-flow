import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NodeData, NodeSchema } from './NodeSchema';
import { Node } from '@xyflow/react';
import { loadFromLocalStorage, updateLocalStorage } from '@/lib/localStorage';
import { StateSchema } from '@/app/store/StateSchema';

const initialState: NodeSchema = {
  nodes: loadFromLocalStorage('graphNodes'),
  selectedNode: null,
  selectedNodesForPath: {
    startNodeId: null,
    endNodeId: null
  }
};

export const MAX_NODES = 10;
export const MIN_NODES = 1;

export const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<Node<NodeData>>) => {
      if (state.nodes.length < MAX_NODES) {
        // Ограничение на максимум узлов
        state.nodes.push(action.payload);
        updateLocalStorage(state.nodes, 'graphNodes');
      }
    },
    deleteNode: (state, action: PayloadAction<string>) => {
      if (state.nodes.length >= MIN_NODES) {
        // Ограничение на минимум узлов
        state.nodes = state.nodes.filter((node) => node.id !== action.payload);
        state.selectedNode = null;
        updateLocalStorage(state.nodes, 'graphNodes');
      }
    },
    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNode = state.nodes.find((node) => node.id === action.payload) || null;
    },
    updateNodeLabel: (state, action: PayloadAction<{ id: string; newLabel: string }>) => {
      const node = state.nodes.find((node) => node.id === action.payload.id);
      if (node) {
        node.data = { ...node.data, label: action.payload.newLabel };
        updateLocalStorage(state.nodes, 'graphNodes');
      }
    },
    setNodes: (state, action: PayloadAction<Node<NodeData>[]>) => {
      state.nodes = action.payload;
      updateLocalStorage(state.nodes, 'graphNodes');
    },
    resetSelection: (state) => {
      state.selectedNode = null;
    },
    selectNodeForPath: (state, action: PayloadAction<string>) => {
      const { startNodeId, endNodeId } = state.selectedNodesForPath;
      if (!startNodeId) {
        state.selectedNodesForPath.startNodeId = action.payload;
      } else if (!endNodeId && action.payload !== startNodeId) {
        state.selectedNodesForPath.endNodeId = action.payload;
      }
    },
    resetSelectedNodesForPath: (state) => {
      state.selectedNodesForPath = { startNodeId: null, endNodeId: null };
    },
    resetPathSelection: (state) => {
      state.selectedNodesForPath.startNodeId = null;
      state.selectedNodesForPath.endNodeId = null;
    }
  }
});

export const { actions: nodeActions } = nodeSlice;
export const { reducer: nodeReducer } = nodeSlice;

export const getNodeLabelById = (state: StateSchema, id: string | null): string | null => {
  const node = state.nodes.nodes.find((node: Node) => node.id === id);
  return node ? (node.data.label as string) : null;
};
