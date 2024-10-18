// CompareSheet.tsx
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
import { useState } from 'react';
import { debugPairs, useDijkstra } from '@/hooks/useDijkstra';
import { useFloyd } from '@/hooks/useFloyd';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

interface CompareSheetProps {
  disabled?: boolean;
}

export function CompareSheet({ disabled }: CompareSheetProps) {
  const { findAllPairsDijkstra } = useDijkstra();
  const { floydWarshall } = useFloyd();
  const [comparisonData, setComparisonData] = useState<{
    dijkstra: debugPairs[];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    floyd: any;
    times: { dijkstraTime: number; floydTime: number };
  } | null>(null);

  const handleCompare = () => {
    const dijkstraStart = performance.now();
    const dijkstraResults = findAllPairsDijkstra();
    const dijkstraTime = performance.now() - dijkstraStart;

    const floydStart = performance.now();
    const floydResults = floydWarshall();
    const floydTime = performance.now() - floydStart;

    setComparisonData({
      dijkstra: dijkstraResults,
      floyd: floydResults,
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
      <SheetContent className='overflow-auto'>
        <SheetHeader>
          <SheetTitle>Сравнение алгоритмов</SheetTitle>
        </SheetHeader>
        <div className='grid gap-4 py-4'>
          {comparisonData && (
            <div className=''>
              <p>
                Время выполнения алгоритма Дейкстры: {comparisonData.times.dijkstraTime.toFixed(2)}{' '}
                ms
              </p>
              <p>
                Время выполнения алгоритма Флойда: {comparisonData.times.floydTime.toFixed(2)} ms
              </p>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Дейкстра</TableHead>
                    <TableHead>Флойд</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonData.dijkstra.map((row, rowIndex: number) => (
                    <TableRow key={rowIndex}>
                      <TableCell>
                        {row.map((cell) => (
                          <span key={cell.debugString}>
                            <p className='font-medium'>{cell.debugString.split(': ')[0]}</p>
                            <p>{cell.debugString.split(': ')[1]}</p>
                            <br />
                          </span>
                        ))}
                      </TableCell>
                      <TableCell>
                        {row.map((cell) => (
                          <span key={cell.debugString}>
                            <p className='font-medium'>{cell.debugString.split(': ')[0]}</p>
                            <p>{cell.debugString.split(': ')[1]}</p>
                            <br />
                          </span>
                        ))}
                      </TableCell>
                    </TableRow>
                  ))}
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
