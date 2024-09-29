import { StateSchema } from '@/app/store/StateSchema';
import { useEdge } from '@/hooks/useEdge';
import { useNode } from '@/hooks/useNode';
import { Panel } from '@xyflow/react';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export const Sidebar = () => {
  const { deleteNode, updateNodeLabel } = useNode();
  const { deleteEdge, updateEdgeLabel } = useEdge();

  const selectedNode = useSelector((state: StateSchema) => state.nodes.selectedNode);
  const selectedEdge = useSelector((state: StateSchema) => state.edges.selectedEdge);

  const [newLabel, setNewLabel] = useState('');

  if (!selectedNode && !selectedEdge) {
    return (
      <Panel
        position='top-right'
        className='w-[15%] h-[80%] bg-[#2c2c2c]/80 p-8 rounded-2xl flex flex-col items-center gap-10'
      >
        <div className='text-white'>Выберите узел или дугу</div>
      </Panel>
    );
  }

  const handleUpdateLabel = () => {
    if (selectedNode) {
      updateNodeLabel(selectedNode.id, newLabel);
    } else if (selectedEdge) {
      updateEdgeLabel(selectedEdge.id, newLabel);
    }
    setNewLabel('');
  };

  const handleDelete = () => {
    if (selectedNode) {
      deleteNode(selectedNode.id);
    } else if (selectedEdge) {
      deleteEdge(selectedEdge.id);
    }
  };

  return (
    <Panel
      position='top-right'
      className='w-[15%] h-[80%] bg-[#2c2c2c]/80 p-8 rounded-2xl flex flex-col items-center gap-10'
    >
      {selectedNode && (
        <>
          <div className='text-white'>ID ноды: {selectedNode.id}</div>
          <div className='text-white'>Название: {selectedNode.data.label as string}</div>
        </>
      )}
      {selectedEdge && (
        <>
          <div className='text-white'>ID дуги: {selectedEdge.id}</div>
          <div className='text-white'>
            Вершины: {selectedEdge.source} → {selectedEdge.target}
          </div>
        </>
      )}

      <input
        type='text'
        value={newLabel}
        onChange={(e) => setNewLabel(e.target.value)}
        placeholder='Новое название'
        className='p-2 rounded'
      />
      <button onClick={handleUpdateLabel} className='bg-yellow-500 text-black p-2 rounded'>
        Изменить
      </button>
      <button onClick={handleDelete} className='bg-red-500 text-white p-2 rounded'>
        Удалить
      </button>
    </Panel>
  );
};
