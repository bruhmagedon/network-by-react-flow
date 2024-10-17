// Navbar.tsx
import { useDispatch, useSelector } from 'react-redux';
import { useNode } from '@/hooks/useNode';
import { useDijkstra } from '@/hooks/useDijkstra';
import { useFloyd } from '@/hooks/useFloyd';
import { Button } from '@/components/ui/button';
import { Node, Panel } from '@xyflow/react';
import { StateSchema } from '@/app/store/StateSchema';
import TableDrawer from './Drawer/Drawer';
import { nodeActions } from '@/features/node';
import { getNodeLabelById } from '@/features/node/model/nodeSlice';
import { useHighlightEdges } from '@/hooks/useHighlightEdges';
import { useState } from 'react';
import { edgeActions } from '@/features/edge';
import { CompareSheet } from './CompareSheet/CompareSheet';

export const Navbar = () => {
  const dispatch = useDispatch();
  const { addNode } = useNode();
  const { findShortestPath, getNodeLabeForPath } = useDijkstra();
  const { findFloydPath } = useFloyd();
  const { resetPathEdges } = useHighlightEdges();

  const startNodeId = useSelector(
    (state: StateSchema) => state.nodes.selectedNodesForPath.startNodeId
  );
  const endNodeId = useSelector((state: StateSchema) => state.nodes.selectedNodesForPath.endNodeId);

  const startNodeLabel = useSelector((state: StateSchema) => getNodeLabelById(state, startNodeId));
  const endNodeLabel = useSelector((state: StateSchema) => getNodeLabelById(state, endNodeId));

  // State для хранения пути, общего веса и времени выполнения
  const [shortestPath, setShortestPath] = useState<string[]>([]);
  const [totalWeight, setTotalWeight] = useState<number | null>(null);
  const [executionTime, setExecutionTime] = useState<string | null>(null);
  const [isPathActive, setIsPathActive] = useState(false);

  // Обработчик поиска маршрута по Дейкстра
  const handleFindDijkstraPath = () => {
    if (startNodeId && endNodeId) {
      const start = performance.now();
      const { path, totalWeight } = findShortestPath(startNodeId, endNodeId);
      const timeTaken = performance.now() - start;

      setShortestPath(path);
      setIsPathActive(true);
      setTotalWeight(totalWeight);
      if (totalWeight === 0) {
        setExecutionTime(null);
      } else {
        setExecutionTime(`Дейкстра: ${timeTaken.toFixed(2)}ms`);
      }
    }
  };

  // Обработчик поиска маршрута по Флойду
  const handleFindFloydPath = () => {
    if (startNodeId && endNodeId) {
      const start = performance.now();
      const { path, totalWeight } = findFloydPath(startNodeId, endNodeId);
      const timeTaken = performance.now() - start;

      setShortestPath(path);
      setIsPathActive(true);
      setTotalWeight(totalWeight);
      if (totalWeight === 0) {
        setExecutionTime(null);
      } else {
        setExecutionTime(`Флойд: ${timeTaken.toFixed(2)}ms`);
      }
    }
  };

  const handleResetPath = () => {
    resetPathEdges();
    dispatch(nodeActions.resetPathSelection());
    setShortestPath([]); // Сбрасываем путь
    setTotalWeight(null); // Сбрасываем вес
    setExecutionTime(null); // Сбрасываем время выполнения
    setIsPathActive(false);
  };

  const handleSaveGraph = () => {
    handleResetPath();
    const nodes = JSON.parse(localStorage.getItem('graphNodes') || '[]');
    const edges = JSON.parse(localStorage.getItem('graphEdges') || '[]');

    const graph = {
      nodes: nodes,
      edges: edges
    };

    const blob = new Blob([JSON.stringify(graph, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph.json';

    a.click();

    URL.revokeObjectURL(url);
    alert('Граф успешно сохранен!');
  };

  const handleLoadGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleResetPath();
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const graph = JSON.parse(content);

        if (!Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
          throw new Error("Файл имеет неверную структуру. Ожидаются массивы 'nodes' и 'edges'.");
        }

        const nodesWithPosition = graph.nodes.map((node: Node) => ({
          ...node,
          position: node.position || { x: 0, y: 0 }
        }));

        localStorage.setItem('graphNodes', JSON.stringify(nodesWithPosition));
        localStorage.setItem('graphEdges', JSON.stringify(graph.edges));

        dispatch(nodeActions.setNodes(nodesWithPosition));
        dispatch(edgeActions.setEdges(graph.edges));

        alert('Граф успешно загружен!');
      } catch (error) {
        const err = error as Error;
        console.error('Ошибка при загрузке графа:', err.message);
        alert('Не удалось загрузить граф. Проверьте файл на корректность.');
      }
    };

    reader.readAsText(file);
  };

  return (
    <Panel
      position='bottom-center'
      className='bg-[#2c2c2c]/80 p-4 rounded-lg flex items-center gap-3'
    >
      <div className='flex flex-col gap-3'>
        <Button disabled={isPathActive} onClick={addNode}>
          Добавить узел
        </Button>
        <TableDrawer disabled={isPathActive} />
      </div>

      <div className='flex flex-col gap-3'>
        <Button
          onClick={handleFindDijkstraPath}
          disabled={isPathActive || !startNodeId || !endNodeId}
        >
          Найти маршрут по Дейкстра
        </Button>
        <Button onClick={handleFindFloydPath} disabled={isPathActive || !startNodeId || !endNodeId}>
          Найти маршрут по Флойду
        </Button>
      </div>
      <div className='flex flex-col gap-3'>
        <Button
          variant='destructive'
          disabled={!startNodeId && !endNodeId}
          onClick={handleResetPath}
        >
          Сброс маршрута
        </Button>
        <CompareSheet disabled={isPathActive} />
      </div>

      {/* Кнопки для нового функционала */}
      <div className='flex flex-col gap-3'>
        <Button>
          <label>
            Загрузить граф
            <input
              type='file'
              accept='.json'
              onChange={handleLoadGraph}
              style={{ display: 'none' }}
            />
          </label>
        </Button>

        <Button className='bg-green-400 hover:bg-green-500' onClick={handleSaveGraph}>
          Сохранить граф
        </Button>
      </div>

      <div className='flex flex-col gap-3 min-w-[400px]'>
        <div className='flex gap-3 '>
          <div className='text-sm bg-white p-1 rounded-lg w-[50%] h-full'>
            <span className='text-gray-400'>Начало маршрута:</span> <br />
            <span className='font-medium'>{startNodeLabel || 'не выбрано'}</span>
          </div>
          <div className='text-sm bg-white p-1 rounded-lg w-[50%] h-full'>
            <span className='text-gray-400'>Конец маршрута:</span> <br />
            <span className='font-medium'>{endNodeLabel || 'не выбрано'}</span>
          </div>
        </div>
        <div className='flex gap-3'>
          <div className='text-sm bg-white p-2 rounded-lg flex-1'>
            <span className='text-gray-400'>Путь:</span>{' '}
            {shortestPath.length > 0
              ? shortestPath.map((nodeId) => getNodeLabeForPath(nodeId)).join(' → ')
              : 'Маршрут не найден'}{' '}
            <br />
            <span className='text-gray-400'>Вес пути: </span>{' '}
            {totalWeight !== null ? totalWeight : 'N/A'}
            <br />
            <div className='flex gap-3'>
              <span className='text-gray-400'>Время выполнения: </span>{' '}
              {executionTime !== null ? (
                <div>
                  {executionTime.includes('Дейкстра') && (
                    <div className='relative inline-block'>
                      {executionTime.split(',')[0]} {/* Время Дейкстры */}
                      <div className='absolute left-0 w-full h-[2px] mt-1 animate-dash-blue'></div>{' '}
                      {/* Синие подчеркивание */}
                    </div>
                  )}
                  {executionTime.includes('Флойд') && (
                    <div className='relative inline-block'>
                      {executionTime.split(',')[0]} {/* Время Флойда */}
                      <div className='absolute left-0 w-full h-[2px] mt-1 animate-dash-red'></div>{' '}
                      {/* Красное подчеркивание */}
                    </div>
                  )}
                </div>
              ) : (
                'N/A'
              )}
            </div>
          </div>
        </div>
      </div>
    </Panel>
  );
};
