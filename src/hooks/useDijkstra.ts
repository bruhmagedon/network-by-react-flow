import { useSelector } from 'react-redux';
import { getEdges } from '@/features/edge';
import { Node, Edge } from '@xyflow/react';
import { getNodes } from '@/features/node';
import { useHighlightEdges } from './useHighlightEdges';

export const useDijkstra = () => {
  const nodes: Node[] = useSelector(getNodes);
  const edges: Edge[] = useSelector(getEdges);
  const { highlightPathEdges } = useHighlightEdges();

  // Вспомогательная функция для получения названия узла по его ID
  const getNodeLabeForPath = (nodeId: string) => {
    const node = nodes.find((node) => node.id === nodeId);
    return (node?.data.label as string) || nodeId; // Если узел не найден, возвращаем ID
  };

  const findShortestPath = (
    startNodeId: string,
    endNodeId: string
  ): { path: string[]; totalWeight: number } => {
    console.log(
      'Запуск алгоритма Дейкстра от',
      getNodeLabeForPath(startNodeId),
      'до',
      getNodeLabeForPath(endNodeId)
    );

    // Типизация для хранения расстояний и предыдущих узлов
    const distances: Record<string, number> = {};
    const previous: Record<string, string | null> = {};
    const unvisitedNodes = new Set<string>();

    // Инициализация расстояний и непосещённых узлов
    nodes.forEach((node) => {
      distances[node.id] = Infinity; // Расстояние пока бесконечность (узел недостижим)
      previous[node.id] = null; // Предыдущий узел для каждого узла как null
      unvisitedNodes.add(node.id); // Добавляем узел в множество непосещённых
    });

    distances[startNodeId] = 0; // Устанавливаем начальное расстояние для стартового узла

    const labeledDistances = Object.fromEntries(
      Object.entries(distances).map(([id, dist]) => [getNodeLabeForPath(id), dist])
    );
    console.log('Инициализированные расстояния:', labeledDistances);

    while (unvisitedNodes.size > 0) {
      // Находим узел с минимальным расстоянием среди непосещенных
      const currentNodeId = Array.from(unvisitedNodes).reduce(
        (minNode, nodeId) => (distances[nodeId] < distances[minNode] ? nodeId : minNode),
        Array.from(unvisitedNodes)[0]
      );

      console.log(
        'Текущий узел:',
        getNodeLabeForPath(currentNodeId),
        'с расстоянием:',
        distances[currentNodeId]
      );

      // Если текущий узел — конечный, заканчиваем цикл
      if (currentNodeId === endNodeId) {
        break;
      }

      // Удаляем текущий узел из множества непосещённых
      unvisitedNodes.delete(currentNodeId);

      // Итерируем по всем рёбрам, которые исходят из текущего узла
      edges
        .filter((edge) => edge.source === currentNodeId)
        .forEach((edge) => {
          const alt = distances[currentNodeId] + parseFloat(edge.label as string);
          console.log(
            'Рассматриваем ребро',
            getNodeLabeForPath(edge.source),
            '→',
            getNodeLabeForPath(edge.target),
            'с весом',
            edge.label
          );
          if (alt < distances[edge.target]) {
            distances[edge.target] = alt; // Обновляем расстояние до узла
            previous[edge.target] = currentNodeId; // Обновляем предыдущий узел
            console.log('Обновляем расстояние для', getNodeLabeForPath(edge.target), 'до', alt);
          }
        });
    }

    // Восстанавливаем путь от конечного узла до начального
    const path: string[] = [];
    let currentNodeId = endNodeId;
    let totalWeight = 0; // Общий вес пути

    while (previous[currentNodeId]) {
      path.unshift(currentNodeId);
      const edge = edges.find(
        (edge) => edge.source === previous[currentNodeId] && edge.target === currentNodeId
      );
      // Преобразуем label в число для расчета общего веса
      const weight = edge ? parseFloat(String(edge.label)) : 0;
      totalWeight += weight;

      currentNodeId = previous[currentNodeId]!;
    }

    if (currentNodeId === startNodeId) {
      path.unshift(startNodeId);
    }

    console.log(
      'Кратчайший путь:',
      path.map((nodeId) => getNodeLabeForPath(nodeId)).join(' → '),
      'с общим весом:',
      totalWeight
    );
    if (path.length === 0) {
      alert('Невозможно построить маршрут по этим нодам');
    }
    highlightPathEdges(path);

    return { path, totalWeight };
  };

  return { findShortestPath, getNodeLabeForPath };
};
