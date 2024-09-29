import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Node } from '@xyflow/react';

// initialState формируется из localStorage (также придумай NodeSchema)
export interface NodeSchema {
  nodes: Node[];
  selectedNode: Node | null;
}

const loadNodesFromLocalStorage = (): Node[] => {
  const storedNodes = localStorage.getItem('graphNodes');
  const nodes = storedNodes ? JSON.parse(storedNodes) : [];

  // Проверяем и восстанавливаем типы узлов
  return nodes.map((node: Node) => ({
    ...node,
    type: node.type || 'customNode' // Если тип отсутствует, устанавливаем 'customNode'
  }));
};

const initialState: NodeSchema = {
  nodes: loadNodesFromLocalStorage(),
  selectedNode: null
};

export const nodeSlice = createSlice({
  name: 'node',
  initialState,

  reducers: {
    // Нужные редьюсеры (чтобы она автоматически взаимодействовали со стором и localStorage):
    // Добавить ноду
    addNode: (state, action: PayloadAction<Node>) => {
      state.nodes.push(action.payload);
      localStorage.setItem('graphNodes', JSON.stringify(state.nodes));
    },
    // Удалить ноду
    deleteNode: (state, action: PayloadAction<string>) => {
      state.nodes = state.nodes.filter((node) => node.id !== action.payload);
      localStorage.setItem('graphNodes', JSON.stringify(state.nodes));
    },
    // Выбрать ноду (когда кликаешь на неё)
    selectNode: (state, action: PayloadAction<string | null>) => {
      state.selectedNode = state.nodes.find((node) => node.id === action.payload) || null;
    },
    setNodes: (state, action: PayloadAction<Node[]>) => {
      state.nodes = action.payload;
      localStorage.setItem('graphNodes', JSON.stringify(state.nodes));
    }
  }
});

export const { addNode, deleteNode, selectNode, setNodes } = nodeSlice.actions;
export const nodeReducer = nodeSlice.reducer;
