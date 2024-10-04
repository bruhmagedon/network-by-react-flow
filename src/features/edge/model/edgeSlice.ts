import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Edge } from '@xyflow/react';
import { EdgeSchema } from './EdgeSchema';
import { loadFromLocalStorage, updateLocalStorage } from '@/lib/localStorage';

const initialState: EdgeSchema = {
  edges: loadFromLocalStorage('graphEdges'), // Загрузка дуг из localStorage
  selectedEdge: null // Выбранная дуга
};

export const edgeSlice = createSlice({
  name: 'edge',
  initialState,
  reducers: {
    addEdge: (state, action: PayloadAction<Edge>) => {
      // Проверка на существование дуги и неотрицательный вес
      const edgeExists = state.edges.some(
        (edge) => edge.source === action.payload.source && edge.target === action.payload.target
      );
      if (!edgeExists && parseFloat(action.payload.label as string) >= 0) {
        state.edges.push(action.payload); // Добавление дуги
        updateLocalStorage(state.edges, 'graphEdges');
      }
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload; // Установка дуг
      updateLocalStorage(state.edges, 'graphEdges');
    },
    selectEdge: (state, action: PayloadAction<string | null>) => {
      state.selectedEdge = state.edges.find((edge) => edge.id === action.payload) || null; // Выбор дуги
    },
    deleteEdge: (state, action: PayloadAction<string>) => {
      state.edges = state.edges.filter((edge) => edge.id !== action.payload); // Удаление дуги
      state.selectedEdge = null; // Сброс выбора
      updateLocalStorage(state.edges, 'graphEdges');
    },
    updateEdgeLabel: (state, action: PayloadAction<{ id: string; newLabel: string }>) => {
      const edge = state.edges.find((edge) => edge.id === action.payload.id);
      if (edge && parseFloat(action.payload.newLabel) >= 0) {
        // Проверка на неотрицательный вес
        edge.label = action.payload.newLabel; // Обновление веса дуги
        updateLocalStorage(state.edges, 'graphEdges');
      }
    },
    resetSelection: (state) => {
      state.selectedEdge = null; // Сброс выбора дуги
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateEdgeStyle: (state, action: PayloadAction<{ id: string; newStyle: any }>) => {
      const edge = state.edges.find((edge) => edge.id === action.payload.id);
      if (edge) {
        edge.style = { ...edge.style, ...action.payload.newStyle };
        updateLocalStorage(state.edges, 'graphEdges');
      }
    }
  }
});

export const { actions: edgeActions } = edgeSlice;
export const { reducer: edgeReducer } = edgeSlice;
