import { edgeActions } from '@/features/edge';
import { nodeActions } from '../model/nodeSlice';
import { cn } from '@/lib/utils';
import { NodeProps, Handle, Position } from '@xyflow/react';
import { useSelector } from 'react-redux';
import { getSelectedNode } from '../selectors/getNodes';
import { useAppDispatch } from '@/hooks/useAppDispatch';

export interface CustomNodeProps extends NodeProps {
  data: {
    label: string;
  };
}

export const CustomNode = ({ id, data }: CustomNodeProps) => {
  const dispatch = useAppDispatch();

  const selectedNode = useSelector(getSelectedNode);
  const isSelected = id === selectedNode?.id;

  const handleNodeClick = () => {
    dispatch(edgeActions.resetSelection());
    dispatch(nodeActions.selectNode(id));
  };

  return (
    // TODO проблемы с селектом при нажатии на текст (чекнуть в чем может быть дело)
    <div
      className={cn(
        isSelected && 'border-2 border-cyan-700',
        'w-16 h-16 bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-teal-500'
      )}
      onClick={handleNodeClick}
    >
      <span className='text-sm'>{data.label}</span>
      <Handle type='source' position={Position.Right} id='a' className='w-2 h-2 bg-white' />
      <Handle type='target' position={Position.Left} id='b' className='w-2 h-2 bg-white' />
    </div>
  );
};
