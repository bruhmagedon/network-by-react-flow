import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Edge } from '@xyflow/react';
import { EdgeSchema } from './EdgeSchema';
import { loadFromLocalStorage, updateLocalStorage } from '@/lib/localStorage';

const initialState: EdgeSchema = {
  edges: loadFromLocalStorage('graphEdges'),
  selectedEdge: null
};

export const edgeSlice = createSlice({
  name: 'edge',
  initialState,
  reducers: {
    addEdge: (state, action: PayloadAction<Edge>) => {
      // Проверяем, что дуга уже не существует
      const edgeExists = state.edges.some(
        (edge) => edge.source === action.payload.source && edge.target === action.payload.target
      );
      if (!edgeExists && parseFloat(action.payload.label as string) >= 0) {
        // Проверка на неотрицательные веса
        state.edges.push(action.payload);
        updateLocalStorage(state.edges, 'graphEdges');
      }
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
      updateLocalStorage(state.edges, 'graphEdges');
    },
    selectEdge: (state, action: PayloadAction<string | null>) => {
      state.selectedEdge = state.edges.find((edge) => edge.id === action.payload) || null;
    },
    deleteEdge: (state, action: PayloadAction<string>) => {
      state.edges = state.edges.filter((edge) => edge.id !== action.payload);
      state.selectedEdge = null;
      updateLocalStorage(state.edges, 'graphEdges');
    },
    updateEdgeLabel: (state, action: PayloadAction<{ id: string; newLabel: string }>) => {
      const edge = state.edges.find((edge) => edge.id === action.payload.id);
      if (edge && parseFloat(action.payload.newLabel) >= 0) {
        // Проверка на неотрицательные веса
        edge.label = action.payload.newLabel;
        updateLocalStorage(state.edges, 'graphEdges');
      }
    },
    resetSelection: (state) => {
      state.selectedEdge = null;
    }
  }
});

export const { actions: edgeActions } = edgeSlice;
export const { reducer: edgeReducer } = edgeSlice;

export const { addEdge, setEdges, selectEdge, deleteEdge, updateEdgeLabel, resetSelection } =
  edgeSlice.actions;
