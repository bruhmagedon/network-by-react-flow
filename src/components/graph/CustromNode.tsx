import { NodeProps, Handle, Position, Node } from '@xyflow/react';

interface CustomNodeProps extends NodeProps {
  data: {
    label: string;
  };
}

export const CustomNode = ({ data }: CustomNodeProps) => {
  return (
    <div className='w-16 h-16 hover:bg-blue-600 bg-blue-500 text-white rounded-full flex items-center justify-center shadow-lg '>
      <span>{data.label}</span>
      {/* Handle для соединения с другими узлами */}
      <Handle type='source' position={Position.Right} id='a' className='w-2 h-2 bg-white' />
      <Handle type='target' position={Position.Left} id='b' className='w-2 h-2 bg-white' />
    </div>
  );
};
