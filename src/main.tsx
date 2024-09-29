import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './app/index.css';
import GraphApp from './app/GraphApp.tsx';
import { store } from './app/store/store.ts';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <GraphApp />
    </Provider>
  </StrictMode>
);
