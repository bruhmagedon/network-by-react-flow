// Navbar.tsx
import { useDispatch, useSelector } from 'react-redux';
import { useNode } from '@/hooks/useNode';
import { useDijkstra } from '@/hooks/useDijkstra';
import { Button } from '@/components/ui/button';
import { Panel } from '@xyflow/react';
import { StateSchema } from '@/app/store/StateSchema';
import TableDrawer from './Drawer/Drawer';
import { nodeActions } from '@/features/node';
import { getNodeLabelById } from '@/features/node/model/nodeSlice';
import { useHighlightEdges } from '@/hooks/useHighlightEdges';

export const Navbar = () => {
  const dispatch = useDispatch();
  const { addNode } = useNode();
  const { findShortestPath } = useDijkstra();
  const { resetPathEdges } = useHighlightEdges();

  const startNodeId = useSelector(
    (state: StateSchema) => state.nodes.selectedNodesForPath.startNodeId
  );
  const endNodeId = useSelector((state: StateSchema) => state.nodes.selectedNodesForPath.endNodeId);

  const startNodeLabel = useSelector((state: StateSchema) => getNodeLabelById(state, startNodeId));
  const endNodeLabel = useSelector((state: StateSchema) => getNodeLabelById(state, endNodeId));

  const handleFindPath = () => {
    if (startNodeId && endNodeId) {
      findShortestPath(startNodeId, endNodeId);
    }
  };

  const handleResetPath = () => {
    resetPathEdges();
    dispatch(nodeActions.resetPathSelection());
  };

  return (
    <Panel
      position='bottom-center'
      className='bg-[#2c2c2c]/80 p-4 rounded-lg flex items-center gap-3'
    >
      <Button size='sm' onClick={addNode}>
        Добавить узел
      </Button>
      <TableDrawer />
      <div className='flex flex-col gap-1'>
        <Button size='sm' onClick={handleFindPath} disabled={!startNodeId || !endNodeId}>
          Найти кратчайший маршрут
        </Button>
        {(startNodeId || endNodeId) && (
          <Button size='sm' variant='destructive' onClick={handleResetPath}>
            Сброс маршрута
          </Button>
        )}
      </div>

      <div className='flex gap-5'>
        <div className='text-sm bg-white p-2 rounded-lg w-[150px] h-[68px]'>
          <span className='text-gray-400'>Начало маршрута:</span> <br />
          {startNodeLabel || 'не выбрано'}
        </div>
        <div className='text-sm bg-white p-2 rounded-lg w-[150px]'>
          <span className='text-gray-400'>Конец маршрута:</span> <br />
          {endNodeLabel || 'не выбрано'}
        </div>
      </div>
    </Panel>
  );
};
