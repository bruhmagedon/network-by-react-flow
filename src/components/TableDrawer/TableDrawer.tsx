import { useEdge } from '@/hooks/useEdge';
import { useNode } from '@/hooks/useNode';
import { ColumnDef, useReactTable, getCoreRowModel, flexRender } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { Button } from '../ui/button';
import { Minus, Plus } from 'lucide-react';

const MAX_NODES = 10; // Максимальное количество узлов
const MIN_NODES = 1; // Минимальное количество узлов

export const NodeTable = () => {
  const { nodes, addNode, deleteNode } = useNode(); // Методы работы с узлами
  const { edges, onConnect, deleteEdge, updateEdgeLabel } = useEdge(); // Методы работы с дугами
  const [data, setData] = useState<number[][]>([]);

  // Универсальная функция синхронизации графа с матрицей
  const syncMatrixWithGraph = useCallback(() => {
    // Инициализируем матрицу с нулями
    const matrixData = nodes.map(() => Array(nodes.length).fill(0));

    // Проходим по ребрам и заполняем матрицу весами
    edges.forEach((edge) => {
      const sourceIndex = nodes.findIndex((node) => node.id === edge.source);
      const targetIndex = nodes.findIndex((node) => node.id === edge.target);

      if (sourceIndex !== -1 && targetIndex !== -1) {
        matrixData[sourceIndex][targetIndex] = parseInt(edge.label as string, 10);
      }
    });

    setData(matrixData); // Обновляем состояние матрицы
  }, [nodes, edges]);

  // Вызываем функцию синхронизации каждый раз, когда изменяются узлы или ребра
  useEffect(() => {
    syncMatrixWithGraph();
  }, [syncMatrixWithGraph]);

  // Обработка изменения значения в таблице
  // Новый handleMatrixChange с отложенной синхронизацией глобального состояния
  const handleMatrixChange = useCallback(
    (rowIndex: number, colIndex: number, newWeight: number) => {
      setData((prevData) => {
        const updatedData = [...prevData];
        updatedData[rowIndex] = [...updatedData[rowIndex]]; // Обновляем конкретную строку
        updatedData[rowIndex][colIndex] = newWeight;

        const sourceNode = nodes[rowIndex];
        const targetNode = nodes[colIndex];
        const oldWeight = prevData[rowIndex][colIndex];

        // Откладываем обновление графа с использованием setTimeout
        setTimeout(() => {
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
        }, 0);

        return updatedData;
      });
    },
    [deleteEdge, edges, nodes, onConnect, updateEdgeLabel]
  );

  // Увеличение количества узлов
  const increaseNodes = () => {
    if (nodes.length >= MAX_NODES) return;
    addNode(); // Добавляем новый узел через граф
    setData((prevData) => [...prevData, Array(nodes.length + 1).fill(0)].map((row) => [...row, 0])); // Добавляем строку и колонку
  };

  // Уменьшение количества узлов
  const decreaseNodes = () => {
    if (nodes.length <= MIN_NODES) return;

    const lastNode = nodes[nodes.length - 1]; // Получаем последний узел
    deleteNode(lastNode.id); // Удаляем последний узел
    setData((prevData) => prevData.slice(0, -1).map((row) => row.slice(0, -1))); // Удаляем строку и колонку
  };

  // Создаем колонки для таблицы
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
            className={`w-full ${data[index][colIndex] === 0 ? 'text-gray-400' : 'text-black'}`}
            disabled={index === colIndex}
          />
        )
      })),
    [nodes, data, handleMatrixChange]
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div>
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

      {/* Добавляем кнопки для увеличения и уменьшения количества узлов */}
      <div className='flex items-center justify-center space-x-2 mt-4'>
        <Button variant='outline' size='icon' onClick={decreaseNodes}>
          <Minus className='h-4 w-4' />
          <span className='sr-only'>Decrease</span>
        </Button>

        {/* Отображение количества узлов */}
        <span className='text-lg'>{nodes.length}</span>

        <Button variant='outline' size='icon' onClick={increaseNodes}>
          <Plus className='h-4 w-4' />
          <span className='sr-only'>Increase</span>
        </Button>
      </div>
    </div>
  );
};
