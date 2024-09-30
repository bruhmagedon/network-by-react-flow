import { useEdge } from '@/hooks/useEdge';
import { useNode } from '@/hooks/useNode';
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { useState, useEffect, useMemo } from 'react';
import { Button } from '../ui/button';
import { Minus, Plus } from 'lucide-react';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { createMatrixFromGraph } from './tableUtils';

const MAX_NODES = 10;
const MIN_NODES = 1;

const TableDrawer = () => {
  const { nodes, addNode, deleteNode } = useNode();
  const { edges, onConnect, deleteEdge, updateEdgeLabel } = useEdge();
  const [data, setData] = useState<number[][]>([]);

  // Создаём матрицу при инициализации
  useEffect(() => {
    const matrixData = createMatrixFromGraph(nodes, edges);
    setData(matrixData);
  }, [nodes, edges]);

  // Синхронизация матрицы с графом
  const syncMatrixWithGraph = () => {
    const matrixData = createMatrixFromGraph(nodes, edges);
    setData(matrixData);
  };

  // Обработка изменений в матрице
  const handleMatrixChange = (rowIndex: number, colIndex: number, newWeight: number) => {
    setData((prevData) => {
      const updatedData = [...prevData];
      const oldWeight = updatedData[rowIndex][colIndex];
      updatedData[rowIndex][colIndex] = newWeight;

      const sourceNode = nodes[rowIndex];
      const targetNode = nodes[colIndex];

      if (oldWeight === 0 && newWeight > 0) {
        onConnect({
          source: sourceNode.id,
          target: targetNode.id,
          sourceHandle: null,
          targetHandle: null
        });
      } else if (oldWeight > 0 && newWeight === 0) {
        const edgeToDelete = edges.find(
          (edge) => edge.source === sourceNode.id && edge.target === targetNode.id
        );
        if (edgeToDelete) deleteEdge(edgeToDelete.id);
      } else if (oldWeight !== newWeight) {
        const edgeToUpdate = edges.find(
          (edge) => edge.source === sourceNode.id && edge.target === targetNode.id
        );
        if (edgeToUpdate) updateEdgeLabel(edgeToUpdate.id, newWeight.toString());
      }

      return updatedData;
    });
  };

  // Увеличение количества узлов
  const increaseNodes = () => {
    if (nodes.length >= MAX_NODES) return;
    addNode(); // Добавляем новый узел через граф
    setData((prevData) => [...prevData, Array(nodes.length + 1).fill(0)].map((row) => [...row, 0])); // Добавляем строку и колонку
  };

  // Уменьшение количества узлов
  const decreaseNodes = () => {
    if (nodes.length <= MIN_NODES) return;

    const lastNode = nodes[nodes.length - 1]; // Последний узел
    deleteNode(lastNode.id); // Удаляем последний узел и его дуги
    setData((prevData) => prevData.slice(0, -1).map((row) => row.slice(0, -1))); // Удаляем строку и колонку
  };

  // Создаём колонки
  const columns = useMemo<ColumnDef<number[]>[]>(
    () =>
      nodes.map((node, colIndex) => ({
        id: `node-${node.id}`,
        header: node.data.label as string,
        accessorFn: (row) => row[colIndex],
        cell: ({ row: { index } }) => (
          <input
            type='number'
            value={data[index][colIndex] !== undefined ? data[index][colIndex] : ''}
            onChange={(e) => handleMatrixChange(index, colIndex, Number(e.target.value))}
            className={`w-full ${data[index][colIndex] === 0 ? 'text-gray-400' : 'text-black'}`} // Цвет текста в зависимости от значения
          />
        )
      })),
    [nodes, data]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant='outline'>Матрица инцидентности</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className='mx-auto max-w-[1000px]'>
          <DrawerHeader>
            <DrawerTitle>Матрица инцидентности</DrawerTitle>
            <DrawerDescription>Эта матрица выполняет роль матрицы весов</DrawerDescription>
          </DrawerHeader>
          <div className='flex justify-center'>
            <Table className='max-w-[1000px] border'>
              <TableHeader className='rounded-lg'>
                <TableRow>
                  {/* Пустая ячейка для верхнего левого угла таблицы */}
                  <TableHead className='w-[100px]' />
                  {table.getHeaderGroups().map((headerGroup) =>
                    headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className='w-[100px]'>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row, rowIndex) => (
                  <TableRow key={row.id}>
                    {/* Названия узлов в первой колонке */}
                    <TableCell className='w-[100px] text-center'>
                      {nodes[rowIndex].data.label as string}
                    </TableCell>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className='border max-w-[50px]'>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <DrawerFooter>
            <div className='flex items-center justify-center space-x-2'>
              {/* Кнопка уменьшения количества узлов */}
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 shrink-0 rounded-full'
                onClick={decreaseNodes}
              >
                <Minus className='h-4 w-4' />
                <span className='sr-only'>Decrease</span>
              </Button>

              {/* Отображение количества узлов */}
              <span className='text-lg'>{nodes.length} </span>

              {/* Кнопка увеличения количества узлов */}
              <Button
                variant='outline'
                size='icon'
                className='h-8 w-8 shrink-0 rounded-full'
                onClick={increaseNodes}
              >
                <Plus className='h-4 w-4' />
                <span className='sr-only'>Increase</span>
              </Button>
            </div>

            <Button onClick={syncMatrixWithGraph}>Синхронизировать матрицу</Button>
            <DrawerClose asChild>
              <Button variant='outline'>Закрыть окно</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default TableDrawer;
