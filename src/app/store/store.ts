import { configureStore } from '@reduxjs/toolkit';
import { nodeReducer } from '@/features/node';
import { edgeReducer } from '@/features/edge';
import { StateSchema } from './StateSchema';

export const store = configureStore<StateSchema>({
  reducer: {
    nodes: nodeReducer,
    edges: edgeReducer
  },
  devTools: true
});

export type AppDispatch = typeof store.dispatch;
