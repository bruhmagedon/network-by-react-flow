import { NodeTable } from '../TableDrawer/TableDrawer';
import { Button } from '../ui/button';
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose
} from '../ui/drawer';
import { useNode } from '@/hooks/useNode';

interface TableDrawerProps {
  disabled?: boolean;
}

const TableDrawer = ({ disabled }: TableDrawerProps) => {
  const { nodes, addNode } = useNode();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant='outline' disabled={disabled}>
          Матрица инцидентности
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='mx-auto max-w-[1000px]'>
          <DrawerHeader>
            <DrawerTitle>Матрица инцидентности</DrawerTitle>
            <DrawerDescription>Эта матрица выполняет роль матрицы весов</DrawerDescription>
          </DrawerHeader>
          <div className='flex justify-center'>
            {nodes.length > 0 ? (
              <NodeTable />
            ) : (
              <Button className='w-[250px]' onClick={addNode} size={'lg'}>
                Добавить первый узел
              </Button>
            )}
          </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button className='w-[250px]' variant='outline' size={'lg'}>
                Закрыть окно
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TableDrawer;
