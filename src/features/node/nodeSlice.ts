import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node } from '@xyflow/react';

export interface NodeSchema {
  nodes: Node[]; // Используем тип Node
  selectedNode: Node | null;
}

// Загружаем узлы из localStorage
const loadNodesFromLocalStorage = (): Node[] => {
  const storedNodes = localStorage.getItem('graphNodes');
  return storedNodes ? JSON.parse(storedNodes) : [];
};

// Функция для обновления localStorage
const updateLocalStorage = (nodes: Node[]) => {
  localStorage.setItem('graphNodes', JSON.stringify(nodes));
};

const initialState: NodeSchema = {
  nodes: loadNodesFromLocalStorage(),
  selectedNode: null
};

export const nodeSlice = createSlice({
  name: 'node',
  initialState,

  reducers: {
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
      updateLocalStorage(state.nodes);
    },

    deleteNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter((node) => node.id !== action.payload);
      state.selectedNode = null; // Сбрасываем выбранный узел
      updateLocalStorage(state.nodes);
    },

    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNode = state.nodes.find((node) => node.id === action.payload) || null;
    },

    updateNodeLabel: (state, action: PayloadAction<{ id: string; newLabel: string }>) => {
      const node = state.nodes.find((node) => node.id === action.payload.id);
      // if (node && typeof node.data === 'object') {
      if (node) {
        node.data = { ...node.data, label: action.payload.newLabel }; // Обновляем label
        updateLocalStorage(state.nodes);
      }
    },

    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
      updateLocalStorage(state.nodes);
    }
  }
});

export const { addNode, deleteNode, selectNode, updateNodeLabel, setNodes } = nodeSlice.actions;
export const nodeReducer = nodeSlice.reducer;
