import { NodeData } from '@/features/node/model/NodeSchema';
import { Connection, Edge, MarkerType, Node } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid'; // Импортируем метод для генерации уникальных ID

export const useCreateGraphEntity = () => {
  // Функция для создания уникального эджа
  // Модифицируем функцию createEdge, чтобы учитывать введённый вес
  const createEdge = (params: Edge | Connection): Edge => {
    return {
      ...params,
      id: `edge-${uuidv4()}`, // Генерация уникального id для эджа
      label: '1', // Используем введённый вес
      type: 'customEdge',
      markerEnd: {
        type: MarkerType.Arrow,
        width: 15,
        height: 15,
        color: '#dedede'
      },
      style: {
        strokeWidth: 2,
        stroke: '#dedede'
      }
    };
  };

  // Функция для создания уникальной ноды
  const createNode = (nodes: Node<NodeData>[]): Node<NodeData> => {
    return {
      id: `node-${uuidv4()}`,
      type: 'customNode',
      data: { label: `Node ${nodes.length + 1}` }, // Убедимся, что label есть в data
      position: { x: Math.random() * 400, y: Math.random() * 400 }
    };
  };

  return {
    createNode,
    createEdge
  };
};
