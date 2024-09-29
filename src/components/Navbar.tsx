import { Edge, Node, Panel } from '@xyflow/react';
import { Button } from './ui/button';
import { dijkstra } from '@/utils/dijkstra';
import { useState } from 'react';

interface NavbarProps {
  className?: string;
  nodes: Node[];
  edges: Edge[];
  addNode: () => void;
}

export const Navbar = ({ addNode }: NavbarProps) => {
  return (
    <Panel
      position='bottom-center'
      className='bg-[#2c2c2c]/80 p-4 rounded-lg flex items-center gap-3'
    >
      <Button size='sm' onClick={addNode}>
        Добавить узел
      </Button>
    </Panel>
  );
};

// const [path, setPath] = useState<string[]>([]);

// const calculateShortestPath = (startId: string, targetId: string) => {
//   // const result = dijkstra(
//   //   nodes.map((node) => ({ id: node.id })),
//   //   edges.map((edge) => ({
//   //     id: edge.id,
//   //     source: edge.source,
//   //     target: edge.target,
//   //     weight: edge.data.weight
//   //   })),
//   //   startId,
//   //   targetId
//   // );
//   // console.log('Кратчайший путь:', result);
//   // setPath(result.path);
// };

{
  /* <Button size='sm' onClick={() => calculateShortestPath('1', '3')}>
        Найти кратчайший путь
      </Button> */
}
{
  /* <div>{path.length > 0 && <p>Кратчайший путь: {path.join(' -> ')}</p>}</div> */
}
