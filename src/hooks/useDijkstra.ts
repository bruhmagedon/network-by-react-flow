// useDijkstra.ts
import { useSelector } from 'react-redux';
import { getEdges } from '@/features/edge';
import { Node, Edge } from '@xyflow/react';
import { getNodes } from '@/features/node';
import { useHighlightEdges } from './useHighlightEdges';

export type debugPairs = { path: string[]; totalWeight: number; debugString: string }[];

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
    endNodeId: string,
    isDebug?: boolean
  ): { path: string[]; totalWeight: number; debugString: string } => {
    if (!isDebug) {
      // console.log(
      //   'Запуск алгоритма Дейкстра от',
      //   getNodeLabeForPath(startNodeId),
      //   'до',
      //   getNodeLabeForPath(endNodeId)
      // );
    } else {
      // console.log(
      //   'DEBUG: Запуск алгоритма Дейкстра от',
      //   getNodeLabeForPath(startNodeId),
      //   'до',
      //   getNodeLabeForPath(endNodeId)
      // );
    }

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

    while (unvisitedNodes.size > 0) {
      // Находим узел с минимальным расстоянием среди непосещенных
      const currentNodeId = Array.from(unvisitedNodes).reduce(
        (minNode, nodeId) => (distances[nodeId] < distances[minNode] ? nodeId : minNode),
        Array.from(unvisitedNodes)[0]
      );

      if (currentNodeId === endNodeId) {
        break;
      }

      unvisitedNodes.delete(currentNodeId);

      edges
        .filter((edge) => edge.source === currentNodeId)
        .forEach((edge) => {
          const alt = distances[currentNodeId] + parseFloat(edge.label as string);
          if (alt < distances[edge.target]) {
            distances[edge.target] = alt;
            previous[edge.target] = currentNodeId;
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

    if (path.length === 0) {
      if (isDebug) {
        // console.log(
        //   `Невозможно построить маршрут по этим нодам: от ${getNodeLabeForPath(startNodeId)} до ${getNodeLabeForPath(endNodeId)}`
        // );
        return {
          path: [],
          totalWeight: 0,
          debugString: `Невозможно построить маршрут по этим нодам: от ${getNodeLabeForPath(startNodeId)} до ${getNodeLabeForPath(endNodeId)}`
        };
      }
      alert('Невозможно построить маршрут по этим нодам');
      return { path: [], totalWeight: 0, debugString: '' };
    }

    const debugFinal = `Кратчайший путь от ${getNodeLabeForPath(startNodeId)} до ${getNodeLabeForPath(endNodeId)} : ${path.map((nodeId) => getNodeLabeForPath(nodeId)).join(' → ')} с общим весом: ${totalWeight}`;
    // console.log(debugFinal);

    if (!isDebug) {
      highlightPathEdges(path, 'dijkstra');
    }

    return { path, totalWeight, debugString: debugFinal };
  };

  const findAllPairsDijkstra = (): debugPairs[] => {
    const allPairsPaths: debugPairs[] = [];
    nodes.forEach((startNode) => {
      const row: debugPairs = [];
      nodes.forEach((endNode) => {
        if (startNode.id !== endNode.id) {
          const result = findShortestPath(startNode.id, endNode.id, true);
          row.push(result);
        }
      });
      allPairsPaths.push(row);
    });

    // console.log(JSON.stringify(allPairsPaths));
    return allPairsPaths;
  };

  return { findShortestPath, getNodeLabeForPath, findAllPairsDijkstra };
};
