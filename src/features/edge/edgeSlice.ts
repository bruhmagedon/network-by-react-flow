import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Edge } from '@xyflow/react';

export interface EdgeSchema {
  edges: Edge[];
}

const loadEdgesFromLocalStorage = (): Edge[] => {
  const storedEdges = localStorage.getItem('graphEdges');
  return storedEdges ? JSON.parse(storedEdges) : [];
};

const initialState: EdgeSchema = {
  edges: loadEdgesFromLocalStorage()
};

export const edgeSlice = createSlice({
  name: 'edge',
  initialState,
  reducers: {
    addEdge: (state, action: PayloadAction<Edge>) => {
      state.edges.push(action.payload);
      localStorage.setItem('graphEdges', JSON.stringify(state.edges));
    },
    setEdges: (state, action: PayloadAction<Edge[]>) => {
      state.edges = action.payload;
      localStorage.setItem('graphEdges', JSON.stringify(state.edges));
    }
  }
});

export const { addEdge, setEdges } = edgeSlice.actions;
export const edgeReducer = edgeSlice.reducer;
