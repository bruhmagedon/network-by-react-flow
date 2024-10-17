//CompareSheet.tsx
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

interface CompareSheetProps {
  disabled?: boolean;
}

// CompareSheet.tsx
import { useState } from 'react';
import { useDijkstra } from '@/hooks/useDijkstra';
import { useFloyd } from '@/hooks/useFloyd';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

export function CompareSheet({ disabled }: CompareSheetProps) {
  const { findAllPairsDijkstra } = useDijkstra();
  const { floydWarshall } = useFloyd();
  const [comparisonData, setComparisonData] = useState<{
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dijkstra: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    floyd: any;
    times: { dijkstraTime: number; floydTime: number };
  } | null>(null);

  const handleCompare = () => {
    const dijkstraStart = performance.now();
    const dijkstraResults = findAllPairsDijkstra();
    const dijkstraTime = performance.now() - dijkstraStart;

    const floydStart = performance.now();
    // const floydResults = floydWarshall();
    const floydTime = performance.now() - floydStart;

    setComparisonData({
      dijkstra: dijkstraResults,
      floyd: 'floydResults',
      times: { dijkstraTime, floydTime }
    });
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant={'outline'} disabled={disabled} onClick={handleCompare}>
          Сравнить два алгоритма
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Сравнение алгоритмов</SheetTitle>
        </SheetHeader>
        <div className='grid gap-4 py-4'>
          {comparisonData && (
            <div>
              <p>Время выполнения Дейкстры: {comparisonData.times.dijkstraTime.toFixed(2)} ms</p>
              <p>Время выполнения Флойда: {comparisonData.times.floydTime.toFixed(2)} ms</p>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дейкстра</TableHead>
                    <TableHead>Флойд</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
                  {/* {comparisonData.dijkstra.map((row: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell>
                        {row.path.join(' → ')} (Вес: {row.totalWeight})
                      </TableCell>
                      <TableCell>
                        {comparisonData.floyd[index].path.join(' → ')} (Вес:{' '}
                        {comparisonData.floyd[index].totalWeight})
                      </TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type='submit'>Закрыть окно</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
