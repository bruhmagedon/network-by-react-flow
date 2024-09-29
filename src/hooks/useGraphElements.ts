import { AnyAction } from '@reduxjs/toolkit';
import { useAppDispatch } from '@/hooks/useAppDispatch';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

export const useGraphElements = <T extends { id: string }>(
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  getElementsSelector: (state: any) => T[], // Выборка элементов из Redux
  actions: {
    add: (element: T) => AnyAction;
    delete: (id: string) => AnyAction;
    update: (payload: { id: string; newLabel: string }) => AnyAction;
    set: (elements: T[]) => AnyAction;
  },
  createElement: (id: string, label: string, position?: { x: number; y: number }) => T // Фабрика создания элементов
) => {
  const dispatch = useAppDispatch();
  const elementsFromStore = useSelector(getElementsSelector);
  const [elements, setElements] = useState<T[]>(elementsFromStore);

  useEffect(() => {
    setElements(elementsFromStore);
  }, [elementsFromStore]);

  const addElement = () => {
    const newElement = createElement(
      `element-${elements.length + 1}`,
      `Element ${elements.length + 1}`,
      { x: Math.random() * 400, y: Math.random() * 400 }
    );
    setElements((els) => [...els, newElement]);
    dispatch(actions.add(newElement));
  };

  const deleteElement = (id: string, relatedElements?: T[]) => {
    const updatedElements = elements.filter((el) => el.id !== id);
    setElements(updatedElements);
    dispatch(actions.delete(id));

    // Обновляем связанные элементы, если переданы (например, для удаления дуг при удалении ноды)
    if (relatedElements) {
      dispatch(actions.set(relatedElements));
    }
  };

  const updateElementLabel = (id: string, newLabel: string) => {
    const updatedElements = elements.map((el) =>
      el.id === id ? { ...el, data: { ...el.data, label: newLabel } } : el
    );
    setElements(updatedElements);
    dispatch(actions.update({ id, newLabel }));
  };

  return {
    elements,
    addElement,
    deleteElement,
    updateElementLabel
  };
};
