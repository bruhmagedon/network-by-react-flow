import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { NodeSchema } from './NodeSchema';
import { Node } from '@xyflow/react';
import { loadFromLocalStorage, updateLocalStorage } from '@/lib/localStorage';

const initialState: NodeSchema = {
  nodes: loadFromLocalStorage('graphNodes'),
  selectedNode: null
};

export const nodeSlice = createSlice({
  name: 'node',
  initialState,
  reducers: {
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
      updateLocalStorage(state.nodes, 'graphNodes');
    },
    deleteNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter((node) => node.id !== action.payload);
      state.selectedNode = null;
      updateLocalStorage(state.nodes, 'graphNodes');
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
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
      updateLocalStorage(state.nodes, 'graphNodes');
    },
    resetSelection: (state) => {
      state.selectedNode = null;
    }
  }
});

export const { actions: nodeActions } = nodeSlice;
export const { reducer: nodeReducer } = nodeSlice;

export const { addNode, deleteNode, selectNode, updateNodeLabel, setNodes, resetSelection } =
  nodeSlice.actions;
