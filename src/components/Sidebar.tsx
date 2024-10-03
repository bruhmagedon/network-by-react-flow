import { useState, useCallback, useEffect } from 'react';
import { useNode } from '@/hooks/useNode';
import { useEdge } from '@/hooks/useEdge';
import { useSelector } from 'react-redux';
import { getSelectedNode, getNodes } from '@/features/node/selectors/getNodes';
import { getEdges, getSelectedEdge } from '@/features/edge/selectors/getEdges';
import { Edge, Panel } from '@xyflow/react';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';
import { Button } from './ui/button';

const Sidebar = () => {
  const { deleteNode, updateNodeLabel, onNodeClick } = useNode();
  const { deleteEdge, updateEdgeLabel } = useEdge();

  const selectedNode = useSelector(getSelectedNode);
  const selectedEdge = useSelector(getSelectedEdge);

  const edges = useSelector(getEdges);
  const nodes = useSelector(getNodes);

  const [newLabel, setNewLabel] = useState('');
  const [weights, setWeights] = useState<{ [key: string]: string }>({}); // Храним вес для каждой дуги

  // Обновление состояния весов при выборе новой дуги
  useEffect(() => {
    if (selectedEdge) {
      const initialWeights = edges.reduce(
        (acc, edge) => {
          acc[edge.id] = edge.label as string;
          return acc;
        },
        {} as { [key: string]: string }
      );
      setWeights(initialWeights);
    }
  }, [selectedEdge, edges]);

  // Хелпер для получения названия ноды по ID
  const getNodeLabelById = useCallback(
    (id: string) => {
      const node = nodes.find((n) => n.id === id);
      return node?.data.label || `Node ${id}`;
    },
    [nodes]
  );

  // Валидация для веса дуги (положительные веса)
  const isValidWeight = (value: string) => {
    const num = Number(value);
    return !isNaN(num) && num > 0;
  };

  const handleUpdateWeight = (id: string) => {
    const weight = weights[id];
    if (isValidWeight(weight)) {
      updateEdgeLabel(id, weight);
      setWeights((prev) => ({ ...prev, [id]: '' })); // Сбрасываем поле после изменения для этой дуги
    } else {
      alert('Введите положительное число больше 0');
    }
  };

  const handleWeightChange = (id: string, value: string) => {
    setWeights((prev) => ({ ...prev, [id]: value }));
  };

  // Контент для выбранной ноды
  const renderNodeContent = () => (
    <div className='flex flex-col gap-4'>
      <div className=''>
        ID ноды: <span className='text-sm text-gray-400'> {selectedNode?.id}</span>
      </div>
      <div className=''>Название: {selectedNode?.data.label as string}</div>
      <Input
        type='text'
        value={newLabel}
        onChange={(e) => setNewLabel(e.target.value)}
        placeholder='Новое название'
      />
      {selectedNode && (
        <>
          <Button
            onClick={() => {
              updateNodeLabel(selectedNode.id, newLabel);
              setNewLabel('');
            }}
            size='sm'
            disabled={newLabel === ''}
            className='w-full'
          >
            Изменить название
          </Button>

          <Button
            onClick={() => deleteNode(selectedNode.id)}
            variant={'destructive'}
            className='w-full'
          >
            Удалить ноду
          </Button>
        </>
      )}
    </div>
  );

  // Контент для выбранной дуги (и двусторонних дуг)
  const renderEdgeContent = (edge: Edge) => (
    <div key={edge.id} className='mb-4 flex flex-col gap-4'>
      <div className=''>
        ID дуги: <br />
        <span className='text-sm text-gray-400'>{edge.id}</span>
      </div>
      <div className=''>
        Вершины: <br />
        <span className='text-sm text-gray-400'>
          <Button
            variant='link'
            onClick={() => onNodeClick(edge.source)}
            className='text-blue-500 underline'
          >
            {getNodeLabelById(edge.source)}
          </Button>{' '}
          →{' '}
          <Button
            variant='link'
            onClick={() => onNodeClick(edge.target)}
            className='text-blue-500 underline'
          >
            {getNodeLabelById(edge.target)}
          </Button>
        </span>
      </div>

      {/* Отображение текущего веса */}
      <div className='text-sm'>
        Текущий вес: <span className='font-bold'>{edge.label}</span>
      </div>

      <Input
        type='number'
        value={weights[edge.id] || ''} // Используем пустую строку вместо undefined
        onChange={(e) => handleWeightChange(edge.id, e.target.value)} // Изменяем вес для конкретной дуги
        placeholder='Новый вес дуги'
      />
      <Button onClick={() => handleUpdateWeight(edge.id)} size='sm' className='w-full mt-2'>
        Изменить вес
      </Button>
      <Button onClick={() => deleteEdge(edge.id)} variant={'destructive'} className='w-full'>
        Удалить дугу
      </Button>
    </div>
  );

  // Унифицированный контент
  const renderContent = () => {
    if (selectedNode) {
      return renderNodeContent();
    }

    if (selectedEdge) {
      const relatedEdges = edges.filter(
        (edge: Edge) =>
          (edge.source === selectedEdge.source && edge.target === selectedEdge.target) ||
          (edge.source === selectedEdge.target && edge.target === selectedEdge.source)
      );

      return relatedEdges.map((edge: Edge) => renderEdgeContent(edge));
    }

    return <div className='p-4 text-center'>Выберите узел или дугу</div>;
  };

  return (
    <Panel
      position='top-left'
      style={{ margin: '0px', marginRight: '' }}
      className='w-[250px] h-full py-8 pl-8 flex flex-col items-center text-black font-medium'
    >
      <div
        className={cn(
          'h-full bg-white rounded-lg w-full border border-border shadow-lg p-3 overflow-auto'
        )}
      >
        {renderContent()}
      </div>
    </Panel>
  );
};

export default Sidebar;
