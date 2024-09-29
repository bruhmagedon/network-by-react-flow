import { cn } from '@/lib/utils';
import { Counter } from './Counter';
import { Panel } from '@xyflow/react';

interface SidebarProps {
  className?: string;
}

export const Sidebar = (props: SidebarProps) => {
  return (
    <Panel
      position='top-right'
      className='w-[15%] h-[80%] bg-[#2c2c2c]/80 p-8 rounded-2xl flex flex-col items-center gap-10'
    >
      {'Sidebar'}
    </Panel>
  );
};
