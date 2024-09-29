import { StateSchema } from '@/app/store/StateSchema';
import { useGraphs } from '@/hooks/useGraphs';
import { Panel } from '@xyflow/react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export const Sidebar = () => {
  const { deleteNode, updateNodeLabel } = useGraphs();
  const selectedNode = useSelector((state: StateSchema) => state.nodes.selectedNode);

  const [newLabel, setNewLabel] = useState('');

  if (!selectedNode) {
    return (
      <Panel
        position='top-right'
        className='w-[15%] h-[80%] bg-[#2c2c2c]/80 p-8 rounded-2xl flex flex-col items-center gap-10'
      >
        <div className='text-white'>Выберите узел</div>
      </Panel>
    );
  }

  const handleDeleteNode = () => {
    deleteNode(selectedNode.id);
  };

  const handleUpdateLabel = () => {
    updateNodeLabel(selectedNode.id, newLabel);
    setNewLabel('');
  };

  // TODO сбрасывать селект при нажатии на flow
  return (
    <Panel
      position='top-right'
      className='w-[15%] h-[80%] bg-[#2c2c2c]/80 p-8 rounded-2xl flex flex-col items-center gap-10'
    >
      <div className='text-white'>ID: {selectedNode.id}</div>
      <div className='text-white'>Название: {selectedNode.data.label as string}</div>

      {/* TODO валидация (нельзя пустое название) */}
      {/* Поле для изменения названия узла */}
      <input
        type='text'
        value={newLabel}
        onChange={(e) => setNewLabel(e.target.value)}
        placeholder='Новое название'
        className='p-2 rounded'
      />
      <button onClick={handleUpdateLabel} className='bg-yellow-500 text-black p-2 rounded'>
        Изменить название
      </button>

      {/* Кнопка для удаления узла */}
      <button onClick={handleDeleteNode} className='bg-red-500 text-white p-2 rounded'>
        Удалить узел
      </button>
    </Panel>
  );
};
