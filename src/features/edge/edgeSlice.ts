import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Edge } from '@xyflow/react';

export interface EdgeSchema {
  edges: Edge[];
  selectedEdge: Edge | null;
}

const loadEdgesFromLocalStorage = (): Edge[] => {
  const storedEdges = localStorage.getItem('graphEdges');
  return storedEdges ? JSON.parse(storedEdges) : [];
};

const initialState: EdgeSchema = {
  edges: loadEdgesFromLocalStorage(),
  selectedEdge: null
};

const updateLocalStorage = (edges: Edge[]) => {
  localStorage.setItem('graphEdges', JSON.stringify(edges));
};

export const edgeSlice = createSlice({
  name: 'edge',
  initialState,
  reducers: {
    addEdge: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload);
      updateLocalStorage(state.edges);
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
      updateLocalStorage(state.edges);
    },
    selectEdge: (state, action: PayloadAction<string | null>) => {
      state.selectedEdge = state.edges.find((edge) => edge.id === action.payload) || null;
    },
    deleteEdge: (state, action: PayloadAction<string>) => {
      state.edges = state.edges.filter((edge) => edge.id !== action.payload);
      state.selectedEdge = null;
      updateLocalStorage(state.edges);
    },
    updateEdgeLabel: (state, action: PayloadAction<{ id: string; newLabel: string }>) => {
      const edge = state.edges.find((edge) => edge.id === action.payload.id);
      if (edge) {
        edge.label = action.payload.newLabel;
        updateLocalStorage(state.edges);
      }
    },
    resetSelection: (state) => {
      state.selectedEdge = null;
    }
  }
});

export const { addEdge, setEdges, selectEdge, deleteEdge, updateEdgeLabel, resetSelection } =
  edgeSlice.actions;
export const edgeReducer = edgeSlice.reducer;
