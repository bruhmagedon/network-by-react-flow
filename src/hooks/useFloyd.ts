import { getEdges } from '@/features/edge';
import { getNodes } from '@/features/node';
import { Edge, Node } from '@xyflow/react';
import { useSelector } from 'react-redux';
import { useHighlightEdges } from './useHighlightEdges';

export const useFloyd = () => {
  const nodes: Node[] = useSelector(getNodes);
  const edges: Edge[] = useSelector(getEdges);
  const { highlightPathEdges } = useHighlightEdges();

  const getNodeLabeForPath = (nodeId: string) => {
    if (nodeId === 'Null') {
      return 'Null';
    }
    const node = nodes.find((node) => node.id === nodeId);
    return (node?.data.label as string) || nodeId; // Если узел не найден, возвращаем ID
  };

  // возвращает матрицу кратчайших расстояний между всеми узлами графа (distances),
  //  матрицу путей (next),
  const floydWarshall = (): { distances: number[][]; next: string[][]; debugString: string } => {
    const nodeCount = nodes.length; //nodeCount: Считаем количество узлов в графе.
    // Инициализируем матрицу кратчайших расстояний.
    // Изначально все значения равны бесконечности (кроме расстояний от узла до самого себя, которые позже станут нулями)
    const distances = Array(nodeCount)
      .fill(null)
      .map(() => Array(nodeCount).fill(Infinity)); //матрица из Infinity
    // Инициализируем матрицу путей, которая будет хранить информацию о предыдущих узлах на пути от одного узла к другому.
    const next = Array(nodeCount)
      .fill(null)
      .map(() => Array(nodeCount).fill(null)); //матрица из null
    let debugLog = '';

    // Инициализация диагональных элементов: Для каждого узла графа расстояние от него до самого себя устанавливаем в 0,
    // а путь из узла в него самого равен его ID. Это выполняется для того, чтобы корректно обработать петли (если они есть).
    nodes.forEach((node, i) => {
      distances[i][i] = 0;
      next[i][i] = node.id;
    });

    edges.forEach((edge) => {
      // Для каждого ребра мы находим индексы исходного и целевого узла.
      const sourceIndex = nodes.findIndex((n) => n.id === edge.source);
      const targetIndex = nodes.findIndex((n) => n.id === edge.target);
      const weight = parseFloat(edge.label as string);
      // Затем обновляем матрицу расстояний на основе весов рёбер и устанавливаем информацию о следующем узле на пути в матрицу путей.
      distances[sourceIndex][targetIndex] = weight;
      next[sourceIndex][targetIndex] = nodes[targetIndex].id;
    });

    const debugNext = next.map((row) => row.map((cell) => (cell === null ? 'Null' : cell)));

    // console.log(
    //   'Инициализированные матрицы: \n',
    //   `Матрица расстояний: \n${distances.map((row) => row.join(' ')).join('\n')}\n\n`,
    //   `Матрица путей:\n${debugNext.map((row) => Array.from(row).map((item) => getNodeLabeForPath(item))).join(' \n')}\n`
    // );
    debugLog += 'Инициализированные матрицы: \n';
    debugLog += `Матрица расстояний: ${JSON.stringify(distances)}\n`;
    debugLog += `Матрица путей: ${JSON.stringify(next)}\n`;

    //  Этот цикл перебирает все возможные комбинации узлов и проверяет, можно ли улучшить путь между двумя узлами через третий узел.
    for (let k = 0; k < nodeCount; k++) {
      // Этот цикл перебирает все узлы графа.
      //  Узел с индексом k проверяется как возможный промежуточный узел на пути между всеми другими парами узлов.
      //  Мы используем его как посредника, через которого могут пройти пути между узлами i и j
      for (let i = 0; i < nodeCount; i++) {
        // Этот цикл перебирает все возможные исходные узлы 𝑖
        // Для каждого узла 𝑖 мы проверяем, возможно ли улучшить путь до целевого узла j через промежуточный узел 𝑘
        for (let j = 0; j < nodeCount; j++) {
          // Этот цикл перебирает все возможные целевые узлы j. Для каждой пары узлов i и j, мы проверяем, можем ли улучшить их путь через узел k
          // console.log(distances[i][j], distances[i][k] + distances[k][j]);
          if (distances[i][j] > distances[i][k] + distances[k][j]) {
            // Мы проверяем, можно ли сократить путь от узла i до узла j через узел k.
            distances[i][j] = distances[i][k] + distances[k][j];
            // Нашли более короткий путь через k
            next[i][j] = next[i][k];
            // Обновим этот путь
            // console.log(
            //   `Обновляем путь для пар (${nodes[i].data.label}, ${nodes[j].data.label}): через ${nodes[k].data.label} с весом ${distances[i][j]}\n`
            // );
          }
        }
      }
    }

    return { distances, next, debugString: debugLog };
  };

  const findFloydPath = (
    startNodeId: string,
    endNodeId: string
  ): { path: string[]; totalWeight: number; debugString: string } => {
    const { distances, next, debugString } = floydWarshall();
    const startIndex = nodes.findIndex((node) => node.id === startNodeId);
    const endIndex = nodes.findIndex((node) => node.id === endNodeId);

    const path = [];
    let currentIndex = startIndex;

    if (next[startIndex][endIndex] === null) {
      alert('Невозможно построить маршрут по этим нодам');
      return { path: [], totalWeight: 0, debugString: 'Маршрут не найден.' };
    }

    while (currentIndex !== endIndex) {
      path.push(nodes[currentIndex].id);
      currentIndex = nodes.findIndex((n) => n.id === next[currentIndex][endIndex]);
    }
    path.push(endNodeId);

    highlightPathEdges(path, 'floyd'); // Подсвечиваем путь красным

    const finalDebug = `Кратчайший путь от ${nodes[startIndex].data.label} до ${nodes[endIndex].data.label}: ${path.map((nodeId) => nodes.find((n) => n.id === nodeId)?.data.label).join(' → ')} с общим весом: ${distances[startIndex][endIndex]}`;
    // console.log(finalDebug);

    return {
      path,
      totalWeight: distances[startIndex][endIndex],
      debugString: `${debugString}\n${finalDebug}`
    };
  };

  return { findFloydPath, floydWarshall };
};
