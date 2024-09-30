import { useEdge } from '@/hooks/useEdge';
import { useNode } from '@/hooks/useNode';
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { useState, useEffect, useMemo } from 'react';
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
import { createMatrixFromGraph } from './tableUtils';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const TableDrawer = () => {
  // В дальнейшем нужны буду больше
  const { nodes } = useNode();
  const { edges } = useEdge();
  const [data, setData] = useState<number[][]>([]);

  // Создаем матрицу из графа (ноды и дуги)
  useEffect(() => {
    if (data.length === 0) {
      const matrixData = createMatrixFromGraph(nodes, edges);
      setData(matrixData); // Устанавливаем данные только если они не установлены
    }
  }, []);

  useEffect(() => {
    console.log(data);
  }, [data]);

  const columns = useMemo<ColumnDef<number[]>[]>(
    () =>
      nodes.map((node, colIndex) => ({
        id: `node-${node.id}`, // Уникальный ID столбца
        header: node.data.label as string, // Название ноды как заголовок колонки
        accessorFn: (row) => row[colIndex], // Доступ к данным строки по индексу столбца
        cell: (
          { row: { index } } // Определяем, как рендерить ячейку
        ) => (
          <input
            type='number'
            value={data[index][colIndex] !== undefined ? data[index][colIndex] : ''} // Привязка значения напрямую к состоянию
            onChange={(e) => handleMatrixChange(index, colIndex, Number(e.target.value))} // Обновление состояния при изменении значения
            className='w-full'
          />
        )
      })),
    [nodes, data]
  ); // Данные и ноды в зависимостях

  // Обрабатываем изменение значения в таблице
  const handleMatrixChange = (rowIndex: number, colIndex: number, newWeight: number) => {
    setData((prevData) => {
      const updatedData = [...prevData]; // Копируем текущее состояние матрицы
      updatedData[rowIndex][colIndex] = newWeight; // Обновляем значение в матрице
      return updatedData;
    });
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel() // Основная модель для работы с данными таблицы
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
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className='w-[800px]'>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className='w-[100px]'>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
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
            {/* onClick={syncMatrixWithGraph} */}
            <Button>Изменить матрицу</Button>
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
