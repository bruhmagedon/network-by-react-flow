// CustomNode.tsx
import { cn } from '@/lib/utils';
import { NodeProps, Handle, Position, NodeToolbar } from '@xyflow/react';
import { useDispatch, useSelector } from 'react-redux';
import { getSelectedNode } from '../selectors/getNodes';
import { useNode } from '@/hooks/useNode';
import { nodeActions } from '../model/nodeSlice';
import { Button } from '@/components/ui/button';
import { StateSchema } from '@/app/store/StateSchema';

export interface CustomNodeProps extends NodeProps {
  data: {
    label: string;
  };
}

export const CustomNode = ({ id, data }: CustomNodeProps) => {
  const { onNodeClick } = useNode();
  const selectedNode = useSelector(getSelectedNode);
  const { startNodeId, endNodeId } = useSelector(
    (state: StateSchema) => state.nodes.selectedNodesForPath
  );
  const dispatch = useDispatch();
  const isSelected = id === selectedNode?.id;

  const handleSelectNode = () => {
    // Проверяем, выбрано ли уже два узла
    if (!startNodeId || !endNodeId) {
      dispatch(nodeActions.selectNodeForPath(id));
    }
  };

  // Проверка, если уже выбрано два узла
  const isDisabled = Boolean(startNodeId && endNodeId);
  const isPathSelected = id === startNodeId || id === endNodeId;

  return (
    <div className={`relative`}>
      <NodeToolbar>
        <Button size='sm' onClick={handleSelectNode} disabled={isDisabled}>
          Метка
        </Button>
      </NodeToolbar>
      <div
        className={cn(
          isSelected && 'border-2 border-black',
          isPathSelected && 'bg-green-500',
          'w-16 h-16 bg-primary text-primary-foreground font-semibold rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-amber-500'
        )}
        onClick={() => onNodeClick(id)}
      >
        <span className='text-sm'>{data.label}</span>
        <Handle type='source' position={Position.Right} id='a' className='w-2 h-2 bg-white' />
        <Handle type='target' position={Position.Left} id='b' className='w-2 h-2 bg-white' />
      </div>
    </div>
  );
};
