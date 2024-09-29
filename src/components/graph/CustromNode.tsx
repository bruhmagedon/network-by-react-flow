import { StateSchema } from '@/app/store/StateSchema';
import { AppDispatch } from '@/app/store/store';
import { edgeSlice } from '@/features/edge/edgeSlice';
import { selectNode } from '@/features/node/nodeSlice';
import { cn } from '@/lib/utils';
import { NodeProps, Handle, Position } from '@xyflow/react';
import { useDispatch, useSelector } from 'react-redux';

export interface CustomNodeProps extends NodeProps {
  data: {
    label: string;
  };
}

export const CustomNode = ({ id, data }: CustomNodeProps) => {
  const dispatch: AppDispatch = useDispatch();
  const selectedNodeId = useSelector((state: StateSchema) => state.nodes.selectedNode?.id);

  const isSelected = id === selectedNodeId;

  const handleNodeClick = () => {
    dispatch(edgeSlice.actions.resetSelection());
    dispatch(selectNode(id));
  };

  return (
    // TODO проблемы с селектом при нажатии на текст (чекнуть в чем может быть дело)
    <div
      className={cn(
        isSelected && 'border-2 border-cyan-700',
        'w-16 h-16 bg-cyan-500 text-white rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:bg-teal-500'
      )}
      onClick={handleNodeClick} // Обработка клика
    >
      <span className='text-sm'>{data.label}</span>
      <Handle type='source' position={Position.Right} id='a' className='w-2 h-2 bg-white' />
      <Handle type='target' position={Position.Left} id='b' className='w-2 h-2 bg-white' />
    </div>
  );
};
