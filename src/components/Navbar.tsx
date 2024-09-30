import { Panel } from '@xyflow/react';
import { Button } from './ui/button';
import { useNode } from '@/hooks/useNode';
import TableDrawer from './TableDrawer/TableDrawer';

export const Navbar = () => {
  const { addNode } = useNode();
  return (
    <Panel
      position='bottom-center'
      className='bg-[#2c2c2c]/80 p-4 rounded-lg flex items-center gap-3'
    >
      <Button onClick={addNode}>Добавить узел</Button>
      <TableDrawer />
    </Panel>
  );
};

// Функция создания матрицы инцидентности из графа
