import { configureStore } from '@reduxjs/toolkit';
import { StateSchema } from './StateSchema';
import { nodeReducer } from '@/features/node/nodeSlice';
import { edgeReducer } from '@/features/edge/edgeSlice';
// ...

export const store = configureStore<StateSchema>({
  reducer: {
    nodes: nodeReducer,
    edges: edgeReducer
  },
  devTools: true
});

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
