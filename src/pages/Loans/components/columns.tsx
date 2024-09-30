import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { loan } from '../data/schema'

export const columns: ColumnDef<loan>[] = [
  // {
  //   id: 'select',
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && 'indeterminate')
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label='Select all'
  //       className='translate-y-[2px]'
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label='Select row'
  //       className='translate-y-[2px]'
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'customerName',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => {
      // Get the expand data for the current row
      const expandData = row.getValue('expand');
      const Name = expandData?.CustomerId?.Name || 'N/A'; // Safely access the PhoneNumber
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {Name}
          </span>
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      // Access the expanded data (nested)
      const expandData = row.original.expand;  // Access `row.original` for raw data
      const Name = expandData?.CustomerId?.Name || '';
      
      // Perform case-insensitive filtering
      return Name.toLowerCase().includes(filterValue.toLowerCase());
    }
  },
  {
    accessorKey: 'expand',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Phone' />
    ),
    cell: ({ row }) => {
      // Get the expand data for the current row
      const expandData = row.getValue('expand');
      const PhoneNumber = expandData?.CustomerId?.PhoneNumber || 'N/A'; // Safely access the PhoneNumber
  
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
            {PhoneNumber}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: 'Amount',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
             {`TSH ${row.getValue('Amount')}`}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'DateIssued',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='DateIssued' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {(row.getValue('DateIssued') as string).split(' ')[0]}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: 'DueDate',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='DueDate' />
    ),
    cell: ({ row }) => {
      return (
        <div className='flex space-x-2'>
          <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
          {(row.getValue('DueDate') as string).split(' ')[0]}
          </span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
