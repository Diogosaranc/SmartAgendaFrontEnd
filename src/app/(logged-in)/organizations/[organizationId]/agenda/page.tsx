'use client';

import { useState } from 'react';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useGetAppointmentsByMonth } from '@/hooks/use-appointments';
import { useOrganizationId } from '@/hooks/use-organization-id';
import { Appointment } from '@/lib/api/appointments';

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

const months = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

const years = [
  new Date().getFullYear() - 1,
  new Date().getFullYear(),
  new Date().getFullYear() + 1,
];

// Define columns for the table
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<Appointment, any>[] = [
  {
    accessorKey: 'date',
    header: 'Data',
    cell: ({ row }) => {
      const date = row.getValue('date') as string;
      return new Date(date).toLocaleDateString('pt-BR');
    },
  },
  {
    accessorKey: 'description',
    header: 'Descrição',
    cell: ({ row }) => {
      const description = row.getValue('description') as string;
      return description || '-';
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'customerId',
    header: 'Cliente ID',
  },
];

export default function AgendaPage() {
  const organizationId = useOrganizationId();

  const [date, setDate] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const { data: appointments = [], isLoading } = useGetAppointmentsByMonth(
    organizationId,
    date.month,
    date.year
  );

  // Debug logging
  console.log('Debug info:', {
    organizationId,
    month: date.month,
    year: date.year,
    appointments,
    appointmentsLength: appointments.length,
    isLoading,
  });

  const table = useReactTable({
    data: appointments,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <h1 className='text-2xl font-bold'>Agendamentos</h1>
        </CardHeader>
        <CardContent>
          <p>Carregando agendamentos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between'>
        <h1 className='text-2xl font-bold'>
          Agendamentos ({appointments.length})
        </h1>
        <div className='flex gap-2'>
          <Select
            value={date.month.toString()}
            onValueChange={(value) =>
              setDate((prev) => ({ ...prev, month: parseInt(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Mês' />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={(index + 1).toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={date.year.toString()}
            onValueChange={(value) =>
              setDate((prev) => ({ ...prev, year: parseInt(value) }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder='Ano' />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div></div>
        <div className='overflow-hidden rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    Nenhum agendamento encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
