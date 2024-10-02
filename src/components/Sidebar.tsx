import { getSelectedEdge } from '@/features/edge/selectors/getEdges';
import { getSelectedNode } from '@/features/node/selectors/getNodes';
import { useEdge } from '@/hooks/useEdge';
import { useNode } from '@/hooks/useNode';
import { Panel } from '@xyflow/react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button } from './ui/button';
import { PanelRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

export const Sidebar = () => {
  const { deleteNode, updateNodeLabel } = useNode();
  const { deleteEdge, updateEdgeLabel } = useEdge();

  const selectedNode = useSelector(getSelectedNode);
  const selectedEdge = useSelector(getSelectedEdge);

  const [collapse, setCollapse] = useState(true);
  const [newLabel, setNewLabel] = useState('');

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

  //TODO вести useState активная дуга или нода, чтоб потом под это интерфейс подстраивать
  return (
    <Panel
      position='top-left'
      style={{ margin: '0px', marginRight: '' }}
      className='w-[200px] h-full py-8 pl-8 flex flex-col items-center text-black font-medium'
    >
      <div className={cn(collapse ? 'h-[52px]' : 'h-full', 'bg-white rounded-lg w-full border border-border shadow-lg flex items-center relative p-3')}>
        <div className='absolute top-2 right-2'><Button size="icon" variant='default' onClick={() => setCollapse(!collapse)}><PanelRight /></Button></div>
        {!collapse && <div>
          {!selectedNode && !selectedEdge ?
            <div className='p-4 text-center'>Выберите узел или дугу</div> :
            <div className='flex flex-col gap-5'>
              {selectedNode && (
                <>
                  <div className=''>ID ноды: {selectedNode.id}</div>
                  <div className=''>Название: {selectedNode.data.label as string}</div>
                </>
              )}
              {selectedEdge && (
                <>
                  <div className=''>ID дуги: <br /><span className='text-sm text-gray-400'>{selectedEdge.id}</span></div>
                  <div className=''>
                    Вершины: <br /><span className='text-sm text-gray-400'>{selectedEdge.source} → {selectedEdge.target}</span>
                  </div>
                </>
              )}
              <Input
                type='text'
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder='Новое название'
              />

              <Button onClick={handleUpdateLabel} variant={'outline'} size="sm" disabled={newLabel === ''} className='w-full'>
                Изменить
              </Button>
              <Button onClick={handleDelete} variant={'destructive'} className='w-full'>
                Удалить
              </Button>
            </div>}
        </div>}
      </div>
    </Panel >
  );
}



