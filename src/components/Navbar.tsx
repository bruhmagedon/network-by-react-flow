// Navbar.tsx
import { useDispatch, useSelector } from 'react-redux';
import { useNode } from '@/hooks/useNode';
import { useDijkstra } from '@/hooks/useDijkstra';
import { Button } from '@/components/ui/button';
import { Node, Panel } from '@xyflow/react';
import { StateSchema } from '@/app/store/StateSchema';
import TableDrawer from './Drawer/Drawer';
import { nodeActions } from '@/features/node';
import { getNodeLabelById } from '@/features/node/model/nodeSlice';
import { useHighlightEdges } from '@/hooks/useHighlightEdges';
import { useState } from 'react';
import { edgeActions } from '@/features/edge';

export const Navbar = () => {
  const dispatch = useDispatch();
  const { addNode } = useNode();
  const { findShortestPath, getNodeLabeForPath } = useDijkstra();
  const { resetPathEdges } = useHighlightEdges();

  const startNodeId = useSelector(
    (state: StateSchema) => state.nodes.selectedNodesForPath.startNodeId
  );
  const endNodeId = useSelector((state: StateSchema) => state.nodes.selectedNodesForPath.endNodeId);

  const startNodeLabel = useSelector((state: StateSchema) => getNodeLabelById(state, startNodeId));
  const endNodeLabel = useSelector((state: StateSchema) => getNodeLabelById(state, endNodeId));

  // State для хранения пути и общего веса
  const [shortestPath, setShortestPath] = useState<string[]>([]);
  const [totalWeight, setTotalWeight] = useState<number | null>(null);

  const handleFindPath = () => {
    if (startNodeId && endNodeId) {
      const { path, totalWeight } = findShortestPath(startNodeId, endNodeId);
      setShortestPath(path); // Устанавливаем найденный путь
      setTotalWeight(totalWeight); // Устанавливаем общий вес
    }
  };

  const handleResetPath = () => {
    resetPathEdges();
    dispatch(nodeActions.resetPathSelection());
    setShortestPath([]); // Сбрасываем путь
    setTotalWeight(null); // Сбрасываем вес
  };

  const handleSaveGraph = () => {
    const nodes = JSON.parse(localStorage.getItem('graphNodes') || '[]');
    const edges = JSON.parse(localStorage.getItem('graphEdges') || '[]');

    const graph = {
      nodes: nodes,
      edges: edges
    };

    // Создаем элемент input для выбора имени и места сохранения файла
    const blob = new Blob([JSON.stringify(graph, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    // Создаем элемент ссылки для сохранения
    const a = document.createElement('a');
    a.href = url;
    a.download = 'graph.json'; // Имя файла по умолчанию

    // Программный клик по ссылке
    a.click();

    // Освобождаем память
    URL.revokeObjectURL(url);
    alert('Граф успешно сохранен!');
  };

  const handleLoadGraph = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const graph = JSON.parse(content);

        console.log(graph);

        // Проверка структуры файла
        if (!Array.isArray(graph.nodes) || !Array.isArray(graph.edges)) {
          throw new Error("Файл имеет неверную структуру. Ожидаются массивы 'nodes' и 'edges'.");
        }

        // Проверка позиции узлов
        const nodesWithPosition = graph.nodes.map((node: Node) => ({
          ...node,
          position: node.position || { x: 0, y: 0 } // Устанавливаем позицию по умолчанию, если отсутствует
        }));

        // Обновляем localStorage
        localStorage.setItem('graphNodes', JSON.stringify(nodesWithPosition));
        localStorage.setItem('graphEdges', JSON.stringify(graph.edges));

        // Обновляем ReduxStore
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
        <Button onClick={addNode}>Добавить узел</Button>
        <TableDrawer />
      </div>
      <div className='flex flex-col gap-3'>
        <Button onClick={handleFindPath} disabled={!startNodeId || !endNodeId}>
          Найти кратчайший маршрут
        </Button>
        {(startNodeId || endNodeId) && (
          <Button variant='destructive' onClick={handleResetPath}>
            Сброс маршрута
          </Button>
        )}
      </div>
      {/* Кнопки для нового функционала */}
      <div className='flex flex-col gap-3'>
        {/* Кнопка загрузки графа */}
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

        {/* Кнопка сохранения графа */}
        <Button className='bg-green-400 hover:bg-green-500' onClick={handleSaveGraph}>
          Сохранить граф
        </Button>
      </div>
      <div className='flex flex-col gap-3 '>
        <div className='flex gap-3 '>
          <div className='text-sm bg-white p-1 rounded-lg w-[150px] h-full'>
            <span className='text-gray-400'>Начало маршрута:</span> <br />
            {startNodeLabel || 'не выбрано'}
          </div>
          <div className='text-sm bg-white p-1 rounded-lg w-[150px] h-full'>
            <span className='text-gray-400'>Конец маршрута:</span> <br />
            {endNodeLabel || 'не выбрано'}
          </div>
        </div>
        <div className='text-sm bg-white p-2 rounded-lg flex-1'>
          <span className='text-gray-400'>Путь:</span>{' '}
          {shortestPath.length > 0
            ? shortestPath.map((nodeId) => getNodeLabeForPath(nodeId)).join(' → ')
            : 'Маршрут не найден'}{' '}
          <br />
          <span className='text-gray-400'>Вес пути: </span>{' '}
          {totalWeight !== null ? totalWeight : 'N/A'}
        </div>
      </div>
    </Panel>
  );
};
