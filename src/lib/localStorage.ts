import { Edge, Node } from '@xyflow/react';

type ItemKey = 'graphEdges' | 'graphNodes';

export const loadFromLocalStorage = (itemKey: ItemKey) => {
  const store = localStorage.getItem(itemKey);
  return store ? JSON.parse(store) : [];
};

export const updateLocalStorage = (items: Node[] | Edge[], itemKey: ItemKey) => {
  localStorage.setItem(itemKey, JSON.stringify(items));
};
